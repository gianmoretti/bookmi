import * as firebaseHelper from "firebase-functions-helper/dist";
import * as admin from "firebase-admin";
import { Reservation } from "../model/definitions";

import {
  JsonController,
  OnUndefined,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
} from "routing-controllers";

const db = admin.firestore();
const reservationsCollection = "reservations";

@JsonController("/reservation")
export class ReservationController {
  @Get("/")
  @OnUndefined(404)
  async getAll() {
    try {
      const docs = await firebaseHelper.firestore.backup(
        db,
        reservationsCollection
      );
      return docs;
    } catch (error) {
      return undefined;
    }
  }

  @Get("/shop/:shopId")
  @OnUndefined(404)
  async getByShop(@Param("shopId") shopId: string) {
    try {
      const reservations: FirebaseFirestore.DocumentData[] = [];
      const reservationsSanpshot = await db
        .collection(reservationsCollection)
        .where("shopId", "==", shopId)
        .get();
      reservationsSanpshot.forEach(function (doc) {
        reservations.push(doc.data());
      });
      return reservations;
    } catch (error) {
      return undefined;
    }
  }

  @Get("/:resId")
  @OnUndefined(404)
  async getOne(@Param("resId") resId: string) {
    try {
      const doc = await firebaseHelper.firestore.getDocument(
        db,
        reservationsCollection,
        resId
      );
      return doc;
    } catch (error) {
      return undefined;
    }
  }

  @Post("/")
  @OnUndefined(404)
  async post(@Body() reservation: Reservation) {
    try {
      const newDoc = await firebaseHelper.firestore.createNewDocument(
        db,
        reservationsCollection,
        reservation
      );
      return newDoc.id;
    } catch (error) {
      return undefined;
    }
  }

  @Put("/:resId")
  @OnUndefined(404)
  async put(@Param("resId") resId: string, @Body() reservation: Reservation) {
    try {
      return await firebaseHelper.firestore.updateDocument(
        db,
        reservationsCollection,
        resId,
        reservation
      );
    } catch (error) {
      return undefined;
    }
  }

  @Delete("/:resId")
  @OnUndefined(404)
  async remove(@Param("resId") resId: string) {
    try {
      return await firebaseHelper.firestore.deleteDocument(
        db,
        reservationsCollection,
        resId
      );
    } catch (error) {
      return undefined;
    }
  }
}
