            # language: ru

            Функционал: Игровая комната

            Сценарии для игровой комнаты

            Контекст:
            Допустим сервер стартовал
            И база данных пуста
            Когда я создаю нового администратора l="admin" p="admin"

            # @new
            Сценарий: Создание игровой комнаты
            Когда администратор создает новую игровую комнату
            То сервер должен вернуть статус 200
            И в списке комнат должна появиться новая активная комната

            # @new
            Сценарий: Получить список комнат
            Допустим администратор создает новую игровую комнату
            Когда я делаю запрос получения списка комнат
            То сервер должен вернуть статус 200
            И в ответе должна быть комната

            # @new
            Сценарий: Получение номера следующей комнаты
            Когда я хочу получить номер следующей комнаты
            То в ответе должен быть 1

            # @new
            Сценарий: Подключение к игровой комнате
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            Когда я отправляю запрос на вход в комнату от лица команды "команда1"
            То сервер должен вернуть статус 200
            И в ответе есть текущее состояние игры с игровым токеном
            И в текущем состоянии игры появилась команда

            # @new
            Сценарий: Команда выбирает зону
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            Когда я делаю запрос на присваивание зоны "moscow" командой "команда1"
            То сервер должен вернуть статус 200
            И в состоянии игры на карте зона "moscow" закрашивается цветом команды "команда1"


            # @new
            Сценарий: Подключение к игровой комнате (админ)
            Допустим администратор создает новую игровую комнату
            Когда я отправляю запрос на вход в комнату от лица администратора l="admin" p="admin"
            То сервер должен вернуть статус 200
            И в ответе есть текущее состояние игры

            # @new
            Сценарий: Получение состояния комнаты
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            Когда я делаю запрос на получение статуса комнаты от команды "команда1"
            То сервер должен вернуть статус 200
            И в ответе должен быть объект с полем состояния игры

            # @new
            Сценарий: Получение состояния комнаты (админ)
            Допустим администратор создает новую игровую комнату
            Когда я делаю запрос на получение статуса комнаты от лица администратора l="admin" p="admin"
            То сервер должен вернуть статус 200
            И в ответе должен быть объект с полем состояния игры

            # @new
            Сценарий: Старт игры в полной комнате
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            Когда администратор l="admin" p="admin" делает запрос на запуск игры
            То сервер должен вернуть статус 200
            И в ответе состояние игры с флагом запущенной игры

            # @new
            Сценарий: Администратор показывает вопрос
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И администратор l="admin" p="admin" делает запрос на запуск игры
            Когда администратор l="admin" p="admin" делает запрос на показ вопроса
            То сервер должен вернуть статус 200
            И в ответе состояние игры с первым вопросом и флагом скрыть ответы

            # @new
            Сценарий: Администратор дает возможность ответить на вопрос
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И администратор l="admin" p="admin" делает запрос на запуск игры
            И администратор l="admin" p="admin" делает запрос на показ вопроса
            Когда администратор l="admin" p="admin" дает возможность ответить на вопрос
            То сервер должен вернуть статус 200
            И в ответе состояние игры с первым вопросом и флагом показать ответы

            # @new
            Сценарий: Команда отправляет ответ на вопрос
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И администратор l="admin" p="admin" делает запрос на запуск игры
            И администратор l="admin" p="admin" делает запрос на показ вопроса
            И администратор l="admin" p="admin" дает возможность ответить на вопрос
            И команда "команда1" делает запрос на отправку ответа r=50 t=5
            То сервер должен вернуть статус 200
            И в ответе состояние игры с ответом на первый вопрос
            # @new
            Сценарий: Администратор принимает решение об ответивших и выдает результат
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И администратор l="admin" p="admin" делает запрос на запуск игры
            И администратор l="admin" p="admin" делает запрос на показ вопроса
            И администратор l="admin" p="admin" дает возможность ответить на вопрос
            И команда "команда1" делает запрос на отправку ответа r=50 t=5
            И команда "команда2" делает запрос на отправку ответа r=90 t=5
            И команда "команда3" делает запрос на отправку ответа r=90 t=7
            Когда я делаю запрос на получение статуса комнаты от лица администратора l="admin" p="admin"
            То сервер должен вернуть статус 200
            И в состоянии игры проставлены следующие количества возможных зон:
            | TeamName | allowZones |
            | команда1 | 0          |
            | команда2 | 2          |
            | команда3 | 1          |

            # @new
            Сценарий: Создание второго тура
            Допустим администратор создает новую игровую комнату
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
            Когда происходит запрос статуса при полностью закрашенной карте
            То сервер должен вернуть статус 200
            И в ответе счетчик туров изменяется на 2
            И в ответе сформирована очередь ходов в порядке "команда1" "команда3" "команда2"

            # @new
            Сценарий: Атака одного игрока на другого
            Допустим администратор создает новую игровую комнату
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
            И происходит запрос статуса при полностью закрашенной карте
            Когда "команда1" нападает из "moscow" на "sort"
            То сервер должен вернуть статус 200
            И в ответе должен быть новый шаг во втором туре
            И в шаге установлены все поля атакующегося и защищающегося

            # @new
            Сценарий: Проведение дуэли между игроками (1 вопрос)
            Допустим администратор создает новую игровую комнату
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
            И происходит запрос статуса при полностью закрашенной карте
            И "команда1" нападает из "moscow" на "sort"
            Когда команда "attacking" дает ответ 0
            И команда "deffender" дает ответ 3
            То сервер должен вернуть статус 200
            И в ответе новый статус игры с ответами защитника и нападающего
            @new
            Сценарий: Проведение дуэли между игроками (1 вопрос) итог (победа атакующих)
            Допустим администратор создает новую игровую комнату
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
            И происходит запрос статуса при полностью закрашенной карте
            И "команда1" нападает из "moscow" на "sort"

            Если команда "attacking" дает ответ 0
            И команда "deffender" дает ответ 3
            То победит команда "attacking"
            И зона "sort" станет принадлежать команде "attacking"

            # @new
            Сценарий: Проведение дуэли между игроками (1 вопрос) итог (победа обороняющихся)
            Допустим администратор создает новую игровую комнату
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
            И происходит запрос статуса при полностью закрашенной карте
            И "команда1" нападает из "moscow" на "sort"

            Если команда "attacking" дает ответ 2
            И команда "deffender" дает ответ 0
            То победит команда "deffender"
            И зона "moscow" станет принадлежать команде "deffender"

            # @new
            Сценарий: Проведение дуэли между игроками (1 вопрос) итог (никто не выиграл)
            Допустим администратор создает новую игровую комнату
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
            И происходит запрос статуса при полностью закрашенной карте
            И "команда1" нападает из "moscow" на "sort"

            Если команда "attacking" дает ответ 1
            И команда "deffender" дает ответ 1
            То победителя нет

            # @new
            Сценарий: Проведение дуэли между игроками (1 вопрос) итог (никто не выиграл)
            Допустим администратор создает новую игровую комнату
            И я делаю запрос создания вариантивного вопроса от лица админа l="admin" p="admin"
            И я делаю запрос создания цифрового вопроса от лица админа l="admin" p="admin"
            И я делаю запрос на создание новой команды "команда1"
            И я делаю запрос на создание новой команды "команда2"
            И я делаю запрос на создание новой команды "команда3"
            И я отправляю запрос на вход в комнату от лица команды "команда1"
            И я отправляю запрос на вход в комнату от лица команды "команда2"
            И я отправляю запрос на вход в комнату от лица команды "команда3"
            И все зоны закрашены командами в следующем количестве:
            | TeamName | Zones |
            | команда1 | 4     |
            | команда2 | 6     |
            | команда3 | 5     |
И происходит запрос статуса при полностью закрашенной карте
И "команда1" нападает из "moscow" на "sort"

Если команда "attacking" дает ответ 0
И команда "deffender" дает ответ 0
То правильная ничья
И задается числовой вопрос
Когда "attacking" делает запрос на отправку ответа r=80 t=7
И "deffender" делает запрос на отправку ответа r=80 t=8
То победит команда "attacking"
И зона "sort" станет принадлежать команде "attacking"
