import { routePath } from "../constants";

export const create = {
  description: "Создать комнату",
  notes: "Авторизация через AdminToken",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};
