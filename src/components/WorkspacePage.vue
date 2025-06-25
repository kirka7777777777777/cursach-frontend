<template>
  <div class="workspace-container">
    <div class="workspace-wrapper">
      <!-- Левая боковая панель -->
      <div class="sidebar">
        <router-link to="/profile" class="avatar-link">
          <img
              :src="user?.avatar || defaultAvatar"
              alt="Аватар"
              class="profile-img"
          >
        </router-link>

        <router-link to="/profile" class="profile-link">
          Профиль
        </router-link>

        <nav class="sidebar-nav">
          <router-link to="/notifications">Уведомления</router-link>
          <router-link to="/reminders">Напоминания</router-link>
          <router-link to="/calendar">Календарь</router-link>
        </nav>

        <button @click="showAddCardModal = true" class="add-button">
          <i class="fas fa-plus"></i>
        </button>

        <div class="logo">
          <img src="/img/moond%203.svg" alt="Логотип moond">
        </div>
      </div>

      <!-- Основная область с колонками -->
      <div class="columns-container">
        <!-- Колонка "Очередь" -->
        <div
            class="column"
            @drop="onDrop($event, 'todo')"
            @dragover.prevent
            @dragenter.prevent
        >
          <div class="column-header">Очередь</div>
          <div class="tasks-list">
            <div
                v-for="card in todoCards"
                :key="card.id"
                class="task-card"
                draggable="true"
                @dragstart="startDrag($event, card)"
            >
              <p class="task-title">{{ card.title || 'Без названия' }}</p>
              <div class="task-assignee" v-if="card.assigned_to">
                <span class="assignee-label">Исполнитель:</span>
                <span class="assignee-name">
    {{ card.user_assigned?.name || 'Загрузка...' }}
  </span>
              </div>
              <div class="task-footer">
                <span class="task-deadline" v-if="card.deadline">
                  Дедлайн: {{ formatDate(card.deadline) }}
                </span>
                <div>
                  <button @click.stop="openCardDetails(card)" class="details-button">Подробнее</button>
                  <div v-if="userHasRole('admin')" class="admin-actions">
                    <button @click.stop="openEditModal(card)" class="edit-button">✏️</button>
                    <button @click.stop="confirmDelete(card)" class="delete-button">🗑️</button>
                  </div>
                  <button
                      @click.stop="assignCard(card)"
                      class="take-button"
                      v-if="!card.assigned_to"
                  >
                    Взять
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Колонка "В работе" -->
        <div
            class="column"
            @drop="onDrop($event, 'in_progress')"
            @dragover.prevent
            @dragenter.prevent
        >
          <div class="column-header">В работе</div>
          <div class="tasks-list">
            <div
                v-for="card in inProgressCards"
                :key="card.id"
                class="task-card"
                draggable="true"
                @dragstart="startDrag($event, card)"
            >
              <p class="task-title">{{ card.title || 'Без названия' }}</p>
              <div class="task-assignee" v-if="card.assigned_to">
                <span class="assignee-label">Исполнитель:</span>
                <span class="assignee-name">
    {{ card.user_assigned?.name || 'Загрузка...' }}
  </span>
              </div>
              <div class="task-footer">
                <span class="task-deadline" v-if="card.deadline">
                  Дедлайн: {{ formatDate(card.deadline) }}
                </span>
                <div>
                  <button @click.stop="openCardDetails(card)" class="details-button">Подробнее</button>
                  <div v-if="userHasRole('admin')" class="admin-actions">
                    <button @click.stop="openEditModal(card)" class="edit-button">✏️</button>
                    <button @click.stop="confirmDelete(card)" class="delete-button">🗑️</button>
                  </div>
                  <button
                      @click.stop="moveToReview(card)"
                      class="review-button"
                      v-if="card.assigned_to === user.id"
                  >
                    На проверку
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Колонка "Проверка" -->
        <div
            class="column"
            @drop="onDrop($event, 'review')"
            @dragover.prevent
            @dragenter.prevent
        >
          <div class="column-header">Проверка</div>
          <div class="tasks-list">
            <div
                v-for="card in reviewCards"
                :key="card.id"
                class="task-card"
                draggable="true"
                @dragstart="startDrag($event, card)"
            >
              <p class="task-title">{{ card.title || 'Без названия' }}</p>
              <div class="task-assignee" v-if="card.assigned_to">
                <span class="assignee-label">Исполнитель:</span>
                <span class="assignee-name">
    {{ card.user_assigned?.name || 'Загрузка...' }}
  </span>
              </div>
              <div class="task-footer">
                <span class="task-deadline" v-if="card.deadline">
                  Дедлайн: {{ formatDate(card.deadline) }}
                </span>
                <div class="review-actions">
                  <button @click.stop="openCardDetails(card)" class="details-button">Подробнее</button>
                  <div v-if="userHasRole('admin')" class="admin-actions">
                    <button @click.stop="openEditModal(card)" class="edit-button">✏️</button>
                    <button @click.stop="confirmDelete(card)" class="delete-button">🗑️</button>
                  </div>
                  <div class="review-buttons">
                    <button
                        @click.stop="openRejectModal(card)"
                        class="reject-button"
                        v-if="userHasRole(['admin', 'manager'])"
                    >
                      Вернуть
                    </button>
                    <button
                        @click.stop="approveCard(card)"
                        class="approve-button"
                        v-if="userHasRole(['admin', 'manager'])"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Колонка "Готово" -->
        <div
            class="column-ready"
            @drop="onDrop($event, 'done')"
            @dragover.prevent
            @dragenter.prevent
        >
          <div class="column-header">Готово</div>
          <div class="tasks-list">
            <div
                v-for="card in doneCards"
                :key="card.id"
                class="task-card"
                draggable="true"
                @dragstart="startDrag($event, card)"
            >
              <p class="task-title">{{ card.title || 'Без названия' }}</p>
              <div class="task-assignee" v-if="card.assigned_to">
                <span class="assignee-label">Исполнитель:</span>
                <span class="assignee-name">
    {{ card.user_assigned?.name || 'Загрузка...' }}
  </span>
              </div>
              <div class="task-footer">
                <span class="task-deadline" v-if="card.deadline">
                  Дедлайн: {{ formatDate(card.deadline) }}
                </span>
                <button @click.stop="openCardDetails(card)" class="details-button">Подробнее</button>
                <div v-if="userHasRole('admin')" class="admin-actions">
                  <button @click.stop="openEditModal(card)" class="edit-button">✏️</button>
                  <button @click.stop="confirmDelete(card)" class="delete-button">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Модальное окно добавления карточки -->
    <div v-if="showAddCardModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Добавить новую задачу</h3>
          <button @click="showAddCardModal = false" class="modal-close">
            &times;
          </button>
        </div>
        <form @submit.prevent="addNewCard" class="modal-form">
          <div class="form-group">
            <label>Название:</label>
            <input
                v-model="newCard.title"
                type="text"
                required
                class="form-input"
                placeholder="Введите название задачи"
            >
          </div>
          <div class="form-group">
            <label>Описание:</label>
            <textarea
                v-model="newCard.description"
                class="form-input"
                placeholder="Введите описание задачи"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Дедлайн:</label>
            <input
                v-model="newCard.deadline"
                type="date"
                class="form-input"
                :min="new Date().toISOString().split('T')[0]"
            >
          </div>
          <div class="form-group">
            <label>Статус:</label>
            <select v-model="newCard.status" class="form-input">
              <option value="todo">Очередь</option>
              <option value="in_progress">В работе</option>
              <option value="review">Проверка</option>
              <option value="done">Готово</option>
            </select>
          </div>
          <button
              type="submit"
              class="submit-button"
              :disabled="!newCard.title.trim()"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>

    <!-- Модальное окно деталей карточки -->
    <!-- Модальное окно деталей карточки -->
    <!-- Модальное окно деталей карточки -->
    <div v-if="showCardDetailsModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Детали задачи</h3>
          <button @click="showCardDetailsModal = false" class="modal-close">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">Название:</span>
            <span class="detail-value">{{ selectedCard?.title || 'Не указано' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Описание:</span>
            <span class="detail-value">{{ selectedCard?.description || 'Нет описания' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Дедлайн:</span>
            <span class="detail-value">
              {{ selectedCard?.deadline ? formatDate(selectedCard.deadline) : 'Не установлен' }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Статус:</span>
            <span class="detail-value">
              {{ getStatusText(selectedCard?.status) }}
            </span>
          </div>
          <!-- Блок для комментариев -->
          <div class="detail-row" v-if="selectedCard?.comment">
            <span class="detail-label">Комментарий:</span>
            <span class="detail-value">{{ selectedCard.comment }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showCardDetailsModal = false" class="close-button">Закрыть</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для комментария при возврате -->
    <div v-if="showRejectModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Вернуть задачу на доработку</h3>
          <button @click="showRejectModal = false" class="modal-close">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Комментарий:</label>
            <textarea
                v-model="rejectComment"
                class="form-input"
                placeholder="Опишите проблему"
                rows="4"
                required
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showRejectModal = false" class="cancel-button">Отмена</button>
          <button @click="rejectCard" class="reject-button" :disabled="!rejectComment.trim()">Вернуть</button>
        </div>
      </div>
  </div>
    <!-- Модальное окно редактирования карточки -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Редактировать задачу</h3>
          <button @click="showEditModal = false" class="modal-close">
            &times;
          </button>
        </div>
        <form @submit.prevent="updateCard" class="modal-form">
          <div class="form-group">
            <label>Название:</label>
            <input
                v-model="editedCard.title"
                type="text"
                required
                class="form-input"
                placeholder="Введите название задачи"
            >
          </div>
          <div class="form-group">
            <label>Описание:</label>
            <textarea
                v-model="editedCard.description"
                class="form-input"
                placeholder="Введите описание задачи"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Дедлайн:</label>
            <input
                v-model="editedCard.deadline"
                type="date"
                class="form-input"
            >
          </div>
          <div class="form-group">
            <label>Статус:</label>
            <select v-model="editedCard.status" class="form-input">
              <option value="todo">Очередь</option>
              <option value="in_progress">В работе</option>
              <option value="review">Проверка</option>
              <option value="done">Готово</option>
            </select>
          </div>
          <button
              type="submit"
              class="submit-button"
              :disabled="!editedCard.title.trim()"
          >
            Сохранить
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../api/index.js'

const defaultAvatar = 'https://storage.googleapis.com/a1aa/image/5468f7e5-6463-4ead-36a3-acbeb3431519.jpg'

const router = useRouter()
const cards = ref([])
const showAddCardModal = ref(false)
const showCardDetailsModal = ref(false)
const showRejectModal = ref(false)
const showEditModal = ref(false)
const selectedCard = ref(null)
const cardToReject = ref(null)
const editedCard = ref(null)
const rejectComment = ref('')
const newCard = ref({
  title: '',
  description: '',
  deadline: '',
  status: 'todo'
})
const draggedCard = ref(null)
const user = ref(null)
// Проверка ролей пользователя
// Улучшенная проверка ролей пользователя
const userHasRole = (roles) => {
  if (!user.value || !user.value.roles) return false;
  return user.value.roles.some(role => roles.includes(role));
}

const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  }
};

const updateAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Обновляем аватар в интерфейсе
    const user = JSON.parse(localStorage.getItem('user'));
    user.avatar = response.data.avatar;
    localStorage.setItem('user', JSON.stringify(user));

    // Обновляем данные пользователя
    await fetchUser();
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error);
  }
};




// Улучшенный метод получения пользователя
const fetchUser = async () => {
  try {
    const response = await api.get('/user')
    user.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
    if (error.response?.status === 401) {
      router.push('/')
    }
  }
}

const openEditModal = (card) => {
  editedCard.value = { ...card }
  showEditModal.value = true
}

const updateCard = async () => {
  try {
    await api.put(`/cards/${editedCard.value.id}`, editedCard.value)
    await fetchCards()
    showEditModal.value = false
  } catch (error) {
    console.error('Ошибка при обновлении карточки:', error)
  }
}

const confirmDelete = (card) => {
  if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
    deleteCard(card)
  }
}

