const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
console.log(process.env.STRIPE_SECRET_KEY)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Radiant lab is running')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6hdjpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const bannerCollection = client.db('radinatLab').collection('Banners')
    


//    --------- All test related api starts ---------

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

// post a single test by admin
app.post('/allTests',async(req,res)=>{
  const newTest = req.body;
  const result = await allTestCollection.insertOne(newTest);
  res.send(result);
})

// delete a single test by admin
app.delete('/allTests/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:new ObjectId(id)}
  const result = await allTestCollection.deleteOne(query);
  res.send(result)
})

//update a single test
app.put('/allTests/:id',async(req,res)=>{
  const id = req.params.id;
  const updatedTest = req.body;
  const filter ={_id:new ObjectId(id)}
  const updatedDoc = {
    $set:{
      test_name:updatedTest.test_name,
      image:updatedTest.image,
      details:updatedTest.details,
      date:updatedTest.date,
      price:updatedTest.price,
      slots:updatedTest.slots
    }
  }
  const result = await allTestCollection.updateOne(filter,updatedDoc)
  res.send(result)
})

// -------test related api ends ----------

  //---------all user related api starts-----

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

  //block a single user
  app.patch('/users/:id',async(req,res)=>{
    const id = req.params;
    const filter = {_id: new ObjectId(id)}
    const updatedDoc = {
      $set:{
        status:'blocked'
      }
    }
    const result = await userCollection.updateOne(filter,updatedDoc)
    res.send(result);
  })

  //make a regular user to admin
  app.patch('/users/admin/:id',async(req,res)=>{
    const id = req.params.id;
    const filter ={_id: new ObjectId(id)}
    const updatedDoc = {
      $set:{
        role:'admin'
      }
    }
    const result =await userCollection.updateOne(filter,updatedDoc)
    res.send(result);
  })

  //check an use whether he is admin or not
  app.get('/users/admin/:email',async(req,res)=>{
    const email = req.params.email;
    const query = {email:email}
    const user = await userCollection.findOne(query)
    let admin = false;
    if(user){
      admin = user?.role === 'admin'
    }
    res.send({admin})
  })

  //--------All user related api ends--------

  // ---------- test booking related api starts ---------- 
  //post a single booking data
  app.post('/bookings',async(req,res)=>{
    const bookingInfo = req.body;
    const result = await bookingCollection.insertOne(bookingInfo);
    res.send(result)
  })
// get all the booking data
  app.get('/bookings',async(req,res)=>{
    const result = await bookingCollection.find().toArray();
    res.send(result)
  })

  //get a single booking data
  app.get('/bookings/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await bookingCollection.findOne(query);
    res.send(result);
  })

  // update booking status
  app.patch('/bookings/:id',async(req,res)=>{
    const id = req.params.id;
    const reportInfo = req.body;
    console.log(reportInfo)
    const filter ={_id: new ObjectId(id)}
    const updatedDoc ={
      $set:{
        status:reportInfo.status,
        report:reportInfo.report
      }
    }
    const result = await bookingCollection.updateOne(filter,updatedDoc)
    res.send(result)
  })

  //delete a booking data
  app.delete('/bookings/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await bookingCollection.deleteOne(query);
    res.send(result)
  })

  // ------ test booking related api ends----------

  // -------------all banner related api starts---------

  // post a single banner data
  app.post('/banners',async(req,res)=>{
    const banner = req.body;
    const result = await bannerCollection.insertOne(banner);
    res.send(result)
  })

//load all the banner data
app.get('/banners',async(req,res)=>{
  const result = await bannerCollection.find().toArray();
  res.send(result)
})
// update current banner status
app.patch('/banners/:id',async(req,res)=>{
  //set all the banner status to false
   await bannerCollection.updateMany({},{$set:{isActive:false}})
   //set selected banner status to true
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const updatedDoc={
    $set:{
      isActive:true
    }
  }
  const result = await bannerCollection.updateOne(filter,updatedDoc);
  res.send(result);


  
 

})


  //get a single banner
  app.get('/banners/:id',async(req,res)=>{
    const id = req.params.id;
    console.log(id)
    const query = {_id: new ObjectId(id)}
    const result = await bannerCollection.findOne(query);
    res.send(result)
  })


//delete a single banner
app.delete('/banners/:id',async(req,res)=>{
  const id = req.params.id;
  console.log(id)
  const query = {_id: new ObjectId(id)}
  const result = await bannerCollection.deleteOne(query);
  res.send(result)
})
  // -------------all banner related api ends---------

  //payment intent
  app.post('/create-payment-intent',async(req,res)=>{
    const {price}=req.body;
    const amount = parseInt(price*100);
    const paymentIntent =await stripe.paymentIntents.create({
      amount:amount,
      currency:'usd',
      payment_method_types:['card']
    });

    res.send({
      clientSecret:paymentIntent.client_secret
    })
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