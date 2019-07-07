# language: ru

Функционал: Вопросы

Сценарии для вопросов

Контекст:
Допустим сервер стартовал
И база данных пуста
И я создаю нового администратора l="admin" p="admin"

# @new
Сценарий: Создание нового цифрового вопроса
Допустим администратор создает новую игровую комнату
Когда я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
То сервер должен вернуть статус 200
И в списке вопросов появился цифровой вопрос

# @new
Сценарий: Создание нового вариантивного вопроса
Допустим администратор создает новую игровую комнату
Когда я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
То сервер должен вернуть статус 200
И в списке вопросов появился вариативный вопрос