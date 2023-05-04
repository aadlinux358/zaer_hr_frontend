<template>
  <q-header>
    <q-toolbar>
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="uiStore.toggleLeftDrawer" />

      <q-toolbar-title> ZaEr P.L.C </q-toolbar-title>
      <div>
        <q-btn flat icon="settings">
          <q-menu square transition-show="flip-right" transition-hide="flip-left">
            <q-list dense style="min-width: 100px">
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary" name="person" />
                </q-item-section>
                <q-item-section>
                  {{ authStore.authState.user?.username }}
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
                        <q-toggle dense v-close-popup @update:model-value="uiStore.toggleDark" color="red"
                          checked-icon="dark_mode" unchecked-icon="light_mode" v-model="uiStore.darkMode" />
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

              <q-item clickable v-close-popup :to="{name: 'About'}">
                <q-item-section avatar>
                  <q-icon color="primary" name="info" />
                </q-item-section>
                <q-item-section>About</q-item-section>
              </q-item>
              <q-item clickable v-close-popup :to="{name: 'Help'}">
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
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useAuthStore} from 'src/stores/auth-store';
import {useUiStore} from 'src/stores/ui-store.ts'

const authStore = useAuthStore();
const uiStore = useUiStore();
</script>
