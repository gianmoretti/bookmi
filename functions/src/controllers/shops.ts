import * as firebaseHelper from "firebase-functions-helper/dist";
import * as admin from "firebase-admin";
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
const shopsCollection = "shops";

type Shop = {
  name: String;
  description: String;
  location: Location;
};

type Location = {
  city: String;
  province: String;
  address: String;
};

@JsonController()
export class ShopsController {
  @Get("/shops")
  @OnUndefined(404)
  async getAll() {
    try {
      const docs = await firebaseHelper.firestore.backup(db, shopsCollection);
      return docs;
    } catch (error) {
      return undefined;
    }
  }

  @Get("/shops/:id")
  @OnUndefined(404)
  async getOne(@Param("id") id: string) {
    try {
      const doc = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        id
      );
      return doc;
    } catch (error) {
      return undefined;
    }
  }

  @Post("/shops")
  @OnUndefined(404)
  async post(@Body() shop: Shop) {
    try {
      const newDoc = await firebaseHelper.firestore.createNewDocument(
        db,
        shopsCollection,
        shop
      );
      return newDoc.id;
    } catch (error) {
      return undefined;
    }
  }

  @Put("/shops/:id")
  @OnUndefined(404)
  async put(@Param("id") id: string, @Body() shop: Shop) {
    try {
      return await firebaseHelper.firestore.updateDocument(
        db,
        shopsCollection,
        id,
        shop
      );
    } catch (error) {
      return undefined;
    }
  }

  @Delete("/shops/:id")
  @OnUndefined(404)
  async remove(@Param("id") id: string) {
    try {
      return await firebaseHelper.firestore.deleteDocument(
        db,
        shopsCollection,
        id
      );
    } catch (error) {
      return undefined;
    }
  }
}
