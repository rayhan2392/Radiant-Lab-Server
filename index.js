const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Radiant lab is running')
})



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6hdjpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const uri = `mongodb+srv://radiantLab:WDrNFblnboZK0OEd@cluster0.s6hdjpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  // console.log(process.env.DB_USER)
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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const allTestCollection = client.db('radinatLab').collection('allTests')
    const userCollection = client.db('radinatLab').collection('users')
    const bookingCollection = client.db('radinatLab').collection('Bookings')
    


// All test related api

//get all the test
app.get('/allTests',async(req,res)=>{
    const result = await allTestCollection.find().toArray();
    res.send(result)
})

//get a single test
app.get('/allTests/:id',async(req,res)=>{
  const id = req.params.id
  const query = {_id:new ObjectId(id)}
  const result = await allTestCollection.findOne(query);
  res.send(result)
})

  //all user related api

  // post all the user to the database
  app.post('/users',async(req,res)=>{
    const userInfo = req.body;
    const result = await userCollection.insertOne(userInfo);
    res.send(result);
    console.log(result);
  })

  // get all user data
  app.get('/users',async(req,res)=>{
    const result = await userCollection.find().toArray()
    res.send(result);
  })

  //get a single user data
  app.get('/users/:id',async(req,res)=>{
    // const email = req.query.email
    // const email = req.body.email;
    // const id = req.params.id;
    // console.log(id)
    // console.log(email);
    // const query = {email:email}
    // console.log(email)
    // const result = await userCollection.findOne(query);
    // res.send(result);
  })

  // test booking related api 
  app.post('/bookings',async(req,res)=>{
    const bookingInfo = req.body;
    const result = await bookingCollection.insertOne(bookingInfo);
    res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.listen(port,()=>{
    console.log(`Radiant lab is running on PORT ${port}`)
    })