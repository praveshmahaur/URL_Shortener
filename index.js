const express = require('express');
const app = express();

const { connectToMongoDB } = require('./db/connection');
const urlRoute = require('./routes/url_router');
const URL = require('./models/url_model');
const PORT = process.env.PORT || 8000;

connectToMongoDB("mongodb://localhost:27017/short-url")
    .then(() => console.log('MongoDB connected'));

app.use(express.json());
app.use('/url', urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    });
    res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
    console.log(`Server running at https://localhost:${PORT}`);
});