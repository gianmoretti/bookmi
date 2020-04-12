import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";

admin.initializeApp(functions.config().firebase);

import { ShopsController } from "./controllers/shops";
import { ServicesController } from "./controllers/services";

const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

useExpressServer(main, {
  controllers: [ShopsController, ServicesController],
});

export const webApi = functions.https.onRequest(main);
export { main };
