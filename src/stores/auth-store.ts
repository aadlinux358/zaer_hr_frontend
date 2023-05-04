import {reactive} from 'vue';
import {defineStore} from 'pinia';
import {Notify} from 'quasar';
import {RouteRecordName} from 'vue-router';

import Router from 'src/router/index';
import {api} from 'boot/axios';
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
}

export const useAuthStore = defineStore('auth', () => {
  const credential: LoginCredential = reactive({username: '', password: ''});
  const authState: AuthStoreState = reactive({
    isAuthenticated: false,
    access_token: '',
    user: null,
    requestedUrl: '',
  });

  async function login() {
    api
      .post('/login', credential)
      .then(async (res) => {
        credential.username = '';
        credential.password = '';
        authState.isAuthenticated = true;
        authState.access_token = res.data.access_token;
        authState.user = res.data.user;
        if (!authState.requestedUrl) {
          await Router.push({name: 'Main'});
        }
        await Router.push({name: authState.requestedUrl});
      })
      .catch((err) => {
        Notify.create({
          color: 'negative',
          message: err.response?.data
            ? err.response.data.detail
            : 'Connection error',
        });
      });
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
