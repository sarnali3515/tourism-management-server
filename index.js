const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
    origin: ["http://localhost:5173", "https://tourism-management-trails.web.app"],
    Credential: true
}

app.use(cors(corsConfig));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sgvl42h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const spotsCollection = client.db('spotsDB').collection('spots');
        const userCollection = client.db('spotsDB').collection('users');
        const countryCollection = client.db('spotsDB').collection('countries');

        app.get('/spots', async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.findOne(query);
            res.send(result)
        })

        app.get('/spots/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await spotsCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/spotsCountry/:country', async (req, res) => {
            const country = req.params.country;
            const query = { country: country };
            const result = await spotsCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/spots', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotsCollection.insertOne(newSpot);
            res.send(result);
        })

        app.put('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spot = {
                $set: {
                    names: updatedSpot.names,
                    photo: updatedSpot.photo,
                    country: updatedSpot.country,
                    location: updatedSpot.location,
                    seasonality: updatedSpot.seasonality,
                    cost: updatedSpot.cost,
                    time: updatedSpot.time,
                    visitors: updatedSpot.visitors,
                    description: updatedSpot.description
                }
            }

            const result = await spotsCollection.updateOne(filter, spot, options);
            res.send(result);
        })

        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.deleteOne(query);
            res.send(result);
        })




        // user related apis
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });


        //country apis
        app.get('/countries', async (req, res) => {
            const cursor = countryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/countries/:country', async (req, res) => {
            const country = req.params.country;
            const query = { country: country };
            const result = await countryCollection.find(query).toArray();
            res.send(result);
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



app.get('/', (req, res) => {
    res.send('Tourism Management Server is Running!')
})

app.listen(port, () => {
    console.log(`Tourism Management Server is running on port: ${port}`)
})