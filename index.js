import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
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

    app.get('/', async (req, res) => {
      res.send('Running ema server');
    });

    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productsCollection.find(query);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    // get product count
    app.get('/productsCount', async (req, res) => {
      const count = await productsCollection.countDocuments();
      res.send({ count });
    });

    // use post to get product by ids
    app.post('/productByKeys', async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } finally {
  }
};

run().catch(console.dir);

app.listen(port, () => console.log(`Running on port ${port}`));
