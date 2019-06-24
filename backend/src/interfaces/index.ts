import Hapi from "hapi";

export type IDecoratedRequest<P = {}, Q = {}, C = {}, H = {}> = {
  payload: P;
  query: Q;
  auth: { credentials: C };
  headers: H;
} & Hapi.Request;

export interface IBaseFlds {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
