const mongoose = require("mongoose")
const Mydb = new mongoose.model("mydb", {
    title: String,
    desc: String,
    date: String,
    status: String

})
module.exports = Mydb