const mongoose = require('mongoose')
mongoose.set("strictQuery", false);


const connectDB = async () => {
    const uri = "mongodb+srv://sajaldewangan:zzmR82dauQ0BF84v@cluster0.esg8lx2.mongodb.net/solvequest?retryWrites=true&w=majority";
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
