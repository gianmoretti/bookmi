import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";

//import serviceAccount = require("../gcloud-service-account.json");
//admin.initializeApp({
//  credential: admin.credential.cert(serviceAccount),
//});

admin.initializeApp(functions.config().firebase);

import { ShopsController } from "./controllers/shops";
import { ReservationController } from "./controllers/reservations";

const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

useExpressServer(main, {
  controllers: [ShopsController, ReservationController],
});

export const webApi = functions.https.onRequest(main);
export { main };
