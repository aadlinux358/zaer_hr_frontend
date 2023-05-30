import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {Notify, Loading} from 'quasar';
import {RouteLocationNormalized} from 'vue-router';
import axios from 'axios';

import Router from 'src/router/index';
import {authApi} from 'boot/axios';
import {AuthUser} from 'src/models/auth-user';


export const useAuthStore = defineStore('auth', () => {
  const _username = ref('');
  const _password = ref('');
  const _access_token = ref('');
  const _user: Ref<AuthUser | null> = ref(null);
  const _isAuthenticated = ref(false)
  const _requestedUrl: Ref<RouteLocationNormalized | null> = ref(null);
  const _loading = ref(false);
  const _error = ref('');
  const _authHeader = ref('')

  const lock = computed(() => {
    return !_user.value?.is_staff && !user.value?.is_superuser
  })

  function _setError(err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        _error.value = 'connection error.'
      } else {
        _error.value = err.response?.data.detail
      }
    } else if (err instanceof Error) {
      _error.value = err.message;
    } else {
      _error.value = 'Unknown error.'
    }

    Notify.create({
      color: 'negative',
      message: _error.value,
    });

  }

  const AuthorizationHeader = computed(() => _authHeader.value)
  const isAuthenticated = computed(() => _isAuthenticated.value);
  const user = computed(() => _user.value);
  const username = computed({
    get() {
      return _username.value;
    },
    set(username: string) {
      _username.value = username;
    }
  })
  const password = computed({
    get() {
      return _password.value;
    },
    set(password: string) {
      _password.value = password;
    }
  })
  const requestedUrl = computed({
    get() {
      return _requestedUrl.value;
    },
    set(url) {
      _requestedUrl.value = url;
    }
  })

  async function login() {
    _loading.value = true;
    Loading.show();
    try {
      const res = await authApi.post('/login', {
        username: _username.value,
        password: _password.value
      });
      _isAuthenticated.value = true;
      _access_token.value = res.data.access_token;
      _authHeader.value = `Bearer ${_access_token.value}`
      _user.value = res.data.user;
      _username.value = '';
      _password.value = '';
      if (!requestedUrl.value) {
        await Router.push({name: 'Main'});
      } else {
        await Router.push(requestedUrl.value);
      }

    } catch (err) {
      _setError(err);
    } finally {
      _loading.value = false;
      Loading.hide();
    }
  }

  async function logout() {
    _isAuthenticated.value = false;
    _access_token.value = '';
    _user.value = null;
    _requestedUrl.value = null;
    _username.value = '';
    _password.value = '';
    await Router.push({name: 'Login'});
  }
  return {
    username,
    password,
    login,
    logout,
    lock,
    user,
    isAuthenticated,
    requestedUrl,
    AuthorizationHeader,
  };
});
