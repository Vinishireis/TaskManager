const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("MongoDB Conectado");
    } catch (err) {
        console.error("Erro ao Conectar ao MongoDB", err)
        process.exit(1)
    }
}

module.exports = connectDB