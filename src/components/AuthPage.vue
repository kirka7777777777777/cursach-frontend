<!-- CourseworkFront/src/components/AuthPage.vue -->
<template>
  <div class="auth-page-wrapper">
    <header>
      <img src="/img/moond 1.svg" alt="Логотип Moond">
    </header>

    <main>
      <div class="authentication">
        <div class="links">
          <p :class="{ 'active-link': !isRegisterMode }" @click="isRegisterMode = false">Вход</p>
          <p :class="{ 'active-link': isRegisterMode }" @click="isRegisterMode = true">Регистрация</p>
          <span v-if="!isRegisterMode"><p>Забыли пароль?</p></span>
        </div>

        <div class="auth-form">
          <form @submit.prevent="handleSubmit" class="form-example">
            <div class="form-example" v-if="isRegisterMode">
              <label for="name"></label>
              <input type="text" id="name" v-model="formData.name" required placeholder="Имя" />
            </div>

            <div class="form-example">
              <label for="email"></label>
              <input type="email" id="email" v-model="formData.email" required placeholder="Электронная почта" />
            </div>

            <div class="form-example">
              <label for="password"></label>
              <input type="password" id="password" v-model="formData.password" required placeholder="Пароль"/>
            </div>

            <!-- Добавляем чекбокс для регистрации как менеджера -->
            <div class="form-example" v-if="isRegisterMode">
              <label class="checkbox-container">
                <input type="checkbox" v-model="formData.isManager">
                <span class="checkmark"></span>
                Зарегистрироваться как менеджер?
              </label>

              <!-- Поле для секретного ключа, если выбрана регистрация как менеджер -->
              <div v-if="formData.isManager" class="form-example">
                <label for="secret_key"></label>
                <input
                    type="password"
                    id="secret_key"
                    v-model="formData.secret_key"
                    required
                    placeholder="Секретный ключ"
                >
              </div>
            </div>

            <div class="form-example">
              <button type="submit" :disabled="isLoading">
                {{ isRegisterMode ? 'Зарегистрироваться' : 'Войти' }}
              </button>
            </div>
          </form>
        </div>

        <p v-if="authFormMessage" :class="{ 'success': authFormMessageType === 'success', 'error': authFormMessageType === 'error' }">
          {{ authFormMessage }}
        </p>

        <div class="reg-links" v-if="!isRegisterMode">
          <p>У вас еще нет аккаунта?</p>
          <span @click="isRegisterMode = true" class="clickable-link"><p>Зарегистрируйтесь!</p></span>
        </div>
        <div class="reg-links" v-else>
          <p>У вас уже есть аккаунт?</p>
          <span @click="isRegisterMode = false" class="clickable-link"><p>Войдите!</p></span>
        </div>

        <div v-if="isLoading" class="loading-indicator">Загрузка...</div>
      </div>

      <div class="logged-in-section" v-if="loggedInUser">
        <h2>Привет, {{ loggedInUser.name }}!</h2>
        <p>Вы успешно вошли в систему.</p>
        <button @click="handleLogout" class="logged-in-button">Выйти</button>
        <button @click="handleDeleteAccount" class="logged-in-button delete-button">Удалить аккаунт</button>
        <p v-if="logoutMessage" :class="{ 'success': logoutSuccess, 'error': !logoutSuccess }">{{ logoutMessage }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { authService } from '../api/index.js';

const router = useRouter();
const isRegisterMode = ref(false);
const formData = ref({
  name: '',
  email: '',
  password: '',
  isManager: false, // Добавляем флаг для чекбокса
  secret_key: ''    // Добавляем поле для секретного ключа
});
const authFormMessage = ref('');
const authFormMessageType = ref('');
const isLoading = ref(false);
const loggedInUser = ref(null);
const logoutMessage = ref('');
const logoutSuccess = ref(false);

const checkAuthStatus = async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      isLoading.value = true;
      const user = await authService.getUser();

      // Сохраняем полные данные пользователя в localStorage
      localStorage.setItem('user', JSON.stringify(user));
      loggedInUser.value = user;

      authFormMessage.value = '';
      authFormMessageType.value = '';
    } catch (error) {
      console.error('Ошибка проверки токена:', error);
      handleAuthError(error);
    } finally {
      isLoading.value = false;
    }
  } else {
    loggedInUser.value = null;
  }
};

