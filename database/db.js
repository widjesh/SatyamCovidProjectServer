const mongoose = require('mongoose');
require('dotenv').config();
const dbString = process.env.DB_STRING;
mongoose.connect(dbString,(err)=>{
    if(!err){
        console.log('Database Connected Successfully');
    }else{
        console.log(`Connection failed due to ${err}`);
    }
});

module.exports = mongoose;