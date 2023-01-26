const mongoose = require('mongoose')
const mongooseURI = "mongodb://localhost:27017/iNotebook"

const connectToMongo = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongooseURI, () => {
        console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo