# language: ru

Функционал: Общие методы

Описывается все что не относится к конкретной сущности

Контекст:
Допустим сервер стартовал
И база данных пуста
# @new
Сценарий: Тестирование генератора случайных чисел
Когда я запускаю генератор случайных чисел с сохранением ответа
И я запускаю генератор случайных чисел с сохранением ответа
То эти ответы не должны быть равны
