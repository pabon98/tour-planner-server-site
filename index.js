const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// middleware
app.use(cors());
app.use(express.json());

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
    const orderCollection = database.collection("orders");

    //GET Products API
    app.get('/services', async(req,res)=>{
        const cursor = servicesCollection.find({})
        const services = await cursor.toArray()
        res.send(services)
    })
    // GET Single Tour
    app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        // console.log('getting specific service', id);
        const query = { _id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.send(service);
      })
      // GET API (get orders by email)
    app.get("/myOrders/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = await orderCollection.find(query);
      const myOrders = await cursor.toArray();
      res.send(myOrders);
  })
  app.post('/services', async (req, res) => {
        const services = req.body;
        console.log("hit the post api", services);
        const result = await servicesCollection.insertOne(services);
        console.log(result);
        console.log(services);
        res.json(result);
      });
  // POST API
app.post('/placeOrder', async (req, res) => {
  const orderDetails = req.body;
  const result = await orderCollection.insertOne(orderDetails);
  res.json(result);
})
  // DELETE API 
  app.delete("/deleteOrder/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
})
 // GET API (get all orders)
 app.get('/orders', async (req, res) => {
  const query = {};
  const cursor = orderCollection.find(query);
  const orders = await cursor.toArray();
  res.send(orders);
})
// UPDATE API
app.put("/approve/:id", async (req, res) => {
  const id = req.params.id;
  const approvedOrder = req.body;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
      $set: {
          status: approvedOrder.status
      },
  };

    
    
      const result = await orderCollection.updateOne(filter, updateDoc, options);
      res.json(result);
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