const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/photos', async (req, res) => {
    const albumId = req.query.albumId;
    const { data } = await axios.get(
        'https://jsonplaceholder.typicode.com/photos',
        {
            params: {
                albumId: albumId
            }
        }
    );
    res.json(data);
});

app.listen(3000);