const deleteCard = async (card) => {
  try {
    await api.delete(`/cards/${card.id}`)
    await fetchCards()
  } catch (error) {
    console.error('Ошибка при удалении карточки:', error)
  }
}

// Метод для перемещения карточки на проверку
const moveToReview = async (card) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));

    // Проверяем, что карточка назначена текущему пользователю
    if (card.assigned_to !== user.id) {
      alert('Вы можете отправлять на проверку только свои карточки');
      return;
    }

    await api.put(`/cards/${card.id}`, {
      status: 'review'
    });
    await fetchCards();
  } catch (error) {
    console.error('Ошибка при перемещении на проверку:', error);
    alert(error.response?.data?.message || 'Ошибка при перемещении на проверку');
  }
};
// Метод для одобрения карточки
const approveCard = async (card) => {
  try {
    await api.put(`/cards/${card.id}`, {
      ...card,
      status: 'done'
    });
    await fetchCards();
  } catch (error) {
    console.error('Ошибка при подтверждении карточки:', error);
  }
};

// Открытие модального окна для возврата
const openRejectModal = (card) => {
  cardToReject.value = card;
  rejectComment.value = '';
  showRejectModal.value = true;
};

// Метод для возврата карточки в работу
const rejectCard = async () => {
  try {
    if (!userHasRole(['admin', 'manager'])) {
      alert('Только менеджеры и администраторы могут возвращать карточки');
      return;
    }

    // Обновляем локальную копию карточки
    const index = cards.value.findIndex(c => c.id === cardToReject.value.id)
    if (index !== -1) {
      cards.value[index] = {
        ...cards.value[index],
        status: 'in_progress',
        comment: rejectComment.value
      }
    }

    showRejectModal.value = false
    rejectComment.value = ''
  } catch (error) {
    console.error('Ошибка при возврате карточки:', error);
  }
}

