const mongoose = require('mongoose');

const connectDB = () =>{
 mongoose.connect(process.env.DB_URI)
 .then(()=>{
    console.log("MongoDB connected successfully");
 })
 .catch((error)=>{
  
    console.error("Error connecting to MongoDB:", error.message);
        
 })
}
module.exports=connectDB;