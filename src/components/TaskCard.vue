<script setup>
import { computed } from 'vue';

// Определяем, какие свойства (props) этот компонент ожидает получить от родителя
const props = defineProps({
  task: {
    type: Object,
    required: true,
    // Опциональная валидация для проверки, что объект task имеет нужные поля
    validator: (value) => {
      return ['id', 'text', 'deadline', 'status', 'bgColor'].every(prop => prop in value);
    }
  }
});

// Определяем, какие события (emits) этот компонент может испускать родителю
const emit = defineEmits(['move-task']); // Будем испускать событие 'move-task' при клике на кнопку

// Вычисляемое свойство для текста кнопки, зависит от статуса задачи
const buttonText = computed(() => {
  if (props.task.status === 'queue') return 'Взять';
  if (props.task.status === 'in-progress') return 'Готово';
  if (props.task.status === 'review') return 'Завершить';
  if (props.task.status === 'done') return 'Архив';
  return ''; // Если статус неизвестен
});

// Обработчик клика по кнопке внутри карточки
const handleButtonClick = () => {
  // Испускаем событие 'move-task' родительскому компоненту, передавая ID задачи
  emit('move-task', props.task.id);
};
</script>

<template>
  <!-- Используем классы Tailwind CSS напрямую -->
  <!-- :class привязывает классы динамически, включая цвет фона из task.bgColor -->
  <div :class="['border', 'border-gray-400', 'rounded-lg', 'p-3', 'text-[12px]', 'text-black', 'leading-tight', 'relative', task.bgColor]">
    <!-- v-html используется для отображения текста с <br/>, если он содержит переводы строк -->
    <p v-html="task.text.replace(/\n/g, '<br/>')"></p>
    <div class="flex justify-between text-[8px] mt-4 text-gray-700">
      <span>Дедлайн: {{ task.deadline }}</span>
      <!-- @click привязывает обработчик события к кнопке -->
      <button class="task-action-btn text-[8px] text-black hover:underline" @click="handleButtonClick">
        {{ buttonText }} <!-- Используем вычисляемое свойство для текста кнопки -->
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Здесь можно добавить стили, специфичные для этого компонента, если Tailwind не хватает.
   'scoped' означает, что эти стили будут применяться только к этому компоненту. */
</style>
