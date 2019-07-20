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
            И активен тур номер 1
            И команды владеют следующими зонами:
            | teamKey | zone       |
            | team2   | moscowroad |
            | team2   | sormovo    |
            | team2   | varya      |
            | team1   | moscow     |
            | team1   | sort       |
            | team2   | yarmarka   |
            | team2   | avtoz      |
            | team2   | karpovka   |
            | team2   | lenin      |
            | team2   | kremlin    |
            | team2   | scherbinki |
            | team2   | miza       |
            | team3   | sport      |
            | team3   | kuznec     |
            | team3   | pecheri    |

# @new
Сценарий: Начало дуэли
Когда команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
То сервер должен вернуть статус 200
И в сокете установлены зоны атаки и обороны, атакующие и защищающиеся команды

# @new
Сценарий: Старт таймера дуэли
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
Когда администратор l="admin" p="admin" делает запрос на старт таймера
То сервер должен вернуть статус 200
И в сокете шага дуэли флаг старта true

# @new
Сценарий: Команда отвечает на вариативный вопрос дуэли
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
Когда команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 1
То сервер должен вернуть статус 200
И в сокете в ответе атакующего должен появиться ответ 1

# @new
Сценарий: Первый сценарий дуэли - победа атакующей команды
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 3
То в сокете в ответе победитель будет команда "команда1"
И зона "yarmarka" переходит во владения команды "команда1"
И команда "команда1" удалена из очереди команд в дуэлях

# @new
Сценарий: Второй сценарий дуэли - победа защищающейся команды
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 2
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
То в сокете в ответе победитель будет команда "команда2"
И зона "sort" переходит во владения команды "команда2"
И команда "команда1" удалена из очереди команд в дуэлях

# @new
Сценарий: Третий сценарий дуэли - ничья с неправильными ответами
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 2
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 2
То в сокете в ответе победителя не будет
И команда "команда1" удалена из очереди команд в дуэлях

# @new
Сценарий: Четвертый сценарий дуэли - ничья с правильными ответами
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
То в сокете в ответе будет ничья
И в сокете во втором туре появился числовой вопрос
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на числовой вопрос в дуэли r=50 и t=10
И команда "команда2" отвечает на числовой вопрос в дуэли r=50 и t=11
То в сокете в ответе победитель будет команда "команда1"
И зона "yarmarka" переходит во владения команды "команда1"
И команда "команда1" удалена из очереди команд в дуэлях

