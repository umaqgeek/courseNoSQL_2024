const mongoose = require('mongoose');

const DRIVER = "mongodb";
const HOST = "127.0.0.1";
const PORT = "27017";
const DATABASE = "mymongodb";
const mongoURI = `${DRIVER}://${HOST}:${PORT}/${DATABASE}?directConnection=true&serverSelectionTimeoutMS=2000`;

const MODEL = {
    PHOTO: "Photo",
};

const photoSchema = new mongoose.Schema({
    albumId: Number,
    id: Number,
    title: String,
    url: String,
    thumbnailUrl: String,
});

const PhotoModel = mongoose.model(MODEL.PHOTO, photoSchema);

const startMongo = async () => {
    console.log('Connecting to MongoDB ...');
    await mongoose.connect(mongoURI)
        .then(() => {
            console.log('Connection to MongoDB successful.');
        })
        .catch(err => console.error(err));
};

module.exports = {
    startMongo,
    PhotoModel,
};