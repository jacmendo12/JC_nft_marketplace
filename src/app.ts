import express from "express";
import dotenv from "dotenv-safe";
import bodyParser from "body-parser";
import offersRoutes from "./modules/offers/offers.Controller";
import transactionsRoutes from "./modules/transactions/transactions.Controller";
import OffersListMiddleware from "./middleware/offersList.middleware";
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(OffersListMiddleware);

app.use("/offers", offersRoutes);
app.use("/transactions", transactionsRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
