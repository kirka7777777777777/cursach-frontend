<!-- CourseworkFront/src/pages/MainPage.vue -->
<template>
  <div class="main-page-wrapper">
    <header>
      <ul>
        <!-- Используем <router-link> для навигации -->
        <li><router-link to="/auth">Регистрация</router-link></li>
        <li><img src="/img/moond 2.svg" alt="Логотип Moond"></li>
        <li><router-link to="/auth">Войти</router-link></li> <!-- Ссылка на страницу авторизации -->
      </ul>
    </header>
    <main>
      <div class="preview">
        <!-- Здесь нужно указать путь к изображению или его добавить -->
        <h1>ЗДЕСЬ УДОБНО <span>РАБОТАТЬ</span></h1>
        <p>Канбан-доски, календари, напоминания и<br> уведомления - все это бесплатно для тебя!</p>
<!--        <button>Попробовать</button>-->
        <button class="try-button"><router-link to="/auth">Попробовать</router-link></button>
      </div>
      <div class="description">
        <h3>планировщик для команд и для себя</h3>
        <ul>
          <li>Маркетинг</li>
          <li>Управление проектами</li>
          <li>Самоорганизация</li>
          <li>Обучение</li>
        </ul>
        <div class="info">
          <!-- Здесь может быть контент для блока info -->
        </div>
      </div>
<!--      <div class="reviews">-->
<!--        <h3>Что о нас говорят</h3>-->
<!--        <div class="reviews-block">-->
<!--          <div class="feedback-1">-->
<!--            <img src="/img/иконки%201.png" alt="">-->
<!--            <div class="name">Александр Васнецов</div>-->
<!--            <p class="name">MOOND - это отличная альтернатива подобным отечественным и зарубежным сервисам. Продукт очень быстро развивается, имеет свои отличительные особенности, которые помогают привести дела в порядок и сосредоточиться на их выполнении здесь и сейчас. Всей команде желаю добиться ещё больших успехов! Удачи и терпения!</p>-->
<!--          </div>-->
<!--          <div class="feedback-2">-->
<!--            &lt;!&ndash; Отзыв 2 &ndash;&gt;-->
<!--          </div>-->
<!--          <div class="feedback-3">-->
<!--            &lt;!&ndash; Отзыв 3 &ndash;&gt;-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div class="row">
        <div class="col">
          <div class="testimonial">
            <img src="/img/иконки%201.png" alt="">
            <div class="name">Александр Васнецов</div>
            <p>
              MOOND - это отличная альтернатива подобным отечественным и зарубежным сервисам. Продукт очень быстро развивается, имеет свои отличительные особенности, которые помогают привести дела в порядок и сосредоточиться на их выполнении здесь и сейчас. Всей команде желаю добиться ещё больших успехов! Удачи и терпения!
            </p>
          </div>
        </div>

        <div class="col">
          <div class="testimonial">
            <img src="/img/иконки%202.png" alt="">
            <div class="name">Анастасия Ли</div>
            <p>
              Сервис активно развивается, учитывает потребности пользователей. Инструменты работы с задачами, текстом становятся все удобнее, не заменим в работе — использую самостоятельно, отдельно от инструментов командной работы моей компании. Веду свою базу знаний, списки, задачи автоматически повторяются выстраивая мой день, очень ценный инструмент для работы, команде MOOND респект 😎
            </p>
          </div>
        </div>

        <div class="col">
          <div class="testimonial">
            <img src="/img/иконки%203.png" alt="">
            <div class="name">Николай Гардей</div>


            <p>
              Мне очень важно иметь возможность планировать свою работу, разделять задачи по доскам - здесь все эти возможности.Огромное спасибо разработчикам, пока использую для организации удалённой работы, в будущем планирую использовать для командной работы
            </p>
          </div>
        </div>
      </div>
      <div class="notifications">
        <div class="notifications-block-2">
          <img src="/img/Group%208.svg" alt="Уведомления">
          <div class="notifications-block-3">
            <h1>Будь <span>всегда</span> в курсе</h1>
            <p>Выбирай, какие и куда нужны уведомления - на почту, в браузере</p>
          </div>
        </div>
      </div>
      <div class="functions">
        <div class="notifications-block">
          <h2>Легкое использование для <span>команд и занятых людей</span></h2>
          <h4>Сделали все, чтобы рутинные действия отнимали как можно меньше времени</h4>
        </div>
        <div class="functions-img">
          <div class="function-1">
            <img src="/img/Group%204.svg">
            <h2>Простая структура</h2>
            <p>Рабочее пространство → Проекты → Календарь и доски</p>
          </div>
          <div class="function-1">
            <img src="/img/Group%205.svg">
            <h2>Разные темы</h2>
            <p>Работай с комфортом, меня темы под комфортную. Даже ночью</p>
          </div>
          <div class="function-1">
            <img src="/img/Group%206.svg">
            <h2>Уведомления </h2>
            <p>На почту, в браузере</p>
          </div>
          <div class="function-1">
            <img src="/img/Group%207.svg">
            <h2>Ооочень быстрый</h2>
            <p>Мгновенно переключайся между проектами</p>
          </div>
        </div>
        <!-- <div class="functions-info">
            <ul>
                <li>Простая структура</li>
                <li>Разные темы</li>
                <li>Уведомления</li>
                <li>Оочень быстрый</li>
            </ul>
            <ul>
                <li>Рабочее пространство -> Проекты -> Календарь и доски</li>
                <li>Работай с комфортом, меняй темы под комфортную. Даже ночью</li>
                <li>На почту,в браузере</li>
                <li>Мгновенно переключайся между проектами</li>
            </ul>
        </div> -->
