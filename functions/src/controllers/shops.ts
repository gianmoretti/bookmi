import * as firebaseHelper from "firebase-functions-helper/dist";
import * as admin from "firebase-admin";
import { Shop, Service } from "../model/definitions";

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

@JsonController("/shop")
export class ShopsController {
  @Get("/")
  @OnUndefined(404)
  async getAllShops() {
    try {
      const docs = await firebaseHelper.firestore.backup(db, shopsCollection);
      return docs;
    } catch (error) {
      return undefined;
    }
  }

  @Get("/:shopId")
  @OnUndefined(404)
  async getOneShop(@Param("shopId") shopId: string) {
    try {
      const doc = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        shopId
      );
      return doc;
    } catch (error) {
      return undefined;
    }
  }

  @Post("/")
  @OnUndefined(404)
  async createAShop(@Body() shop: Shop) {
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

  @Put("/:shopId")
  @OnUndefined(404)
  async updateAShop(@Param("shopId") shopId: string, @Body() shop: Shop) {
    try {
      return await firebaseHelper.firestore.updateDocument(
        db,
        shopsCollection,
        shopId,
        shop
      );
    } catch (error) {
      return undefined;
    }
  }

  @Delete("/:shopId")
  @OnUndefined(404)
  async deleteAShop(@Param("shopId") shopId: string) {
    try {
      return await firebaseHelper.firestore.deleteDocument(
        db,
        shopsCollection,
        shopId
      );
    } catch (error) {
      return undefined;
    }
  }

  @Get("/:shopId/service")
  @OnUndefined(404)
  async getAllServices(@Param("shopId") shopId: string) {
    try {
      const shop: Shop = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        shopId
      );
      return shop.services;
    } catch (error) {
      return undefined;
    }
  }

  @Get("/:shopId/service/:serviceId")
  @OnUndefined(404)
  async getOneService(
    @Param("shopId") shopId: string,
    @Param("serviceId") serviceId: string
  ) {
    try {
      const shop: Shop = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        shopId
      );
      return shop.services.filter((service) => service.id === serviceId)[0];
    } catch (error) {
      return undefined;
    }
  }

  @Post("/:shopId/service")
  @OnUndefined(404)
  async createAService(
    @Param("shopId") shopId: string,
    @Body() service: Service
  ) {
    try {
      const shop: Shop = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        shopId
      );
      return shop
        ? await firebaseHelper.firestore.updateDocument(
            db,
            shopsCollection,
            shopId,
            reducer(shop, {
              type: Operation.ADD,
              payload: service,
            })
          )
        : undefined;
    } catch (error) {
      return undefined;
    }
  }

  @Put("/:shopId/service")
  @OnUndefined(404)
  async updateAService(
    @Param("shopId") shopId: string,
    @Body() service: Service
  ) {
    try {
      const shop: Shop = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        shopId
      );
      return shop
        ? await firebaseHelper.firestore.updateDocument(
            db,
            shopsCollection,
            shopId,
            reducer(shop, {
              type: Operation.UPDATE,
              payload: service,
            })
          )
        : undefined;
    } catch (error) {
      return undefined;
    }
  }

  @Delete("/:shopId/service/:serviceId")
  @OnUndefined(404)
  async deleteAService(
    @Param("shopId") shopId: string,
    @Param("serviceId") serviceId: string
  ) {
    try {
      const shop: Shop = await firebaseHelper.firestore.getDocument(
        db,
        shopsCollection,
        shopId
      );
      return shop
        ? await firebaseHelper.firestore.updateDocument(
            db,
            shopsCollection,
            shopId,
            reducer(shop, {
              type: Operation.DELETE,
              payload: serviceId,
            })
          )
        : undefined;
    } catch (error) {
      return undefined;
    }
  }
}

enum Operation {
  DELETE,
  ADD,
  UPDATE,
}

type ServiceAction = {
  payload: any;
  type: Operation;
};

const reducer = (shop: Shop, action: ServiceAction) => {
  switch (action.type) {
    case Operation.DELETE:
      const serviceId: string = action.payload;
      return {
        ...shop,
        services: shop.services.filter((service) => service.id !== serviceId),
      };
    case Operation.ADD:
      const serviceToAdd: Service = action.payload;
      return {
        ...shop,
        services: [serviceToAdd, ...shop.services],
      };
    case Operation.UPDATE:
      const serviceToUpdate: Service = action.payload;
      return {
        ...shop,
        services: shop.services.map((service) =>
          service.id === serviceToUpdate.id ? serviceToUpdate : service
        ),
      };
    default:
      return shop;
  }
};
