<!-- CourseworkFront/src/App.vue -->
<template>
  <div id="app">
    <!-- router-view будет отображать компонент, соответствующий текущему маршруту -->
    <router-view></router-view>
  </div>
</template>

<script setup>
// Больше не нужно импортировать AuthPage напрямую, так как его будет обрабатывать роутер
</script>

<style>
html {
  font-size: 18px; /* Увеличиваем базовый размер (по умолчанию 16px) */
}
/* Здесь могут быть общие стили для всего приложения,
   например, @font-face, body, html стили, если они не scoped */
body {
  margin: 0;
  background-color: #f4f7f6; /* Или ваш желаемый фон */
  font-family: 'Marmelad', sans-serif; /* Убедитесь, что Marmelad подключен глобально или в каждом компоненте */
}

/* Здесь можно разместить @font-face для Marmelad, если вы хотите, чтобы он был доступен глобально */
@font-face {
  font-family: "Marmelad";
  src: url("/fonts/Marmelad-Regular.ttf") format("truetype"); /* Путь относительно папки public */
  font-style: normal;
  font-weight: normal;
}
</style>
