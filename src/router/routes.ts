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
        path: '/divisions',
        name: 'Divisions',
        component: () => import('pages/main/DivisionPage.vue'),
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
        path: '/units',
        name: 'Units',
        component: () => import('pages/main/UnitPage.vue'),
      },
      {
        path: '/designations',
        name: 'Designations',
        component: () => import('pages/main/DesignationPage.vue'),
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
        name: 'Home',
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
        name: 'AdminEmployees',
        component: () => import('pages/admin/AdminEmployeePage.vue')
      },
      {
        path: 'divisions',
        name: 'AdminDivisions',
        component: () => import('pages/admin/AdminDivisionPage.vue')
      },
      {
        path: 'departments',
        name: 'AdminDepartments',
        component: () => import('pages/admin/AdminDepartmentPage.vue')
      },
      {
        path: 'sections',
        name: 'AdminSections',
        component: () => import('pages/admin/AdminSectionPage.vue')
      },
      {
        path: 'units',
        name: 'AdminUnits',
        component: () => import('pages/admin/AdminUnitPage.vue')
      },
      {
        path: 'designations',
        name: 'AdminDesignations',
        component: () => import('pages/admin/AdminDesignationPage.vue')
      },
      {
        path: 'nationalities',
        name: 'AdminNationalities',
        component: () => import('pages/admin/AdminNationalityPage.vue')
      },
      {
        path: 'educational-levels',
        name: 'AdminEducationalLevels',
        component: () => import('pages/admin/AdminEducationalLevelPage.vue')
      }

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