const fetchCards = async () => {
  try {
    const response = await api.get('/cards?with=userAssigned');
    if (response.data && Array.isArray(response.data)) {
      cards.value = response.data.map(card => ({
        id: card.id,
        title: card.title || 'Без названия',
        description: card.description || '',
        deadline: card.deadline || null,
        status: card.status || 'todo',
        assigned_to: card.assigned_to || null,
        created_by: card.created_by,
        user_assigned: card.user_assigned // Добавляем данные об исполнителе
      }));
    }
  } catch (error) {
    console.error('Ошибка при загрузке карточек:', error);
    if (error.response?.status === 401) {
      router.push('/auth');
    }
  }
};

const todoCards = computed(() => cards.value.filter(card => card.status === 'todo'))
const inProgressCards = computed(() => cards.value.filter(card => card.status === 'in_progress'))
const reviewCards = computed(() => cards.value.filter(card => card.status === 'review'))
const doneCards = computed(() => cards.value.filter(card => card.status === 'done'))

const getStatusText = (status) => {
  const statusMap = {
    'todo': 'Очередь',
    'in_progress': 'В работе',
    'review': 'Проверка',
    'done': 'Готово'
  };
  return statusMap[status] || 'Неизвестно';
};

const openCardDetails = (card) => {
  selectedCard.value = card;
  showCardDetailsModal.value = true;
};

