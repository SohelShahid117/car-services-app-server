const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

//middleware
// app.use(cors());
app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//car_services
//xQ5O5RYM5AWLna0L
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  // "mongodb+srv://car_services:xQ5O5RYM5AWLna0L@cluster0.hfhifix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  // "mongodb+srv://process.env.DB_USER:process.env.DB_PASS@cluster0.hfhifix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfhifix.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Get the database and collection on which to run the operation
    // const database = client.db("sample_mflix");
    // const movies = database.collection("movies");

    const carServicesCollection = client
      .db("car_services_DB")
      .collection("services");
    const bookingCollection = client
      .db("car_services_DB")
      .collection("booking_order");

    //auth related API-->JWT-->Json Web Token
    app.post("/jwt",async(req,res)=>{
      const user = req.body
      console.log(user)
      // jwt.sign({data: 'foobar'}, 'secret', { expiresIn: '1h' });
      // const token = jwt.sign(user, 'secret', { expiresIn: '1h' })
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
      console.log(token)
      // res.send(user)
      // res.send(token)
      res.cookie("token",token,{
        httpOnly:true,
        secure:false, 
        //http://localhost:3000/
        //http://localhost:5173/login-->not secure-->!https
        sameSite:"none"  //port different
      })
      .send({success:true})
    })


    //services related API
      //READ-->get all user
    app.get("/getAllServices", async (req, res) => {
      const getAllServices = await carServicesCollection.find().toArray();
      console.log(getAllServices);
      res.send(getAllServices);
    });

    //UPDATE || READ
    //get a single user
    app.get("/getOneService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = {
        projection: { title: 1, service_id: 1, price: 1, img: 1 },
      };
      const result = await carServicesCollection.findOne(query, options);
      console.log(result);
      res.send(result);
    });

    //booking-CREATE
    app.post("/bookingsOrder", async (req, res) => {
      const booking = req.body;
      // Insert the defined document into the "haiku" collection
      const bookingsOrder = await bookingCollection.insertOne(booking);
      console.log(bookingsOrder);
      res.send(bookingsOrder);
    });

    //READ
    app.get("/allBookingsOrder", async (req, res) => {
      console.log(req.query);
      //http://localhost:3000/allBookingsOrder?email=abul09@gmail.com&sort=1
      //{ email: 'abul09@gmail.com', sort: '1' }

      console.log(req.query.email);
      console.log("token token token",req.cookies.token)
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
        console.log(query);
      }
      // const result = await bookingCollection.find().toArray()
      const result = await bookingCollection.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    //DELETE
    app.delete("/allBookingsOrder/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    //UPDATE
    app.patch("/allBookingsOrder/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateBooking = req.body;
      console.log(updateBooking);
      const updateDoc = {
        $set: {
          status: updateBooking.status,
        },
      };
      console.log(updateDoc);
      const result = await bookingCollection.updateOne(filter, updateDoc);
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`server is running at http://localhost:${port}`);
});
//60-2 Auth Redirect and JWT core concepts
