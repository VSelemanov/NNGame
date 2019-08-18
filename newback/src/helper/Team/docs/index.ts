import { routePath } from "../constants";

export const read = {
  description: "Получить список команд",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const create = {
  description: "Создать команду",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const login = {
  description: "Вход команды",
  /*notes:
        "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const colorZone = {
  description: "Окрас зоны в цвет команды",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const response = {
  description: "Ответ команды на вопрос",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const attack = {
  description: "Ответ команды на вопрос",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};
