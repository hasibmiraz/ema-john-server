import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.port || 5000;
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
