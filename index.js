const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

const redisClient = Redis.createClient({
    host: 'localhost',
    port: 6379,
});
const DEFAULT_EXPIRATION = 10; // 10 seconds

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/photos', async (req, res) => {
    const albumId = req.query.albumId;

    if (!await redisClient.isOpen) {
        await redisClient.connect();
    }

    const photosStr = await redisClient.get('photos');
    const photos = JSON.parse(photosStr);

    if (photos) {
        res.json(photos);
    } else {
        const { data } = await axios.get(
            'https://jsonplaceholder.typicode.com/photos',
            {
                params: {
                    albumId: albumId
                }
            }
        );
        await redisClient.setEx('photos', DEFAULT_EXPIRATION, JSON.stringify(data));
        res.json(data);
    }
});

app.listen(3000);