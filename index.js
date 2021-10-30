const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzm3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//for connecting database
async function run(){
    try{
      await client.connect()
    //   console.log('connected to database')
    const database = client.db("holidayPlanner")
    const servicesCollection = database.collection('services')

    //GET Products API
    app.get('/services', async(req,res)=>{
        const cursor = servicesCollection.find({})
        const services = await cursor.toArray()
        res.send(services)
    })

    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req,res)=>{
    res.send("Running Tour Planner")
})
app.listen(port, ()=>{
    console.log('Running tour planner Server on port', port)
})