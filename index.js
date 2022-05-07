const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

//MiddleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vwtpj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("wareHouse").collection("product");
        const userCollection = client.db("wareHouse").collection("user");
        
        // Get All (Product)
        app.get("/inventory", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        
        // Get One
        app.get('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });
        
        // POST
        app.post('/inventory', async (req,res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })
        
        // DELETE
        app.delete('/inventory/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.deleteOne(query);
            res.send(product);
        });

        // Update
        app.put('/inventory/:id', async (req,res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const {_id,...rest} = req.body; 
            const updatedProduct = {
                $set:rest,
              };
            const result = await movies.updateOne(filter, updatedProduct, options);
            console.log(result);
            res.send(result);
        })
        
        // Get All (user)
        app.get("/user", async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        // Get One (user)
        app.get('/user/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await userCollection.findOne(query);
            res.send(product);
        });
        
        // POST (user)
        app.post('/user', async (req,res)=>{
            const newProduct = req.body;
            const result = await userCollection.insertOne(newProduct);
            res.send(result);
        })
        
        // DELETE (user)
        app.delete('/user/:id', async (req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await userCollection.deleteOne(query);
            res.send(product);
        });

    } finally {
    }
}
run().catch(console.dir);

// Conection
app.get("/", (req, res) => {
    res.send("Running Warehouse Server");
});

app.listen(port, () => {
    console.log("listening to port no,", port);
});
