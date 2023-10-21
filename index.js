const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;
const app = express();

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

        const productCollection = client.db('brandDB').collection('products');
        const brandCollection = client.db('brandDB').collection('brands');
        const advertisementCollection = client.db('brandDB').collection('advertisements');
        const categorieCollection = client.db('brandDB').collection('categories');
        const cartsCollection = client.db('brandDB').collection('carts');

        // create a product
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products);
            res.send(result);

        })

        // display products
        app.get('/products', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result);
        })

        // show product barnds base
        app.get('/products/:brandname', async (req, res) => {
            const brandName = req.params.brandname;
            const query = { brandName: brandName }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        // sigle product
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // update product
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const options = { upsert: true }
            const filter = { _id: new ObjectId(id) }
            const update = {
                $set: {
                    productName: data.productName,
                    productImgUrl: data.productImgUrl,
                    brandName: data.brandName,
                    category: data.category,
                    productPrice: data.productPrice,
                    shortDescriptio: data.shortDescription,
                    rating: data.rating
                }
            }
            const result = await productCollection.updateOne(filter, update, options);
            res.send(result);
        })

        // ===========================================================

        // creat a barnd 
        app.post('/brands', async (req, res) => {
            const products = req.body;
            const result = await brandCollection.insertOne(products);
            res.send(result);

        })

        // show brands
        app.get('/brands', async (req, res) => {
            const result = await brandCollection.find().toArray();
            res.send(result);
        })

        // creat a advertisement post api
        app.post('/advertisement', async (req, res) => {
            const advertisements = req.body;
            const result = await advertisementCollection.insertOne(advertisements);
            res.send(result);

        })

        // show advertisement
        app.get('/advertisement/:brandname', async (req, res) => {
            const brandName = req.params.brandname;
            const query = { brand: brandName }
            const result = await advertisementCollection.find(query).toArray();
            res.send(result);
        })


        // ==============================

        // creat a categories
        app.post('/categories', async (req, res) => {
            const products = req.body;
            const result = await categorieCollection.insertOne(products);
            res.send(result);

        })

        // show categories
        app.get('/categories', async (req, res) => {
            const result = await categorieCollection.find().toArray();
            res.send(result);
        })

        // cart ==========================>

        // creat a carts
        app.post('/carts', async (req, res) => {
            const items = req.body;
            console.log(req.body);
            const result = await cartsCollection.insertOne(items);
            res.send(result);
        }
        )

        // show carts 
        app.get('/carts', async (req, res) => {
            const result = await cartsCollection.find().toArray();
            res.send(result);
        })


        // match cart with email
        app.get('/carts/:email', async (req, res) => {
            const UserEmail = req.params.email;
            const query = { email: UserEmail }
            const result = await cartsCollection.find(query).toArray();
            res.send(result);
        })

        // delete cartItem
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query);
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
    res.send('My server is runing now........');
})
app.listen(port, () => {
    console.log('This server is runing on port', port)
})
