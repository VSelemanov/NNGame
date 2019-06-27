import { routePath } from "../constants";

export const create = {
  description: "Создать администратора",
  notes: "Авторизация через AppToken",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const login = {
  description: "Вход администратора",
  /*notes:
        "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};
