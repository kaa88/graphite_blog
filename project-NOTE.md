Used: New site template v3.00

# Project NOTE

### TO DO:


### Template changes:
- тестировалка шрифтов при их подключении, в h1 (изменения в style.css и globs.css)
- тестировалка svg в index.html
- вернуть html файлы в корень (и в gulpfile) чтобы работал autofilename
- названия style script менять в gulpfile (добавлена переменная с префиксом)
- spoiler неправильно просчитывал размер контента при загрузке, если еще не подгружен шрифт, добавлена отложенная загрузка (spoiler.js)
- spoiler переделан расчет высоты (через wrapper) (html, js, css)
- dist_light_build переименовал в dist_light (gulpfile) для простоты
- popup module (html css js)
- уменьшить кол-во ////// в script.js
- cookies.js
- loadscreen.scss в стиль текста добавить family sans-serif, чтобы не прыгал шрифт во время загрузки, загрузочный спиннер
- css сделать комменты видимые после сборки /**/ с разбивкой на блоки как в js
- ссылку на дом страницу поменять с index.html на /
- main --page-home убрать '--' и переместить в body?