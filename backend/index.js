const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const app = express();
app.use(express.json());
const cors=require("cors");
app.use(cors());
const connectDB = require('./config/db');

//================ Connect DB==========================
connectDB();

//================ Routes ==========================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todo'));


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));