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
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const colorZone = {
  description: "Покрасить зону в цвет команды",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const startGame = {
  description: "Админ стартует игру",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const nextQuestion = {
  description: "Админ стартует игру",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};
