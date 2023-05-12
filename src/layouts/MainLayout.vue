<template>
  <q-layout view="lHh Lpr lFf">
    <MainAppHeader />
    <q-drawer bordered v-model="uiStore.leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item-label header class="text-capitalize"> {{ $t('zaerhr') }} </q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
        <q-separator />
        <q-item-label header class="text-capitalize">{{ $t('appinfo') }}</q-item-label>
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
    title: 'dashboard',
    icon: 'dashboard',
    link: 'Dashboard',
  },
  {
    title: 'employee',
    icon: 'reduce_capacity',
    link: 'Employees',
  },
  {
    title: 'division',
    icon: 'safety_divider',
    link: 'Divisions',
  },
  {
    title: 'department',
    icon: 'factory',
    link: 'Departments',
  },
  {
    title: 'section',
    icon: 'view_module',
    link: 'Sections',
  },
  {
    title: 'unit',
    icon: 'segment',
    link: 'Units',
  },
  {
    title: 'designation',
    icon: 'work',
    link: 'Designations',
  },
];
const infoLinks: EssentialLinkProps[] = [

  {
    title: 'about',
    icon: 'info',
    link: 'About',
  },
  {
    title: 'help',
    icon: 'help',
    link: 'Help',
  },
]

</script>
