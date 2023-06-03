<template>
  <q-layout view="lHh Lpr lFf">
    <MainAppHeader />
    <q-drawer v-model="uiStore.leftDrawerOpen"
              show-if-above
              :width="250">
      <q-list>
        <q-item-label header
                      class="text-capitalize"> {{ $t('zaerhr') }} </q-item-label>

        <EssentialLink v-for="link in essentialLinks"
                       :key="link.title"
                       v-bind="link" />
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
import {useUiStore} from 'src/stores/ui-store'

const uiStore = useUiStore();

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'dashboard',
    icon: 'dashboard',
    link: 'AdminDashboard',
  },
  {
    title: 'employee',
    icon: 'reduce_capacity',
    link: 'AdminEmployees',
  },
  {
    title: 'division',
    icon: 'safety_divider',
    link: 'AdminDivisions',
  },
  {
    title: 'department',
    icon: 'factory',
    link: 'AdminDepartments',
  },
  {
    title: 'unit',
    icon: 'segment',
    link: 'AdminUnits',
  },
  {
    title: 'section',
    icon: 'view_module',
    link: 'AdminSections',
  },
  {
    title: 'designation',
    icon: 'work',
    link: 'AdminDesignations',
  },
  {
    title: 'country',
    icon: 'fas fa-earth-africa',
    link: 'AdminCountries',
  },
  {
    title: 'nationality',
    icon: 'flag',
    link: 'AdminNationalities'
  },
  {
    title: 'educational_level',
    icon: 'school',
    link: 'AdminEducationalLevels'
  }
];

</script>
