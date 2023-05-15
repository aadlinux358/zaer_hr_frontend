<template>
  <Particles id="tsparticles"
             :particlesInit="particlesInit"
             :options="{
                 background: {
                   color: {
                     value: '#a60914'
                   }
                 },
                 fpsLimit: 100,
                 interactivity: {
                   events: {
                     onClick: {
                       enable: true,
                       mode: 'push'
                     },
                     onHover: {
                       enable: true,
                       mode: 'repulse'
                     },
                     resize: true
                   },
                   modes: {
                     bubble: {
                       distance: 200,
                       duration: 2,
                       opacity: 0.8,
                       size: 10
                     },
                     push: {
                       quantity: 2
                     },
                     repulse: {
                       distance: 100,
                       duration: 0.4
                     }
                   }
                 },
                 particles: {
                   color: {
                     value: '#ffffff'
                   },
                   links: {
                     color: '#ffffff',
                     distance: 200,
                     enable: true,
                     opacity: 0.5,
                     width: 1
                   },
                   collisions: {
                     enable: true
                   },
                   move: {
                     direction: 'none',
                     enable: true,
                     outMode: 'bounce',
                     random: false,
                     speed: 1,
                     straight: false
                   },
                   number: {
                     density: {
                       enable: true,
                       area: 800
                     },
                     value: 80
                   },
                   opacity: {
                     value: 0.5
                   },
                   shape: {
                     type: 'circle'
                   },
                   size: {
                     random: true,
                     value: 5
                   }
                 },
                 detectRetina: true
               }" />


  <div class="window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <q-card square
                class="q-pa-lg">
          <q-card-section>
            <div class="row">
              <h5 class="text-h5 q-my-md">ZaEr Login</h5>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md"
                    :autofocus="true"
                    @submit="onSubmit">
              <q-input square
                       v-model="authStore.username"
                       type="text"
                       label="Username"
                       lazy-rules
                       :rules="[val => val && val.length > 0 || authStore.isAuthenticated || 'Please enter username']" />
              <q-input square
                       v-model="authStore.password"
                       :type="isPwd ? 'password' : 'text'"
                       label="Password"
                       lazy-rules
                       :rules="[val => val && val.length > 0 || authStore.isAuthenticated || 'Please enter password']">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <div>
                <q-btn no-caps
                       unelevated
                       square
                       color="primary"
                       size="lg"
                       class="full-width"
                       label="Login"
                       type="submit" />
              </div>
            </q-form>
          </q-card-section>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Not reigistered? Created an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useAuthStore} from 'src/stores/auth-store';
import {loadFull} from 'tsparticles'

const authStore = useAuthStore();
const isPwd = ref(true);

const particlesInit = async engine => {
  await loadFull(engine);
};


function onSubmit() {
  authStore.login();
}
</script>
