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
      if (!authStore.isAuthenticated && to.name !== 'Login') {
        authStore.requestedUrl = to;
        return {name: 'Login'};
      }
      return true;
    },
    children: [
      {
        path: '/dashboard',
        name: 'Index',
        component: () => import('src/pages/main/IndexPage.vue'),
      },
      {
        path: '/employees',
        name: 'ActiveEmployees',
        component: () => import('src/pages/main/EmployeePage.vue'),
      },
      {
        path: '/employee-form',
        name: 'EmployeeForm',
        component: () => import('src/forms/EmployeeForm.vue')
      },
      {
        path: '/employees/:uid',
        name: 'EmployeeDetail',
        component: () => import('src/pages/shared/EmployeeDetailPage.vue'),
      },
      {
        path: '/divisions',
        name: 'Divisions',
        component: () => import('src/pages/main/DivisionPage.vue'),
      },
      {
        path: '/departments',
        name: 'Departments',
        component: () => import('src/pages/main/DepartmentPage.vue'),
      },
      {
        path: '/sections',
        name: 'Sections',
        component: () => import('src/pages/main/SectionPage.vue'),
      },
      {
        path: '/units',
        name: 'Units',
        component: () => import('src/pages/main/UnitPage.vue'),
      },
      {
        path: '/designations',
        name: 'Designations',
        component: () => import('src/pages/main/DesignationPage.vue'),
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('src/pages/common/AboutPage.vue'),
      },
      {
        path: '/help',
        name: 'Help',
        component: () => import('src/pages/common/HelpPage.vue'),
      },
      {
        path: '/settings',
        name: 'Settings',
        component: () => import('src/pages/common/SettingsPage.vue')
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
      if (!authStore.isAuthenticated && to.name !== 'Login') {
        authStore.requestedUrl = to;
        return {name: 'Login'};
      }
      if (authStore.user) {
        if (!authStore.user.is_superuser) {
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
        component: () => import('src/pages/admin/AdminIndexPage.vue')
      },
      {
        path: 'employees',
        name: 'AdminEmployees',
        component: () => import('src/pages/admin/AdminEmployeePage.vue')
      },
      {
        path: 'divisions',
        name: 'AdminDivisions',
        component: () => import('src/pages/admin/AdminDivisionPage.vue')
      },
      {
        path: 'departments',
        name: 'AdminDepartments',
        component: () => import('src/pages/admin/AdminDepartmentPage.vue')
      },
      {
        path: 'sections',
        name: 'AdminSections',
        component: () => import('src/pages/admin/AdminSectionPage.vue')
      },
      {
        path: 'units',
        name: 'AdminUnits',
        component: () => import('src/pages/admin/AdminUnitPage.vue')
      },
      {
        path: 'designations',
        name: 'AdminDesignations',
        component: () => import('src/pages/admin/AdminDesignationPage.vue')
      },
      {
        path: 'countries',
        name: 'AdminCountries',
        component: () => import('src/pages/admin/AdminCountryPage.vue')
      },
      {
        path: 'nationalities',
        name: 'AdminNationalities',
        component: () => import('src/pages/admin/AdminNationalityPage.vue')
      },
      {
        path: 'educational-levels',
        name: 'AdminEducationalLevels',
        component: () => import('src/pages/admin/AdminEducationalLevelPage.vue')
      }

    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('src/pages/common/LoginPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/common/ErrorNotFound.vue'),
  },

];

export default routes;
