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
  cAt: Date;
  uAt: Date;
}

export interface IMapZone {
  nearby: string[];
  isStartBase: boolean;
  team: string | null;
}

export interface IResultDifTimer {
  dif: number | null;
  timer: number;
  teamKey: string;
}
