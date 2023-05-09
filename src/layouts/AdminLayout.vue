<template>
  <q-layout view="lHh Lpr lFf">
    <MainAppHeader />
    <q-drawer v-model="uiStore.leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item-label header> ZaEr Human Resources </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container class="q-ma-xs">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';
import MainAppHeader from 'components/MainAppHeader.vue'
import {useUiStore} from 'src/stores/ui-store.ts'

const uiStore = useUiStore();

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    link: 'AdminDashboard',
  },
  {
    title: 'Employee',
    icon: 'reduce_capacity',
    link: 'AdminEmployees',
  },
  {
    title: 'Division',
    icon: 'safety_divider',
    link: 'AdminDivisions',
  },
  {
    title: 'Department',
    icon: 'factory',
    link: 'AdminDepartments',
  },
  {
    title: 'Section',
    icon: 'view_module',
    link: 'AdminSections',
  },
  {
    title: 'Unit',
    icon: 'segment',
    link: 'AdminUnits',
  },
  {
    title: 'Designation',
    icon: 'work',
    link: 'AdminDesignations',
  },
];

</script>
