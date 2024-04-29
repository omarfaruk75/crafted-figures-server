const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



//Middleware
// Middleware Connections
  const corsConfig = {
  origin: ["http://localhost:5173","https://crafted-figures-auth.web.app"],
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lcaz14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const craftCollection = client.db('craftDB').collection('craft');
   
    app.get('/additem',async(req,res)=>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

      app.get('/additem/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.findOne(query);
      res.send(result);

    })


    app.post('/additem',async(req,res)=>{
      const craftItem = req.body;
      // console.log(craftItem);
      const result = await craftCollection.insertOne(craftItem);
      res.send(result);
    })

    app.put('/additem/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true};
      const updateCraftItem = req.body;
      const craftItem = {
        $set: {
          itemName:updateCraftItem.itemName, 
          stockStatus:updateCraftItem.stockStatus,
           subCategory:updateCraftItem.subCategory, 
           shortDescription:updateCraftItem.name,
            price:updateCraftItem.price, 
            rating:updateCraftItem.rating,
             processingTime:updateCraftItem.processingTime,
              image:updateCraftItem.image, 
              customizeAnswer:updateCraftItem.customizeAnswer
        }
      }
      const result = await craftCollection.updateOne(filter, craftItem,options);
      res.send(result);
    })

    app.delete('/additem/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await craftCollection.deleteOne(query);
      res.send(result);

    })





    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/",(req,res)=>{
    res.send('hello from express js');
})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})