<!--        <div class="functions-info-img">-->
<!--          <img src="/img/Group%204.svg" alt="">-->
<!--          <img src="/img/Group%205.svg" alt="">-->
<!--          <img src="/img/Group%206.svg" alt="">-->
<!--          <img src="/img/Group%207.svg" alt="">-->
<!--        </div>-->
<!--        <div class="functions-info">-->
<!--          <p>Простая структура</p>-->
<!--          <p>Разные темы</p>-->
<!--          <p>Уведомления</p>-->
<!--          <p>Ооочень быстрый</p>-->
<!--        </div>-->
<!--        <div class="functions-info-description">-->
<!--          <p>Рабочее пространство → Проекты → Календарь и доски</p>-->
<!--          <p>Работай с комфортом, меня темы под комфортную. Даже ночью</p>-->
<!--          <p>На почту, в браузере</p>-->
<!--          <p>Мгновенно переключайся между проектами</p>-->
<!--        </div>-->


      </div>
      <div class="try-it">
        <img src="/img/moondwhite%203.svg" alt="">
        <p>Канбан-доски, календари, напоминания и<br> уведомления - все это бесплатно для тебя!</p>
        <button class="try-it-down"><router-link to="/auth">Попробовать</router-link></button>
      </div>
    </main>
  </div>
</template>

<script setup>
// В этом компоненте пока нет сложной логики, поэтому script setup может быть пустым
</script>

<style scoped>
/* Стили из вашего CSS, адаптированные для Vue с scoped */




.notifications-block {
  display: flex;
  flex-direction: column;
  align-items: center;


}
.notifications-block-2 {
  display: flex;
  align-items: center;
  width: 50em;
  padding-left: 10em;
  color: black;

}
.notifications-block-2 span {
  color: #4937B5;
}
.notifications-block-2 img {
  width: 20em;
  height: 20em;
  display: flex;
  align-items: center;

}
.notifications-block span {
  color: #4937B5;
}
.notifications-block-2 p {
  display: flex;
  flex-direction: column;
}
.notifications-block-3 {
  display: flex;
  flex-direction: column;
  margin-left: 3em;
}

.notifications-block h2 {
  font-size: 2.9em;
  color: black;
}
.notifications-block h4 {
  font-size: 1.5em;
  color: black;
}

.functions {
  color: black;

}

