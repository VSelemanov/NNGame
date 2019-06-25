import Hapi from "hapi";

export type IDecoratedRequest<P = {}, Q = {}, Par = {}, C = {}, H = {}> = {
  payload: P;
  query: Q;
  auth: { credentials: C };
  headers: H;
  params: Par;
} & Hapi.Request;

export interface IBaseFlds {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
