<template>
  <q-layout view="lHh Lpr lFf">
    <MainAppHeader />
    <q-drawer v-model="uiStore.leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item-label header> ZaEr Human Resources </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
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
    caption: 'Basic statistics',
    icon: 'dashboard',
    link: '/admin/dashboard',
  },
  {
    title: 'Employee',
    caption: 'Employee information',
    icon: 'reduce_capacity',
    link: '/admin/employees',
  },
  {
    title: 'Department',
    caption: 'Company departments',
    icon: 'factory',
    link: '/admin/departments',
  },
  {
    title: 'Section',
    caption: 'Section under departments',
    icon: 'view_module',
    link: '/admin/sections',
  },
  {
    title: 'Sub Section',
    caption: 'Sub sections',
    icon: 'segment',
    link: '/admin/sub-sections',
  },
  {
    title: 'Current Job',
    caption: 'Job lists',
    icon: 'work',
    link: '/admin/current-jobs',
  },
];

</script>
