const express = require("express")
const cors = require("cors")
const app = express()
const port = 4000
//file import
require("./connection/connection")
const Mydb = require("./modal/modal")
app.use(express.json())
app.use(express.urlencoded())
const corsOpts = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Type']
};
app.use(cors(corsOpts));

//request handeler
//get request
app.get("/", async (req, res) => {
    try {

        console.log("got get request")
        const data = await Mydb.find({})
        console.log(data)
        res.send(data)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).json({ message: false })
    }
})
//post request
app.post("/add", async (req, res) => {
    try {

        const { title, desc, date, status } = req.body

        const saveData = new Mydb({
            title, desc, date, status
        })
        await saveData.save()
        const data = await Mydb.find({})
        console.log(data)
        res.send(data)
    } catch (err) {
        console.log(err.message)
    }
})
// delete request**********
app.post("/delete", async (req, res) => {
    const _id = req.body._id

    console.log(_id)
    console.log("delete request")
    try {

        await Mydb.findByIdAndDelete({ _id })
        console.log(" deleted")
        const data = await Mydb.find({})
        res.send(data)
    } catch (err) {
        res.status(400).json({ message: false })
    }

})
// put request
app.post("/update", async (req, res) => {
    try {

        console.log("from udtated")
        console.log("im request.body")
        console.log(req.body)
        const { title, desc, date, status, _id } = req.body
        console.log(_id)

        // const data = await Mydb.findById({ _id })
        await Mydb.findByIdAndUpdate(_id, { title, desc, date, status, }, { new: true })
        const data = await Mydb.find()

        res.send(data)
    } catch (err) {
        res.status(400).json({ mesage: false })
        console.log(err.message)
    }


})
//fnd by id 
app.post("/findById", async (req, res) => {
    try {
        const { _id } = req.body
        const data = await Mydb.findById(_id)
        res.send(data)

    } catch (error) {
        res.status(400).json({ message: false })
    }
})
//filter request
app.post("/filter", async (req, res) => {
    try {

        const { filter, search } = req.body
        console.log("i m filter")

        console.log(req.body)
        let data = []
        if (filter == "allTask") {
            data = await Mydb.find({})
            if (search != "") {

                const filtered = data.filter((item) => {
                    return item.title.includes(search)
                })
                res.send(filtered)
                return
            }


        }
        else {

            data = await Mydb.find({ status: filter })
            if (search != "") {

                const filtered = data.filter((item) => {
                    console.log("item.title")
                    console.log(item.title)
                    return item.title.includes(search)
                })
                res.send(filtered)
                return
            }

        }
        console.log(data)
        res.send(data)
    }
    catch (err) {
        res.status(400).json({ message: false })
    }
})
app.listen(port, (err) => {
    if (err) {
        console.log(err.message)
    }
    console.log("listening at port" + port)
})