<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> ZaEr P.L.C </q-toolbar-title>
        <div>
          <q-btn flat icon="settings">
            <q-menu
              square
              transition-show="flip-right"
              transition-hide="flip-left"
            >
              <q-list dense style="min-width: 100px">
                <q-item>
                  <q-item-section avatar>
                    <q-icon color="primary" name="person" />
                  </q-item-section>
                  <q-item-section>
                    {{ authStore.authState.user.username }}
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable>
                  <q-item-section>Preferences</q-item-section>
                  <q-item-section side>
                    <q-icon name="keyboard_arrow_right" />
                  </q-item-section>

                  <q-menu square anchor="top end" self="top start">
                    <q-list dense style="min-width: 100px">
                      <q-item dense clickable>
                        <q-item-section>
                          <q-toggle
                            dense
                            v-close-popup
                            @update:model-value="toggleDark"
                            color="red"
                            checked-icon="dark_mode"
                            unchecked-icon="light_mode"
                            v-model="darkMode"
                          />
                        </q-item-section>
                        <q-item-section> Theme </q-item-section>
                      </q-item>
                      <q-item dense clickable>
                        <q-item-section avatar>
                          <q-icon color="primary" name="language" />
                        </q-item-section>
                        <q-item-section> Language </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-item>

                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="primary" name="info" />
                  </q-item-section>
                  <q-item-section>About</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="primary" name="help" />
                  </q-item-section>
                  <q-item-section>Help</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="authStore.logout">
                  <q-item-section avatar>
                    <q-icon color="primary" name="logout" />
                  </q-item-section>
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250">
      <q-list>
        <q-item-label header> ZaEr Human Resources </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import EssentialLink, {
  EssentialLinkProps,
} from 'components/EssentialLink.vue';

import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();
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
    link: '/departments',
  },
  {
    title: 'Section',
    caption: 'Section under departments',
    icon: 'view_module',
    link: '/sections',
  },
  {
    title: 'Sub Section',
    caption: 'Sub sections',
    icon: 'segment',
    link: '/sub-sections',
  },
  {
    title: 'Current Job',
    caption: 'Job lists',
    icon: 'work',
    link: '/current-jobs',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
