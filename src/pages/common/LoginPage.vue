<template>
  <div class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 q-my-md">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md" :autofocus="true" @submit="onSubmit">
              <q-input square v-model="authStore.credential.username" type="text" label="Username" lazy-rules
                :rules="[val => val && val.length > 0 || 'Please enter username']" />
              <q-input square v-model="authStore.credential.password" :type="isPwd ? 'password' : 'text'" label="Password"
                lazy-rules :rules="[val => val && val.length > 0 || 'Please enter password']">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <div>
                <q-btn unelevated square color="primary" size="lg" class="full-width" label="Login" type="submit" />
              </div>
            </q-form>
          </q-card-section>
          <!--
          <q-card-actions class="q-px-md">
            <q-btn unelevated square color="primary" size="lg" class="full-width" label="Login"
              @click="authStore.login" />
          </q-card-actions>
          -->
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Not reigistered? Created an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from 'src/stores/auth-store';
import {ref} from 'vue';

const authStore = useAuthStore();
const isPwd = ref(true);

function onSubmit() {
  authStore.login();
}
</script>
