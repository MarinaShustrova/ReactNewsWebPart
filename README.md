## react-news-webpart

- Данный код  представляет собой веб часть разработанную для отображения новостей, размещенных на сайте SharePoint.
- Данная веб часть рабоатет с контекстом  SharePoint, берет массив объектов новостей и отображает их в виде двух возможных вариантов отображения , таких как SingleStyle  и StackStyle.
- Также данная веб часть имеет дополнитлеьные возможности, такие как при клике на изображение новости открывается модальное окно.
- В инпут модального окна  можно ввести ссылку на изображение и следовательно изменить фото новости.
- Веб-часть имеет ряд пользовательских настроек, описанных подробно ниже.

### О пользовательских настройках веб-части

### Установка и сборка проекта

`
npm install - устанавливаем зависимости
gulp serve - запускаем локальный сервер
gulp clean - убираем ненужное
gulp bundle --ship
gulp package-solution --ship

`

### This package produces the following

lib/*- intermediate-stage CommonJS build artifacts
dist/* - the bundled script, along with other resources
deploy/* - all resources which should be uploaded to a CDN.

### Сборка проекта  

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

### Версии React, React-Dom, Gulp, Node

`
React '15.6.6',
React-dom '15.6.6',
gulp '3.9.1',
node ">=0.10.0"

`

### Структура папок sourseдб 

`/src
  /components
     /Service
     SPServices.tsx
    EditNewsModal.tsx
    IReactNewsWebpartProps.ts
    IReactNewsWebpartState.ts
    ReactNewsWebpart.module.css
    ReactNewsWebpart.tsx
    SingleStyle.tsx
    StackStyle.tsx
    StylingPropsState.tsx

  /loc
    en-us.js
    mystrings.js
  ReactNewsWebpart.manifest.json
  ReactNewsWebpart.ts
  