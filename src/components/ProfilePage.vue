<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <!-- Боковая панель как в Workspace -->
      <div class="sidebar">
        <div class="workspace-label">Профиль</div>
        <img
            :src="user.avatar || 'https://storage.googleapis.com/a1aa/image/5468f7e5-6463-4ead-36a3-acbeb3431519.jpg'"
            alt="Аватар"
            class="profile-img-large"
        >
        <nav class="sidebar-nav">
          <router-link to="/workspace">Рабочее пространство</router-link>
          <router-link to="/notifications">Уведомления</router-link>
          <router-link to="/reminders">Напоминания</router-link>
        </nav>
        <div class="logo">M0ND</div>
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
            <input v-model="editForm.name" type="text" class="form-input" placeholder="Новое имя">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editForm.email" type="email" class="form-input" placeholder="Новый email">
          </div>
          <div class="form-group">
            <label>Новый пароль:</label>
            <input v-model="editForm.password" type="password" class="form-input" placeholder="Новый пароль">
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">Сохранить</button>
          </div>
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
  created_at: null
})
const stats = ref(null)
const editMode = ref(false)
const editForm = ref({
  name: '',
  email: '',
  password: ''
})

const confirmDeleteAccount = async () => {
  if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
    try {
      await api.delete('/delete-account')
      // Очищаем данные пользователя и перенаправляем на страницу авторизации
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error)
      alert(error.response?.data?.message || 'Ошибка при удалении аккаунта')
    }
  }
}

const fetchUserData = async () => {
  try {
    const response = await api.get('/user')
    user.value = response.data

    // Инициализация формы после загрузки данных
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
      router.push('/login')
    }
  }
}

const updateProfile = async () => {
  try {
    if (!editForm.value.name.trim()) {
      alert('Поле "Имя" обязательно для заполнения')
      return
    }

    if (!editForm.value.email.trim()) {
      alert('Поле "Email" обязательно для заполнения')
      return
    }

    await api.put('/user/profile', editForm.value)
    await fetchUserData()
    editForm.value.password = '' // Сброс пароля
    editMode.value = false
  } catch (error) {
    console.error('Ошибка обновления профиля:', error)
    alert(error.response?.data?.message || 'Ошибка при обновлении профиля')
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

.delete-account-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.delete-account-button:hover {
  background-color: #c82333;
}

.profile-container {
  background-color: #d1d5db;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.profile-wrapper {
  background-color: white;
  width: 100%;
  max-width: 1200px;
  height: 600px;
  display: flex;
  border: 1px solid #e5e7eb;
}

.sidebar {
  width: 120px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  position: relative;
}

.profile-img-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 32px;
  border: 2px solid #1e3a8a;
}

.profile-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 10px;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: bold;
  min-width: 150px;
  color: #4b5563;
}

.info-value {
  color: #1e293b;
}

.profile-form {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-stats {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 15px;
}

.stat-card {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1e3a8a;
  display: block;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.edit-profile-button {
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

.edit-profile-button:hover {
  background-color: #1e40af;
}

/* Общие стили формы (совместимость с Workspace) */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.submit-button {
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
}

.submit-button:hover {
  background-color: #1e40af;
}

/* Стили для боковой панели (как в Workspace) */
.workspace-label {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 12px;
  color: #4b5563;
  user-select: none;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 32px;
}

.sidebar-nav a {
  font-size: 14px;
  color: #1e3a8a;
  text-decoration: none;
}

.sidebar-nav a:hover {
  text-decoration: underline;
}

.logo {
  font-family: 'Times New Roman', serif;
  font-size: 28px;
  font-weight: bold;
  color: #1e3a8a;
  line-height: 1;
  user-select: none;
  margin-top: auto;
  margin-bottom: 20px;
}
</style>