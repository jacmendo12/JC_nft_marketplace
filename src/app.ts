import express from 'express';
import dotenv from 'dotenv-safe';
import bodyParser from 'body-parser';


dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());



const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;