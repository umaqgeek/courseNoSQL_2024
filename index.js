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

app.get('/load-photos', async (_, res) => {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/photos');
    
    // store in MongoDB
    await Mongo.PhotoModel.deleteMany({});
    await Mongo.PhotoModel.insertMany(data);

    // store in Redis
    await Redis.redisClient.set('photos', '');
    await Redis.redisClient.set('photos', JSON.stringify(data));

    res.send("The photos were successfully loaded. <a href='/'>&lt; Back</a>");
});

app.get('/', async (req, res) => {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const search = req.query.search || '';

    const find = search ? {
        title: new RegExp(search, 'ig')
    } : {};

    const photos = await Mongo.PhotoModel
        .find(find)
        .limit(limit)
        .skip(offset);
    const photosAllCount = await Mongo.PhotoModel
        .countDocuments(find);

    res.render('index', {
        photos,
        photosAllCount,
        limit: photos.length,
        offset,
        search,
    });
});

app.listen(3000, function () {
    console.log("Server listening on port 3000\nThe app running on this URL http://localhost:3000");
});