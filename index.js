const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const app = express();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAIL_GUN_API_KEY,
});

// midleware
app.use(express());
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dejlh8b.mongodb.net/?retryWrites=true&w=majority`;

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

        const reviewCollection = client.db('portfolio').collection('reviews');
        const projectCollection = client.db('portfolio').collection('projects');
        const blogCollection = client.db('portfolio').collection('blogs');


        // display products
        app.get('/reviews', async (req, res) => {
            const result = await reviewCollection.find().toArray();
            res.send(result);
        })



        // ==================================
        // create a product
        app.post('/reviews', async (req, res) => {
            const products = req.body;
            const result = await reviewCollection.insertOne(products);
            res.send(result);

        })

        app.get('/projects', async (req, res) => {
            const result = await projectCollection.find().toArray();
            res.send(result);
        })

        app.get('/blogs', async (req, res) => {
            const result = await blogCollection.find().toArray();
            res.send(result);
        })

        app.get('/project/:id', async (req, res) => {
            const id = req.body.id;
            const query = { _id: new ObjectId(id) }
            const result = await projectCollection.findOne();
            res.send(result);
        })

        // contact form
        app.post('/contact', async (req, res) => {
            const data = req.body;
            try {
                await mg.messages.create(process.env.MAIL_SENDING_DOMAIN, {
                    from: "Mailgun Sandbox <postmaster@sandbox6840bdbafd2a4ae98ab9d3cab8f5e9de.mailgun.org>",
                    to: ["mdsayed.contact@gmail.com"],
                    subject: 'Portfolio',
                    text: data.message,
                });
                res.status(200).json({ message: 'Email sent successfully' });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });







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
    res.send('My server is runing now........');
})
app.listen(port, () => {
    console.log('This server is runing on port', port)
})
