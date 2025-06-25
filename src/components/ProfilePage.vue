<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <!-- Боковая панель -->
      <div class="sidebar">
        <div class="workspace-label">Профиль</div>

        <div class="avatar-section">
          <img
              :src="user.avatar || defaultAvatar"
              alt="Аватар"
              class="profile-img-large"
          >
          <button @click="showAvatarModal = true" class="change-avatar-button">
            Сменить аватар
          </button>
        </div>

        <nav class="sidebar-nav">
          <router-link to="/workspace">Рабочее пространство</router-link>
          <router-link to="/notifications">Уведомления</router-link>
          <router-link to="/reminders">Напоминания</router-link>
        </nav>

        <button @click="logout" class="logout-button">Выйти</button>

        <div class="logo">
          <img src="/img/moond%203.svg" alt="Логотип moond">
        </div>
      </div>

      <!-- Основное содержимое профиля -->
      <div class="profile-content">
        <div class="profile-header">
          <button @click="confirmDeleteAccount" class="delete-account-button">
            Удалить аккаунт
          </button>
          <button @click="editMode = !editMode" class="edit-profile-button">
            {{ editMode ? 'Отменить' : 'Редактировать' }}
          </button>
        </div>

        <div v-if="!editMode" class="profile-info">
          <div class="info-row">
            <span class="info-label">Имя:</span>
            <span class="info-value">{{ user.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">{{ user.email }}</span>
          </div>
          <div class="info-row" v-if="user.roles">
            <span class="info-label">Роль:</span>
            <span class="info-value">{{ user.roles.join(', ') }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Дата регистрации:</span>
            <span class="info-value">{{ formatDate(user.created_at) }}</span>
          </div>
        </div>

        <form v-else @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label>Имя:</label>
            <input v-model="editForm.name" type="text" class="form-input" required>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editForm.email" type="email" class="form-input" required>
          </div>
          <div class="form-group">
            <label>Новый пароль:</label>
            <input v-model="editForm.password" type="password" class="form-input" placeholder="Оставьте пустым, если не хотите менять">
          </div>
          <button type="submit" class="submit-button">Сохранить изменения</button>
        </form>

        <div class="profile-stats" v-if="stats">
          <h3>Статистика</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-value">{{ stats.tasks_created }}</span>
              <span class="stat-label">Создано задач</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ stats.tasks_completed }}</span>
              <span class="stat-label">Завершено задач</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">{{ stats.tasks_in_progress }}</span>
              <span class="stat-label">В работе</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно выбора аватара -->
    <div v-if="showAvatarModal" class="avatar-modal">
      <div class="avatar-modal-content">
        <div class="avatar-modal-header">
          <h3>Выберите аватар</h3>
          <button @click="showAvatarModal = false" class="avatar-modal-close">
            &times;
          </button>
        </div>
        <div class="avatar-grid">
          <div
              v-for="(avatar, index) in availableAvatars"
              :key="index"
              class="avatar-option"
              @click="selectAvatar(avatar)"
              :class="{ 'selected': selectedAvatar === avatar }"
          >
            <img :src="avatar" alt="Аватар" class="avatar-preview">
          </div>
        </div>
        <div class="avatar-modal-footer">
          <button @click="showAvatarModal = false" class="cancel-button">Отмена</button>
          <button @click="updateAvatar" class="submit-button" :disabled="!selectedAvatar">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api/index.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({
  name: '',
  email: '',
  roles: [],
  created_at: null,
  avatar: ''
})
const stats = ref(null)
const editMode = ref(false)
const editForm = ref({
  name: '',
  email: '',
  password: ''
})
const showAvatarModal = ref(false)
const selectedAvatar = ref(null)
const defaultAvatar = '/img/avatars/default.png'

// ЗДЕСЬ ВСТАВЬТЕ СВОИ URL ИЗОБРАЖЕНИЙ
const availableAvatars = ref([
  '/img/avatars/иконки 1.png',
  '/img/avatars/иконки 2.png',
  '/img/avatars/иконки 3.png',
  '/img/avatars/иконки 4.png',
  defaultAvatar
])

const fetchUserData = async () => {
  try {
    const response = await api.get('/user')
    user.value = response.data
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      password: ''
    }

    const statsResponse = await api.get('/user/stats')
    stats.value = statsResponse.data
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error)
    if (error.response?.status === 401) {
      router.push('/')
    }
  }
}

const updateProfile = async () => {
  try {
    await api.put('/user/profile', editForm.value)
    await fetchUserData()
    editMode.value = false
  } catch (error) {
    console.error('Ошибка обновления профиля:', error)
    alert(error.response?.data?.message || 'Ошибка при обновлении профиля')
  }
}

const confirmDeleteAccount = async () => {
  if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
    try {
      await api.delete('/user')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      router.push('/')
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error)
      alert(error.response?.data?.message || 'Ошибка при удалении аккаунта')
    }
  }
}

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

const updateAvatar = async () => {
  if (!selectedAvatar.value) return;

  try {
    await api.put('/user/profile', {
      avatar: selectedAvatar.value
    });

    // Обновляем данные пользователя
    user.value.avatar = selectedAvatar.value;
    showAvatarModal.value = false;

    alert('Аватар успешно обновлён!');
  } catch (error) {
    console.error('Ошибка при обновлении аватара:', error);
    alert('Не удалось обновить аватар');
  }
}

const logout = async () => {
  try {
    await api.post('/logout')
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.push('/')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.profile-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.profile-wrapper {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
}

.sidebar {
  width: 200px;
  padding: 20px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-img-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #4937B5;
  margin: 20px 0;
}

.change-avatar-button {
  background: #4937B5;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 14px;
}

.change-avatar-button:hover {
  background: #3a2b8f;
}

.logout-button {
  margin-top: auto;
  background: #f44336;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
}

.logout-button:hover {
  background: #d32f2f;
}

.profile-content {
  flex: 1;
  padding: 30px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.delete-account-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-profile-button {
  background: #4937B5;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.profile-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  margin-bottom: 15px;
}

.info-label {
  font-weight: bold;
  min-width: 150px;
  color: #555;
}

.info-value {
  color: #333;
}

.profile-form {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-button {
  background: #4937B5;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.submit-button:hover {
  background: #3a2b8f;
}

.submit-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4937B5;
  display: block;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* Стили для модального окна аватара */
.avatar-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.avatar-modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
}

.avatar-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.avatar-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.avatar-option {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: all 0.3s;
  overflow: hidden;
}

.avatar-option.selected {
  border-color: #4937B5;
}

.avatar-preview {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.avatar-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-button {
  background: #f0f0f0;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background: #e0e0e0;
}
</style>