const mongoose = require("mongoose")
const url = "mongodb+srv://arif:tSt0CJFEg2GgqJQs@cluster0.ufr2nrv.mongodb.net/tasklist?retryWrites=true&w=majority"
console.log(url)
mongoose.connect(url).then(() => {
    console.log("connection successfull")
}).catch((err) => {

    console.log("connection refused*****************")
    console.log(errror.message)
})
