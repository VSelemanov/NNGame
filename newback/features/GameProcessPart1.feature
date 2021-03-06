            # language: ru

            Функционал: Игровой функционал первого тура
            Здесь описывается весь игровой функционал первого тура
            Действия админа, пользователя и т.д.

            Контекст:
            Допустим сервер стартовал
            И база данных пуста
            И я создаю нового администратора l="admin" p="admin"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И администратор l="admin" p="admin" делает запрос на создание новой комнаты
            И я делаю запрос на авторизацию команды "команда1"
            И я делаю запрос на авторизацию команды "команда2"
            И я делаю запрос на авторизацию команды "команда3"
            И я подписываюсь на обновление состояния игры командой "команда1"
            И команда "команда1" делает запрос на выбор стартовой зоны "kremlin"
            И команда "команда2" делает запрос на выбор стартовой зоны "varya"
            И команда "команда3" делает запрос на выбор стартовой зоны "moscow"

            # @new
            Сценарий: Админ объявляет старт игры
            Когда администратор l="admin" p="admin" делает запрос на старт игры
            То сервер должен вернуть статус 200
            И в сокете должен быть статус игры с флагом
            И закрываем соединение по сокету

            # @new
            Сценарий: Админ запрашивает вопрос для тура 1
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            Когда администратор l="admin" p="admin" делает запрос на следующий вопрос
            То сервер должен вернуть статус 200
            И в сокете в первом туре должен появиться новый вопрос и счетчик равен 0
            И закрываем соединение по сокету

            # @new
            Сценарий: Админ запрашивает вопрос для тура 1
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            И администратор l="admin" p="admin" делает запрос на следующий вопрос
            Когда администратор l="admin" p="admin" делает запрос на старт таймера
            То сервер должен вернуть статус 200
            И в сокете в первом туре на текущем шаге должен быть установлен флаг isStarted
            И закрываем соединение по сокету

            # @new
            Сценарий: Команда отвечает на числовой вопрос
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            И администратор l="admin" p="admin" делает запрос на следующий вопрос
            И администратор l="admin" p="admin" делает запрос на старт таймера
            Когда команда "команда1" отвечает на числовой вопрос ответ = 30 таймер = 10
            То сервер должен вернуть статус 200
            И в сокете состояние игры с ответом от команды "команда1"
            И закрываем соединение по сокету


            # @new
            Сценарий: Команды отвечают на числовой вопрос и рассчитывается результат
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            И администратор l="admin" p="admin" делает запрос на следующий вопрос
            И администратор l="admin" p="admin" делает запрос на старт таймера
            И команда "команда1" отвечает на числовой вопрос ответ = 30 таймер = 10
            И команда "команда2" отвечает на числовой вопрос ответ = 40 таймер = 10
            И команда "команда3" отвечает на числовой вопрос ответ = 30 таймер = 11
            То сервер должен вернуть статус 200
            И в сокете состояние игры со следующими результатами по выбору доступных зон:
            | teamKey | allowZones |
            | team1   | 1          |
            | team2   | 2          |
            | team3   | 0          |
            И закрываем соединение по сокету

            # @new
            Сценарий: Команды отвечают null на числовой вопрос и рассчитывается результат
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            И администратор l="admin" p="admin" делает запрос на следующий вопрос
            И администратор l="admin" p="admin" делает запрос на старт таймера
            И команда "команда1" отвечает на числовой вопрос ответ = 111 таймер = 10
            И команда "команда2" отвечает на числовой вопрос ответ = 111 таймер = 10
            И команда "команда3" отвечает на числовой вопрос ответ = 111 таймер = 11
            То сервер должен вернуть статус 200
            И в сокете состояние игры со следующими результатами по выбору доступных зон:
            | teamKey | allowZones |
            | team1   | 0          |
            | team2   | 0          |
            | team3   | 0          |
            И закрываем соединение по сокету

            # @new
            Сценарий: Только команда 2 отвечает на числовой вопрос и рассчитывается результат
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            И администратор l="admin" p="admin" делает запрос на следующий вопрос
            И администратор l="admin" p="admin" делает запрос на старт таймера
            И команда "команда1" отвечает на числовой вопрос ответ = 111 таймер = 10
            И команда "команда2" отвечает на числовой вопрос ответ = 50 таймер = 10
            И команда "команда3" отвечает на числовой вопрос ответ = 111 таймер = 11
            То сервер должен вернуть статус 200
            И в сокете состояние игры со следующими результатами по выбору доступных зон:
            | teamKey | allowZones |
            | team1   | 0          |
            | team2   | 3          |
            | team3   | 0          |
            И закрываем соединение по сокету

            # @new
            Сценарий: Команда победитель красит зоны
            Допустим администратор l="admin" p="admin" делает запрос на старт игры
            И администратор l="admin" p="admin" делает запрос на следующий вопрос
            И администратор l="admin" p="admin" делает запрос на старт таймера
            И команда "команда1" отвечает на числовой вопрос ответ = 30 таймер = 10
            И команда "команда2" отвечает на числовой вопрос ответ = 40 таймер = 10
            И команда "команда3" отвечает на числовой вопрос ответ = 30 таймер = 11
            То сервер должен вернуть статус 200
            И в сокете состояние игры со следующими результатами по выбору доступных зон:
            | teamKey | allowZones |
            | team1   | 1          |
            | team2   | 2          |
            | team3   | 0          |
Когда команда "команда2" делает запрос на захват зоны "sort"
То сервер должен вернуть статус 200
И в сокете зона "sort" принадлежит команде "команда2"
И счетчик зон доступных для команды "команда2" равен 1
Когда команда "команда2" делает запрос на захват зоны "sormovo"
То сервер должен вернуть статус 200
И в сокете зона "sormovo" принадлежит команде "команда2"
И счетчик зон доступных для команды "команда2" равен 0
И команды "команда2" нет в очереди на текущем шаге
И закрываем соединение по сокету
