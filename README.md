# Домашняя работа
ДЗ по лекции №4.
Делаем робота


## Итоги

Весь пост-процессинг был реализован на WebGL с помощью библиотеки three.js
Эффекты искажения и цветокоррекции созданы с помощью шейдеров и композера.

Выбор в пользу шейдеров был обсуловлен в первую очередь тем, что финальное 
изображение хотелось сделать как можно более кинематографичным, а аналогичный результат
на чистом JS/Canvas был бы нежизнеспособен из-за критичного падения производительности

Далее чуть подробнее о реализации нюансов.

#### Рендер видео
Видео после создания попадает в three-сцену и используется как текстура материала базового объекта 

#### Фильтр для видео
Фильтр реализован последовательным наложением шейдеров
Большинство шейдеров были найдены в интернете, в open-source источниках. 
Шейдер увеличения контраста получилось написать самому, чем горжусь.

#### Анимированный интерфейс
Интерфейс отрисовывается в canvas, который three забирает себе как очередную текстуру. 
Эта текстура добавляется в стек шейдеров в виде TexturePass. Главная сложность с которой пришлось столкнуться - непрозрачность.
Как получилось победить - точно не понял до сих пор. Но всё работает и это здорово.

#### Визуализация звукового сигнала
Здесь ничего интересного. Простой эквалайзер в интерфейсе

#### Датчик движения
Здесь тоже ничего интересного. Просто еще один канвас размером 6*4px, который отправляет коллбэк в интерфейс в том случае,
если средняя яркость меняется на n=2, где 0 ≤ n ≤ 255. Срабатывает только если в течение 5 секунд движения не было.

#### SpeechSynthesis API
В случае захвата движения устройство начинает паниковать и в некоторых браузерах иногда что-нибудь говорить.
Известные проблемы:
не работает в ios safari (обращаться к апи пользователь может только прямым взаимодействием, поэтому программно .speak() не вызывать)
в firefox срабатывает только один раз. причину понять не удалось, возможно от испуга.
