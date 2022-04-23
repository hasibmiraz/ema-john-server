import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.port || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ema-john-db.mhzvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();

    const productsCollection = client.db('emaJohn').collection('products');

    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get('/productsCount', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const count = await cursor.count();
      res.send({ count });
    });
  } finally {
  }
};

run().catch(console.dir);

app.listen(port, () => console.log(`Running on port ${port}`));
