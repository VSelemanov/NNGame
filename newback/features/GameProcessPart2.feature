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
И закрываем соединение по сокету

# @new
Сценарий: Первый сценарий дуэли - победа атакующей команды
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 3
То в сокете в ответе победитель будет команда "команда1"
И зона "yarmarka" переходит во владения команды "команда1"
И команда "команда1" удалена из очереди команд в дуэлях
И закрываем соединение по сокету

# @new
Сценарий: Админ завершает текущий шаг
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 3
И админ l="admin" p="admin" закрывает окно с вопросом
То сервер должен вернуть статус 200
И в сокете должен быть завершен текущий шаг второго тура
И закрываем соединение по сокету


# @new
Сценарий: Второй сценарий дуэли - победа защищающейся команды
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 2
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
То в сокете в ответе победитель будет команда "команда2"
И зона "sort" переходит во владения команды "команда2"
И команда "команда1" удалена из очереди команд в дуэлях
И закрываем соединение по сокету

# @new
Сценарий: Третий сценарий дуэли - ничья с неправильными ответами
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 2
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 2
То в сокете в ответе победителя не будет
И команда "команда1" удалена из очереди команд в дуэлях
И закрываем соединение по сокету

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
И закрываем соединение по сокету

# @new
Сценарий: Четвертый сценарий дуэли - ничья без ответов
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
То в сокете в ответе будет ничья
И в сокете во втором туре появился числовой вопрос
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на числовой вопрос в дуэли r=111 и t=10
И команда "команда2" отвечает на числовой вопрос в дуэли r=111 и t=11
То в сокете в ответе победителя не будет
И команда "команда1" удалена из очереди команд в дуэлях
И закрываем соединение по сокету

# @new
Сценарий: Четвертый сценарий дуэли - ничья с правильными ответами
Допустим команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
И команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
То в сокете в ответе будет ничья
И в сокете во втором туре появился числовой вопрос
И админ l="admin" p="admin" закрывает окно с вопросом
И сервер должен вернуть статус 200
То флаг закрытия вариативного вопроса будет true
И администратор l="admin" p="admin" делает запрос на старт таймера
И команда "команда1" отвечает на числовой вопрос в дуэли r=50 и t=10
И команда "команда2" отвечает на числовой вопрос в дуэли r=111 и t=11
То в сокете в ответе победитель будет команда "команда1"
И зона "yarmarka" переходит во владения команды "команда1"
И команда "команда1" удалена из очереди команд в дуэлях
И админ l="admin" p="admin" закрывает окно с вопросом
И сервер должен вернуть статус 200
И в сокете должен быть завершен текущий шаг второго тура
И закрываем соединение по сокету

# @new
Сценарий: Определение победителя игры (Явный победитель)
Допустим команда "команда1" имеет во владении 4 зоны
И команда "команда2" имеет во владении 9 зоны
И команда "команда3" имеет во владении 2 зоны
И во втором туре уже есть шаг
И во втором туре уже есть шаг
И в очереди второго тура осталась только команда "команда1"
И команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
# в дуэли выигрывает команда 1
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
Когда команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 3
То победителем игры должна стать команда "команда2"
И комната стала неактивной
И закрываем соединение по сокету

@new
Сценарий: Определение победителя игры (Неявный победитель)
Допустим команда "команда1" имеет во владении 5 зоны
И команда "команда2" имеет во владении 7 зоны
И команда "команда3" имеет во владении 3 зоны
И во втором туре уже есть шаг
И во втором туре уже есть шаг
И в очереди второго тура осталась только команда "команда1"
И команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
# в дуэли выигрывает команда 1
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
Когда команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 3
И админ l="admin" p="admin" закрывает окно с вопросом
И сервер должен вернуть статус 200
То запускается тур номер 3 с командами "команда1,команда2"
И команда "команда1" отвечает на числовой вопрос ответ = 30 таймер = 10
И команда "команда2" отвечает на числовой вопрос ответ = 40 таймер = 10
То победителем игры должна стать команда "команда2"
И в состоянии игры указаны результаты числового вопроса
И комната стала неактивной
И закрываем соединение по сокету

# @new
Сценарий: Определение победителя игры (все команда участницы третьего тура ничего не ответили)
Допустим команда "команда1" имеет во владении 5 зоны
И команда "команда2" имеет во владении 7 зоны
И команда "команда3" имеет во владении 3 зоны
И во втором туре уже есть шаг
И во втором туре уже есть шаг
И в очереди второго тура осталась только команда "команда1"
И команда "команда1" делает атаку из зоны "sort" на зону "yarmarka"
И администратор l="admin" p="admin" делает запрос на старт таймера
# в дуэли выигрывает команда 1
И команда "команда1" отвечает на вариативный вопрос в дуэли и дает вариант ответа 0
Когда команда "команда2" отвечает на вариативный вопрос в дуэли и дает вариант ответа 3
То запускается тур номер 3 с командами "команда1,команда2"
И команда "команда1" отвечает на числовой вопрос ответ = 111 таймер = 10
И команда "команда2" отвечает на числовой вопрос ответ = 111 таймер = 10
И победителя игры нет
И закрываем соединение по сокету