const handleAuthError = (error) => {
  loggedInUser.value = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  if (error.response?.status === 401) {
    authFormMessage.value = 'Сессия истекла. Пожалуйста, войдите снова.';
    authFormMessageType.value = 'error';
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  authFormMessage.value = '';
  authFormMessageType.value = '';

  try {
    let data;
    if (isRegisterMode.value) {
      if (formData.value.isManager) {
        // Регистрация как менеджера
        data = await authService.registerManager(
            formData.value.name,
            formData.value.email,
            formData.value.password,
            formData.value.secret_key
        );
      } else {
        // Обычная регистрация
        data = await authService.register(
            formData.value.name,
            formData.value.email,
            formData.value.password
        );
      }
      authFormMessage.value = data.message || 'Регистрация успешна!';
      authFormMessageType.value = 'success';
      isRegisterMode.value = false;
      formData.value.name = '';
      formData.value.isManager = false;
      formData.value.secret_key = '';
    } else {
      data = await authService.login(
          formData.value.email,
          formData.value.password
      );

      // Сохраняем токен и данные пользователя
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      authFormMessage.value = 'Вход успешен!';
      authFormMessageType.value = 'success';
      await checkAuthStatus();
      router.push('/workspace');
    }
    formData.value.password = '';
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    if (error.response?.status === 401) {
      handleAuthError(error);
    }
    if (error.errors) {
      authFormMessage.value = 'Ошибка: ' + Object.values(error.errors).map(e => e.join(', ')).join('; ');
    } else {
      authFormMessage.value = error.message || 'Произошла ошибка. Проверьте введенные данные.';
    }
    authFormMessageType.value = 'error';
  } finally {
    isLoading.value = false;
  }
};
const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  loggedInUser.value = null;
  logoutMessage.value = 'Вы успешно вышли из системы.';
  logoutSuccess.value = true;
  authFormMessage.value = '';
  authFormMessageType.value = '';
  setTimeout(() => logoutMessage.value = '', 3000);
};

const handleDeleteAccount = async () => {
  if (confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
    isLoading.value = true;
    try {
      const data = await authService.deleteAccount();
      logoutMessage.value = data.message || 'Аккаунт успешно удален.';
      logoutSuccess.value = true;
      handleLogout();
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error);
      logoutMessage.value = error.message || 'Ошибка при удалении аккаунта.';
      logoutSuccess.value = false;
    } finally {
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  checkAuthStatus();
});
</script>

<style scoped>

/* Добавляем стили для чекбокса */
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 14px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4937B5;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Стили остаются без изменений */
.auth-page-wrapper {
  /* ... */
}

@font-face {
  font-family: "Marmelad";
  src: url("/fonts/Marmelad-Regular.ttf") format("truetype");
  font-style: normal;
  font-weight: normal;
}

* {
  font-family: 'Marmelad';
}

header {
  display: flex;
  justify-content: center;
  margin-top: 3em;
}

.auth-form {
  background-color: #DCDCDC;
  width: 45em;
  height: 20em;
  border-radius: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2em 0;
}

.auth-form input {
  background-color: white;
  border-radius: 3em;
  width: 30em;
  height: 2.5em;
  font-size: 1.25em;
  margin-bottom: 1em;
  padding: 0 1em;
  box-sizing: border-box;
  color: #333;
}

.authentication {
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  margin-top: 7em;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.links {
  display: flex;
  justify-content: space-between;
  padding: 0em 2em 0em 2em;
  font-size: 1.5em;
  margin-bottom: 1em;
  width: 45em;
  max-width: 100%;
  box-sizing: border-box;
}

.links p {
  cursor: pointer;
  transition: color 0.3s ease;
}

.links p.active-link {
  font-weight: bold;
  color: #4937B5;
  border-bottom: 2px solid #4937B5;
}

.auth-form input::placeholder {
  text-align: center;
  color: #BAB9BF;
}

.form-example button[type="submit"] {
  background-color: #4937B5;
  color: white;
  border: none;
  border-radius: 3em;
  width: 30em;
  height: 2.5em;
  font-size: 1.25em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-example button[type="submit"]:hover {
  background-color: #3a2a94;
}

.reg-links {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 1.5em;
  line-height: 0;
  margin-top: 2em;
}

.reg-links span {
  color: #4937B5;
  cursor: pointer;
  transition: color 0.3s ease;
}

.reg-links span:hover {
  text-decoration: underline;
}

.links span {
  color: #BAB9BF;
  cursor: pointer;
  transition: color 0.3s ease;
}

.links span:hover {
  text-decoration: underline;
}

p.success {
  color: #28a745;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

p.error {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

.loading-indicator {
  text-align: center;
  margin-top: 20px;
  color: #6c757d;
  font-style: italic;
}

.logged-in-section {
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
}

.logged-in-section h2 {
  color: #333;
  margin-bottom: 15px;
}

.logged-in-section p {
  color: #555;
  margin-bottom: 20px;
}

.logged-in-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 0 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logged-in-button:hover {
  background-color: #0056b3;
}

.logged-in-button.delete-button {
  background-color: #dc3545;
}

.logged-in-button.delete-button:hover {
  background-color: #c82333;
}
</style>