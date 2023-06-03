<template>
  <q-layout view="lHh Lpr lFf">
    <MainAppHeader />
    <q-drawer v-model="uiStore.leftDrawerOpen"
              show-if-above
              :width="230">
      <q-list>
        <q-item-label header
                      class="text-capitalize"> {{ $t('zaerhr') }} </q-item-label>
        <EssentialLink v-for="link in essentialLinks"
                       :key="link.title"
                       v-bind="link" />
        <q-expansion-item icon="reduce_capacity"
                          :label="$t('employee')">
          <q-list dens
                  class="q-pl-md">
            <EssentialLink v-for="link in empLinks"
                           :key="link.title"
                           v-bind="link"
                           :small-icon="true" />
          </q-list>
        </q-expansion-item>
        <q-expansion-item icon="fas fa-sitemap fa-xs"
                          :label="$t('organization')">
          <q-list dense
                  class="q-pl-md">
            <EssentialLink v-for="link in orgLinks"
                           :key="link.title"
                           v-bind="link"
                           :small-icon="true" />
          </q-list>
        </q-expansion-item>
        <q-separator class="q-my-md" />
        <q-item-label header
                      class="text-capitalize">{{ $t('appinfo') }}</q-item-label>
        <EssentialLink v-for="link in infoLinks"
                       :key="link.title"
                       v-bind="link" />
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
];
const empLinks: EssentialLinkProps[] = [
  {
    title: 'active_list',
    icon: 'group_add',
    link: 'ActiveEmployees',
  },
  {
    title: 'inactive_list',
    icon: 'group_remove',
    link: 'InactiveEmployees',
  },
]
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

const orgLinks: EssentialLinkProps[] = [
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
    title: 'unit',
    icon: 'segment',
    link: 'Units',
  },
  {
    title: 'section',
    icon: 'view_module',
    link: 'Sections',
  },
  {
    title: 'designation',
    icon: 'work',
    link: 'Designations',
  },
]

</script>