const addNewCard = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user?.id) {
      console.error('Пользователь не авторизован')
      router.push('/auth')
      return
    }

    if (!newCard.value.title.trim()) {
      alert('Введите название задачи')
      return
    }

    const taskData = {
      title: newCard.value.title.trim(),
      description: newCard.value.description.trim(),
      deadline: newCard.value.deadline
          ? `${newCard.value.deadline} 23:59:59`
          : null,
      status: newCard.value.status,
      created_by: user.id
    }

    const response = await api.post('/cards', {
      ...taskData,
      assignee_name: user.name // Добавляем имя создателя
    });

    cards.value.push({
      ...response.data,
      id: response.data.id || Date.now()
    })

    showAddCardModal.value = false
    newCard.value = {
      title: '',
      description: '',
      deadline: '',
      status: 'todo'
    }

  } catch (error) {
    console.error('Ошибка:', error)
    alert(error.response?.data?.message || 'Ошибка при создании карточки')
    if (error.response?.status === 401) {
      router.push('/auth')
    }
  }
}

const assignCard = async (card) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) {
      router.push('/auth');
      return;
    }

    // Проверяем, можно ли взять карточку
    if (card.assigned_to && card.assigned_to !== user.id) {
      alert('Вы можете брать только неназначенные карточки');
      return;
    }

    await api.put(`/cards/${card.id}`, {
      assigned_to: user.id,
      status: 'in_progress'
    });
    await fetchCards();
  } catch (error) {
    console.error('Ошибка при назначении карточки:', error);
    alert(error.response?.data?.message || 'Ошибка при назначении карточки');
  }
};

