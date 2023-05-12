<template>
  <q-layout view="lHh Lpr lFf">
    <MainAppHeader />
    <q-drawer bordered v-model="uiStore.leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item-label header> ZaEr Human Resources </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-separator />
        <q-item-label header>App Information </q-item-label>
        <EssentialLink v-for="link in infoLinks" :key="link.title" v-bind="link" />
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
    icon: 'dashboard',
    link: 'Dashboard',
  },
  {
    title: 'Employee',
    icon: 'reduce_capacity',
    link: 'Employees',
  },
  {
    title: 'Division',
    icon: 'safety_divider',
    link: 'Divisions',
  },
  {
    title: 'Department',
    icon: 'factory',
    link: 'Departments',
  },
  {
    title: 'Section',
    icon: 'view_module',
    link: 'Sections',
  },
  {
    title: 'Unit',
    icon: 'segment',
    link: 'Units',
  },
  {
    title: 'Designation',
    icon: 'work',
    link: 'Designations',
  },
];
const infoLinks: EssentialLinkProps[] = [

  {
    title: 'About',
    icon: 'info',
    link: 'About',
  },
  {
    title: 'Help',
    icon: 'help',
    link: 'Help',
  },
]

</script>
