import { SchemaDefinition } from "mongoose";
import uuid = require("uuid");

export const APIRoute = `/api`;

export const adminPath = `admin`;

export const baseFlds: SchemaDefinition = {
  _id: {
    type: String,
    default: uuid.v4
  }
};

export enum HTTPMethods {
  get = "GET",
  post = "POST",
  del = "DELETE",
  put = "PUT"
}