const startDrag = (event, card) => {
  event.dataTransfer.setData('text/plain', card.id);
  draggedCard.value = card;
};

const onDrop = async (event, newStatus) => {
  if (!draggedCard.value) return;

  try {
    const user = JSON.parse(localStorage.getItem('user'));

    // Для админов и менеджеров разрешаем любые перемещения
    if (userHasRole(['admin', 'manager'])) {
      await api.put(`/cards/${draggedCard.value.id}`, {
        status: newStatus,
        // Сохраняем текущего исполнителя или назначаем нового
        assigned_to: draggedCard.value.assigned_to || user.id
      });
      await fetchCards();
      return;
    }

    // Логика для обычных пользователей остается прежней
    if (newStatus === 'in_progress') {
      await assignCard(draggedCard.value);
    } else if (newStatus === 'review') {
      await moveToReview(draggedCard.value);
    }
  } catch (error) {
    console.error('Ошибка при перемещении карточки:', error);
    alert(error.response?.data?.message || 'Ошибка при перемещении карточки');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Не указан'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}


onMounted(async () => {
  await fetchUser()
})
</script>

<style scoped>

* {
  font-family: 'Marmelad', sans-serif;
}

.avatar-upload {
  position: relative;
  margin-top: 32px;
  cursor: pointer;
}



.avatar-link {
  display: block;
  margin-top: 32px;
}

.profile-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s;
}

.avatar-link:hover .profile-img {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.avatar-upload:hover .profile-img {
  opacity: 0.8;
}

.profile-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  transition: opacity 0.3s;
}


.logout-button {
  margin-top: auto;
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #d32f2f;
}



.task-assignee {
  margin: 0.3125em 0;
  font-size: 0.8em;
  color: #555;
}

.assignee-label {
  font-size: 13px;
  font-weight: bold;
  margin-right: 0.3125em;
}

.assignee-name {
  font-size: 1px;
  color: #1e3a8a;
}

/* Добавить в секцию стилей */
.admin-actions {
  display: flex;
  gap: 0.3125em;
  margin-top: 0.3125em;
}

.edit-button, .delete-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 0.3125em;
}

.edit-button:hover {
  color: #1e40af;
}

.delete-button:hover {
  color: #f44336;
}

.task-footer {
  display: flex;
  flex-direction: column;
  gap: 0.3125em;
}


/* Стили для комментариев */
.comments-list {
  margin-top: 10px;
  width: 100%;
}

.comment {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
}

.comment-text {
  margin: 0;
  word-break: break-word;
}

.comment-date {
  margin: 4px 0 0 0;
  font-size: 0.8em;
  color: #666;
  text-align: right;
}

/* Обновленные стили для кнопок в колонке "Проверка" */
.review-actions {
  display: flex;
  flex-direction: column;
  gap: 0.3125em;
  width: 100%;
}

.review-buttons {
  display: flex;
  gap: 0.3125em;
  justify-content: space-between;
}

.reject-button {
  background-color: #4937B5;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.3125em 10px;
  font-size: 12px;
  cursor: pointer;
  flex: 1;
  text-align: center;
}

.approve-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.3125em 10px;
  font-size: 12px;
  cursor: pointer;
  flex: 1;
  text-align: center;
}

.details-button {
  background-color: #9E9E9E;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.3125em 10px;
  font-size: 20px;
  cursor: pointer;
  width: 100%;
}

