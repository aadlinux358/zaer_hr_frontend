import {useAuthStore} from 'src/stores/auth-store';
import {RouteRecordRaw} from 'vue-router';
import {Notify} from 'quasar';

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
        path: '/dashboard',
        name: 'Index',
        component: () => import('pages/main/IndexPage.vue'),
      },
      {
        path: '/employees',
        name: 'Employees',
        component: () => import('pages/main/EmployeePage.vue'),
      },
      {
        path: '/departments',
        name: 'Departments',
        component: () => import('pages/main/DepartmentPage.vue'),
      },
      {
        path: '/sections',
        name: 'Sections',
        component: () => import('pages/main/SectionPage.vue'),
      },
      {
        path: '/sub-sections',
        name: 'SubSections',
        component: () => import('pages/main/SubSectionPage.vue'),
      },
      {
        path: '/current-jobs',
        name: 'CurrentJobs',
        component: () => import('pages/main/CurrentJobPage.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('pages/common/AboutPage.vue'),
      },
      {
        path: '/help',
        name: 'Help',
        component: () => import('pages/common/HelpPage.vue'),
      },
      {
        path: '',
        redirect: {name: 'Index'},
      }
    ],
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('layouts/AdminLayout.vue'),
    beforeEnter: (to /* from */) => {
      const authStore = useAuthStore();
      if (!authStore.authState.isAuthenticated && to.name !== 'Login') {
        authStore.authState.requestedUrl = to.name;
        return {name: 'Login'};
      }
      if (authStore.authState.user) {
        if (!authStore.authState.user.is_superuser) {
          Notify.create({
            color: 'negative',
            message: 'you must have admin privileges'
          })
          return false
        }
      } else {
        return false;
      }
      return true;
    },

    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('pages/admin/AdminIndexPage.vue')
      },
      {
        path: 'employees',
        name: 'AdminEmployee',
        component: () => import('pages/admin/AdminEmployeePage.vue')
      },
      {
        path: 'departments',
        name: 'AdminDepartment',
        component: () => import('pages/admin/AdminDepartmentPage.vue')
      },
      {
        path: 'sections',
        name: 'AdminSection',
        component: () => import('pages/admin/AdminSectionPage.vue')
      },
      {
        path: 'sub-sections',
        name: 'AdminSubSection',
        component: () => import('pages/admin/AdminSubSectionPage.vue')
      },
      {
        path: 'current-jobs',
        name: 'AdminCurrentJob',
        component: () => import('pages/admin/AdminCurrentJobPage.vue')
      },

    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/common/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/common/ErrorNotFound.vue'),
  },
];

export default routes;
