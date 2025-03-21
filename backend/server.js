const express = require('express');
const app = express();
require('dotenv').config();
const Months = require('./model/months.model.js')

const connectDB = require('./config/connectDB.config.js')

connectDB();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/admin', require('./routes/user.routes.js'));
app.use('/api/class', require('./routes/class.routes.js'));
app.use('/api/student', require('./routes/student.routes.js'));

// app.post('/api/months', async (req, res) => {
//     const month = "December";
//     const newDay = await Months.create({
//         month
//     })

//     res.status(200).json({ message: "added" ,newDay})
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})