/* Убедимся, что карточки не выходят за пределы колонки */
.task-card {
  max-width: 100%;
  overflow: hidden;
}

.task-footer {
  width: 100%;
}


.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  flex: 1;
  padding: 10px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.submit-button {
  flex: 1;
  padding: 10px;
  background: #1e3a8a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
  background: #1e40af;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.form-input:focus {
  outline: none;
  border-color: #1e40af;
}

textarea.form-input {
  min-height: 80px;
  resize: vertical;
}

/* Основные стили */
.workspace-container {
  width: 100%;
  max-width: 1400px; /* или другое значение по вашему выбору */
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: center;
}

.workspace-wrapper {
  background-color: white;
  width: 100%;
  height: 600px;
  display: flex;
  min-height: 80vh; /* 80% высоты viewport */
  border-radius: 12px;
}

/* Боковая панель */
.sidebar {
  width: 150px; /* было 120px */
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  position: relative;
}

.workspace-label {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 12px;
  color: #4b5563;
  user-select: none;
}

.profile-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 32px;
}

.profile-link {
  margin-top: 8px;
  font-size: 14px;
  color: #4937B5;
  text-decoration: none;
}

.profile-link:hover {
  text-decoration: underline;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
}

.sidebar-nav a {
  font-size: 14px;
  color: #4937B5;
  text-decoration: none;
}

.sidebar-nav a:hover {
  text-decoration: underline;
}

.add-button {
  background-image: url("public/img/plus.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  margin-top: auto;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4937B5;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 8px;
}


.add-button:hover {
  background-color: #1e40af;
}

.task-card {
  background-color: white;
  border: 1px solid #BAB9BF;
  border-radius: 25px;
  padding: 12px;
  font-size: 12px;
  margin-bottom: 8px;
  cursor: grab;
}

.task-card:active {
  cursor: grabbing;
}

.task-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
  word-break: break-word;
  color: #333;
  min-height: 1.2em;
}

.task-deadline {
  color: #555;
  font-size: 1em;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.details-button {
  font-size: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4937B5;
  margin-right: 0.3125em;
}

.details-button:hover {
  text-decoration: underline;
}

.take-button {
  font-size: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
}

.take-button:hover {
  text-decoration: underline;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #4937B5;
  line-height: 1;
  user-select: none;
  margin-top: 10px;
}

.logo img {
  width: 100px;
  height: 50px;
}
.columns-container::-webkit-scrollbar {
  height: 8px;
}
.columns-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 4px;
}

.columns-container::-webkit-scrollbar-thumb {
  background-color: #4937B5;
  border-radius: 4px;
}

.columns-container {
  width: 100%;
  display: flex;
  padding: 25px;
  gap: 25px;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #4937B5 #f0f0f0;
}

.columns-container::-webkit-scrollbar {
  height: 8px;
}

.columns-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 4px;
}

.columns-container::-webkit-scrollbar-thumb {
  background-color: #4937B5;
  border-radius: 4px;
}

.column {
  flex: 1;
  padding-right: 1em;
  border-right: 1px solid #e5e7eb;
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.column-ready {
  width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}


.column-header {
  text-align: center;
  font-size: 14px;
  color: #000000;
  border: 1px solid #4937B5;
  border-radius: 20px;
  padding: 0.3125em 0;
  margin-bottom: 10px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card-gray {
  background-color: #e5e7eb;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%; /* Установите ширину в процентах */
  max-width: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  color: #555;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
}

.modal-close:hover {
  color: #4b5563;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
}

/* Стили для модального окна деталей */
.modal-body {
  padding: 15px 0;
}

.detail-row {
  margin-bottom: 12px;
  display: flex;
}

.detail-label {
  font-weight: bold;
  min-width: 80px;
  color: #555;
}

.detail-value {
  flex: 1;
  word-break: break-word;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.close-button {
  padding: 8px 16px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #1e40af;
}

/* Анимации и drag-and-drop */
[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}

.task-enter-active,
.task-leave-active {
  transition: all 0.5s ease;
}

.task-enter-from,
.task-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>