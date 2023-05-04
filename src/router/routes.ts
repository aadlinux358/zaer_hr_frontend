import {useAuthStore} from 'src/stores/auth-store';
import {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Main',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: (to /* from */) => {
      const authStore = useAuthStore();
      if (!authStore.authState.isAuthenticated && to.name !== 'Login') {
        authStore.authState.requestedUrl = to.name;
        return {name: 'Login'};
      }
      return true;
    },
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('pages/AboutPage.vue'),
      },
      {
        path: '/help',
        name: 'Help',
        component: () => import('pages/HelpPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
