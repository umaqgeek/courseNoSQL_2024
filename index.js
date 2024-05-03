const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('./modules/redis');
const Mongo = require('./modules/mongo');

Mongo.startMongo(); // start mongodb connection
Redis.startRedis(); // start redis connection

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');

app.get('/tambah-data', async (req, res) => {
    const title = req.query.title || '';
    if (title) {
        await Mongo.PhotoModel.insertMany([{
            title,
        }]);
        res.send(title + ' created successfully.');
    } else {
        res.send('Please do not leave title blank!');
    }
});

app.get('/buang-data', async (req, res) => {
    const title = req.query.title || '';
    const price = req.query.price || 0;
    const id = req.query.id || 0;
    if (title || price || id) {
        const status = await Mongo.PhotoModel.deleteMany({
            '$or': [
                {
                    title: new RegExp(title, 'i'),
                },
                {
                    price: { '$eq': price },
                },
                {
                    id: { '$eq': id },
                },
            ]
        });
        if (status.deletedCount != 0) {
            res.send('Data is deleted successfully.');
        } else {
            res.send('Nothing been deleted.');
        }
    } else {
        res.send('Title or price or ID is required!');
    }
});

app.get('/load-photos', async (_, res) => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos');
    
    // store in MongoDB
    await Mongo.PhotoModel.deleteMany({});
    await Mongo.PhotoModel.insertMany(data);

    // store in Redis
    await Redis.redisClient.flushAll();
    await Redis.redisClient.set(Redis.KEY.PHOTOS, '');
    await Redis.redisClient.set(Redis.KEY.PHOTOS, JSON.stringify(data));

    res.send("The photos were successfully loaded. <a href='/'>&lt; Back</a>");
});

app.get('/', async (req, res) => {
    const startTime = (Date.now());

    var limit = req.query.limit || 10;
    var offset = req.query.offset || 0;
    var search = req.query.search || '';
    const pattern = Redis.KEY.PHOTOS + ':' + limit + ':' + offset + ':' + search.replace(/\s/g, '_');

    const find = search ? {
        title: new RegExp(search, 'ig')
    } : {};

    const photoPattern = await Redis.redisClient.get(pattern);
    var photos = [];

    if (photoPattern) {
        photos = JSON.parse(photoPattern);
    } else {
        photos = await Mongo.PhotoModel
            .find(find)
            .limit(limit)
            .skip(offset);

        await Redis.redisClient.set(pattern, JSON.stringify(photos));
    }

    const photosAllCount = await Mongo.PhotoModel.countDocuments(find);

    const endTime = (Date.now());
    const diffTime = endTime - startTime;

    res.render('index', {
        photos,
        photosAllCount,
        limit: photos.length,
        offset,
        search,
        diffTime,
    });
});

app.listen(3000, function () {
    console.log("Server listening on port 3000\nThe app running on this URL http://localhost:3000");
});