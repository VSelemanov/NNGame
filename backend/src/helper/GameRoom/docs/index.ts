import { routePath } from "../constants";

export const create = {
  description: "Создать игровую комнату",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const read = {
  description: "Чтение списка игр",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const connect = {
  description: "Подключение к игре команды / администратора",
  /*notes:
        "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const gameStatus = {
  description: "Получить статус игровой комнаты",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const showQuestion = {
  description: "Запустить вопрос",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const startQuestion = {
  description: "Запустить таймер и дать возможность ответить игрокам",
  notes:
    "Показываем таймер и поле ввода / варианты ответов для игроков или для админа показываем ответы команд",
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const start = {
  description: "Запуск игры",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const teamResponse = {
  description: "Отправка ответа команды",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};

export const zoneCapture = {
  description: "Присваивание зоны командой",
  /*notes:
      "Параметры: projectId - для получения списка, bimObjectId - для получения информации по объекту",*/
  tags: ["api", routePath],
  plugins: {
    "hapi-swagger": {
      validate: {}
    }
  }
};
