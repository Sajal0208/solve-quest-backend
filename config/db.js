const mongoose = require('mongoose')
mongoose.set("strictQuery", false);


const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    try{
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch(error){
        console.log(error);
        process.exit(1)
    }
}
module.exports = connectDB
