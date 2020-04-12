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
const servicesCollection = "services";

type Service = {
  name: String;
  description: String;
  duration: Number;
  shopId: String;
};

@JsonController()
export class ServicesController {
  @Get("/services")
  @OnUndefined(404)
  async getAll() {
    try {
      const docs = await firebaseHelper.firestore.backup(
        db,
        servicesCollection
      );
      return docs;
    } catch (error) {
      return undefined;
    }
  }

  @Get("/services/:id")
  @OnUndefined(404)
  async getOne(@Param("id") id: string) {
    try {
      const doc = await firebaseHelper.firestore.getDocument(
        db,
        servicesCollection,
        id
      );
      return doc;
    } catch (error) {
      return undefined;
    }
  }

  @Post("/services")
  @OnUndefined(404)
  async post(@Body() service: Service) {
    try {
      const newDoc = await firebaseHelper.firestore.createNewDocument(
        db,
        servicesCollection,
        service
      );
      return newDoc.id;
    } catch (error) {
      return undefined;
    }
  }

  @Put("/services/:id")
  @OnUndefined(404)
  async put(@Param("id") id: string, @Body() service: Service) {
    try {
      return await firebaseHelper.firestore.updateDocument(
        db,
        servicesCollection,
        id,
        service
      );
    } catch (error) {
      return undefined;
    }
  }

  @Delete("/services/:id")
  @OnUndefined(404)
  async remove(@Param("id") id: string) {
    try {
      return await firebaseHelper.firestore.deleteDocument(
        db,
        servicesCollection,
        id
      );
    } catch (error) {
      return undefined;
    }
  }
}
