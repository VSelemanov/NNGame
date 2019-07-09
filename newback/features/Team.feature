# language: ru

Функционал: Команда

Сценарии для команды

Контекст:
Допустим сервер стартовал
И база данных пуста
Когда я создаю нового администратора l="admin" p="admin"
# @new
Сценарий: Создание новой команды
Когда я делаю запрос на создание новой команды "команда1"
То сервер должен вернуть статус 200
И в списке команд должна быть команда "команда1"

# @new
Сценарий: Авторизация команды
Допустим я делаю запрос на создание новой команды "команда1"
И я делаю запрос на создание новой команды "команда2"
И я делаю запрос на создание новой команды "команда3"
И я создаю нового администратора l="admin" p="admin"
И администратор l="admin" p="admin" делает запрос на создание новой комнаты
Когда я делаю запрос на авторизацию команды "команда1"
То сервер должен вернуть статус 200
И в ответе должен быть jwt токен команды

# @new
Сценарий: Подключение команд к игре
Допустим я делаю запрос на создание новой команды "команда1"
И я делаю запрос на создание новой команды "команда2"
И я делаю запрос на создание новой команды "команда3"
И администратор l="admin" p="admin" делает запрос на создание новой комнаты
И я делаю запрос на авторизацию команды "команда1"
И я делаю запрос на авторизацию команды "команда2"
И я делаю запрос на авторизацию команды "команда3"
Когда я подписываюсь на обновление состояния игры командой "команда1"
И отправляю сервером событие
То команда "команда1" получит сообщение из сокета
Когда я подписываюсь на обновление состояния игры командой "команда2"
И отправляю сервером событие
То команда "команда2" получит сообщение из сокета
Когда я подписываюсь на обновление состояния игры командой "команда3"
И отправляю сервером событие
То команда "команда3" получит сообщение из сокета