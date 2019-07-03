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
# Сценарий: Авторизация команды
# Допустим я делаю запрос на создание новой команды "команда1"
# Когда я делаю запрос на авторизацию команды "команда1"
# То сервер должен вернуть статус 200
# И в ответе должен быть jwt токен команды