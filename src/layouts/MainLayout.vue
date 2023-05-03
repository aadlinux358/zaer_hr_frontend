<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          ZaEr P.L.C
        </q-toolbar-title>
        <div>
          <q-btn flat icon="settings">
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <q-toggle v-close-popup @update:model-value="toggleDark" color="red" checked-icon="check"
                    unchecked-icon="clear" label="Dark page" v-model="darkMode" />
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item-label header>
          ZaEr Human Resources
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useQuasar} from 'quasar';
import EssentialLink, {EssentialLinkProps} from 'components/EssentialLink.vue';

const $q = useQuasar();
const darkMode = ref(true);
const toggleDark = (val, evt) => {
  if (val) {
    $q.dark.set(true);
  } else {
    $q.dark.set(false);
  }
};
const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    caption: 'Basic statistics',
    icon: 'dashboard',
    link: '/dashboard',
  },
  {
    title: 'Employee',
    caption: 'Employee information',
    icon: 'reduce_capacity',
    link: '/employees',
  },
  {
    title: 'Department',
    caption: 'Company departments',
    icon: 'factory',
    link: '/departments'
  },
  {
    title: 'Section',
    caption: 'Section under departments',
    icon: 'view_module',
    link: '/sections'
  },
  {
    title: 'Sub Section',
    caption: 'Sub sections',
    icon: 'segment',
    link: '/sub-sections'
  },
  {
    title: 'Current Job',
    caption: 'Job lists',
    icon: 'work',
    link: '/current-jobs'
  },
];

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
