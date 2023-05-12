import {reactive} from 'vue';
import {defineStore} from 'pinia';
import {Notify, Loading} from 'quasar';
import {RouteRecordName} from 'vue-router';
import axios from 'axios';

import Router from 'src/router/index';
import {authApi} from 'boot/axios';
import {AuthUser} from 'src/models/auth-user';
interface LoginCredential {
  username: string;
  password: string;
}

interface AuthStoreState {
  access_token: string;
  user: AuthUser | null;
  isAuthenticated: boolean;
  requestedUrl: RouteRecordName | undefined | null;
  loading: boolean;
  error: string;
}

export const useAuthStore = defineStore('auth', () => {
  const credential: LoginCredential = reactive({username: '', password: ''});
  const authState: AuthStoreState = reactive({
    isAuthenticated: false,
    access_token: '',
    user: null,
    requestedUrl: '',
    loading: false,
    error: ''
  });

  function _setError(err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        authState.error = 'connection error.'
      } else {
        authState.error = err.response?.data.detail
      }
    } else if (err instanceof Error) {
      authState.error = err.message;
    } else {
      authState.error = 'Unknown error.'
    }

    Notify.create({
      color: 'negative',
      message: authState.error,
    });

  }
  async function login() {
    authState.loading = true;
    Loading.show();
    try {
      const res = await authApi.post('/login', credential);
      authState.isAuthenticated = true;
      authState.access_token = res.data.access_token;
      authState.user = res.data.user;
      credential.username = '';
      credential.password = '';
      if (!authState.requestedUrl) {
        await Router.push({name: 'Main'});
      }
      await Router.push({name: authState.requestedUrl});

    } catch (err) {
      _setError(err);
    } finally {
      authState.loading = false;
      Loading.hide();
    }
  }

  async function logout() {
    authState.isAuthenticated = false;
    authState.access_token = '';
    authState.user = null;
    authState.requestedUrl = '';
    credential.username = '';
    credential.password = '';
    await Router.push({name: 'Login'});
  }
  return {
    credential,
    login,
    logout,
    authState,
  };
});