.function-1 {
  width: 13em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-1 h2 {
  width: 10em;
  text-align: center;
}

.function-1 p {
  color: #7B7B7B;
  width: 13em;
}


.functions-img {
  display: flex;
  justify-content: space-evenly;
}

.functions-info ul {
  display: flex;
  justify-content: space-around;
  gap: 12em;
}
.functions-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3em;
}
.functions-info-img {
  margin-top: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.functions-info-description {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3em;
  font-size: 0.75em;
}
.try-it {
  margin-top: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4937B5;
  width: 100%; /* Изменили с 40em на 100% */
  height: 14em;
  font-size: 2em;
  color: white;
  justify-content: center;
  padding: 20px; /* Добавляем внутренние отступы */
  box-sizing: border-box; /* Чтобы padding не увеличивал ширину */
}
.try-it button {
  border-radius: 2.5em;
  width: 28.125em;
  height: 3.125em;
  background-color: white;
  color: #4937B5;
  font-size: 0.65em;
}
.row{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.col{

  box-sizing: border-box;
  padding: 15px;
}
.testimonial{
  border-radius: 50px;
  border: #DCDCDC 5px solid;
  width: 270px;
  height: 550px;
  background: #ffffff;
  padding: 30px;
  color: black;
  font-size: 17px;
}
.testimonial img{
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.name{
  font-size: 20px;
  text-transform: uppercase;
  margin: 20px 0;
}









.name {
  vertical-align: inherit;
}


/* Общие стили для li в header. Не забывайте про display: inline-block или flex для ul */
header ul {
  display: flex;
  justify-content: space-around;
  align-items: center; /* Центрируем по вертикали */
  list-style: none; /* Убираем маркеры списка */
  padding: 0;
  margin: 0;
  font-size: 1.5em; /* Установим общий размер шрифта для элементов li */
  gap: 2em; /* Отступы между элементами */
  margin-top: 2em; /* Отступ сверху */
}

header ul li {
  padding: 0 1em; /* Внутренние отступы для элементов списка */
}

header ul a {
  text-decoration: none;
  color: #aca4ff; /* Используем цвет текста родителя */
  transition: color 0.3s ease;
}

header ul a:hover {
  color: #4937B5; /* Цвет при наведении */
}

header ul img {
  padding-right: 2em;
  height: 3em; /* Установим высоту логотипа */
  vertical-align: middle; /* Выравнивание по центру относительно текста */
  margin: 0 1em; /* Отступы вокруг логотипа */
}

/* Стили для Main */
main {
  padding: 20px; /* Общий отступ для контента */
}


.try-it-down a {
  font-family: 'Marmelad', sans-serif;
  color: #4937B5;
}


.try-button {
  margin-top: 1.5em;
  color: white;
  background-color: #4937B5;
  width: 20em;
  height: 3em;
  border-radius: 50px;
  font-size: 26px;
  font-family: 'Marmelad', sans-serif;
}

.feedback-1 h5 {
  display: flex;
  justify-content: center;
}

.preview {
  text-align: center;
  padding: 50px 20px;
}

.preview img {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
  /* Здесь вы можете добавить стили для конкретного изображения, если оно есть */
}

.preview h1 {
  font-size: 3em;
  color: #333;
  margin-bottom: 10px;
}

.preview h1 span {
  color: #4937B5;
}

.preview p {
  font-size: 1.2em;
  color: #555;
  line-height: 1.5;
  margin-bottom: 30px;
}

.preview button:hover {
  background-color: #3a2a94;
}

.description {
  padding: 50px 20px;
  text-align: center;
}

.description h3 {
  font-size: 1.75em;
  color: #000000;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.description ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.description li {
  padding: 10px 20px;
  background-color: #ececef;
  border-radius: 20px;
  font-size: 1.1em;
  color: #666;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.description li:hover {
  background-color: #d0d0d0;
}

.info {
  min-height: 40em; /* Placeholder height */
  min-width: 60em;
  border: 5px solid #DCDCDC;
  background-color: #f4f7f6;
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  margin: 0 auto;
  max-width: 800px;
  background-image: url("/img/workspace.png");
}

.feedback-1 img {
  width: 8em;
  height: 8em;
}

.reviews h3 {
  font-size: 2em;
  color: #333;
  margin-bottom: 30px;
  text-transform: uppercase;
}

/* Дополнительные стили для обертки страницы, чтобы она не влияла на другие элементы */
.main-page-wrapper {
  min-height: 100vh; /* Минимальная высота всей страницы */
  display: flex;
  flex-direction: column;
}
main {
  flex-grow: 1; /* Чтобы main занимал всё доступное пространство */
}

</style>
