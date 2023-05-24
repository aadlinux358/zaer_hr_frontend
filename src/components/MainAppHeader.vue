<template>
  <q-header>
    <q-toolbar class="bg-dark">
      <q-btn flat
             dense
             round
             icon="menu"
             aria-label="Menu"
             @click="uiStore.toggleLeftDrawer" />

      <q-toolbar-title> ZaEr P.L.C </q-toolbar-title>
      <!--
      <q-toggle dense v-close-popup @update:model-value="uiStore.toggleDark" color="red" checked-icon="dark_mode"
        unchecked-icon="light_mode" v-model="uiStore.darkMode" />
      -->
      <q-btn @click="uiStore.toggleDark"
             :icon="uiStore.darkMode ? 'light_mode' : 'dark_mode'"
             flat />

      <q-btn round
             dense
             flat
             color="white"
             icon="notifications"
             class="q-mx-sm">
        <q-badge color="green-9"
                 text-color="white"
                 floating>
          5
        </q-badge>
        <q-menu>
          <q-list style="min-width: 100px">
            <messages-component></messages-component>
            <q-card class="text-center no-shadow no-border">
              <q-btn label="View All"
                     style="max-width: 120px !important;"
                     flat
                     dense
                     class="text-indigo-8"></q-btn>
            </q-card>
          </q-list>
        </q-menu>
      </q-btn>

      <div>
        <q-btn flat
               icon-right="arrow_drop_down"
               icon="language"
               :label="uiStore.selectedLanguage">
          <q-menu square
                  transition-show="flip-right"
                  transition-hide="flip-left">
            <q-list dense
                    style="min-width: 100px">
              <q-item clickable
                      v-close-popup
                      @click="uiStore.setLanguage(AppLanguage.ENG)">
                <q-item-section>
                  English
                </q-item-section>
              </q-item>
              <q-item clickable
                      v-close-popup
                      @click="uiStore.setLanguage(AppLanguage.ITA)">
                <q-item-section>
                  Italian
                </q-item-section>
              </q-item>
              <q-item clickable
                      v-close-popup
                      @click="uiStore.setLanguage(AppLanguage.TIG)">
                <q-item-section>
                  Tigrigna
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div>
        <q-btn flat
               round>
          <q-avatar color="primary"
                    text-color="white">
            {{ authStore.user?.first_name[0] }}
          </q-avatar>
          <q-menu square
                  transition-show="flip-right"
                  transition-hide="flip-left">
            <q-list dense
                    style="min-width: 100px">
              <q-item>
                <q-item-section avatar>
                  <q-icon color="primary"
                          name="person" />
                </q-item-section>
                <q-item-section>
                  <div>
                    <div>
                      {{ authStore.user?.username }}
                    </div>
                    <div class="text-weight-light">
                      {{ authStore.user?.email }}
                    </div>
                  </div>
                </q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable
                      v-close-popup
                      :to="{name: 'Profile'}">
                <q-item-section avatar>
                  <q-icon color="primary"
                          name="account_circle" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
              <q-item clickable
                      v-close-popup
                      :to="{name: 'Settings'}">
                <q-item-section avatar>
                  <q-icon color="primary"
                          name="settings" />
                </q-item-section>
                <q-item-section>Settings</q-item-section>
              </q-item>
              <q-item clickable
                      v-close-popup
                      :to="{name: 'Message'}">
                <q-item-section avatar>
                  <q-icon color="primary"
                          name="message" />
                </q-item-section>
                <q-item-section>Messages</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable
                      v-close-popup
                      @click="authStore.logout">
                <q-item-section avatar>
                  <q-icon color="primary"
                          name="logout" />
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
import {useAuthStore} from 'src/stores/auth-store';
import {useUiStore} from 'src/stores/ui-store.ts'
import {AppLanguage} from 'src/models/common.ts'
import MessagesComponent from 'src/components/MessagesComponent.vue';

const authStore = useAuthStore();
const uiStore = useUiStore();
</script>
