const express = require('express');
const app = express();
require('dotenv').config();

const connectDB = require('./config/connectDB.config.js')

connectDB();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/admin', require('./routes/admin.routes.js'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})