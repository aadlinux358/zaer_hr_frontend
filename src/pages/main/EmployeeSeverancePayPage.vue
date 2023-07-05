<script setup lang="ts">
import {ref} from 'vue';
import {format} from 'quasar';
import {useStores} from 'src/composables/stores'
import VuePdfEmbed from 'vue-pdf-embed';

const {capitalize} = format;
const badge_number = ref(0)
const {empStore} = useStores();
const pdfEmbed = ref();
const pdfFile = ref();

function printPdf() {
  pdfEmbed.value.print();
}
async function getPdf() {
  const data = await empStore.getSeverancePay(badge_number.value)
  pdfFile.value = Uint8Array.from(atob(data), c => c.charCodeAt(0))
}
</script>
<template>
  <q-page padding>
    <h4 class="text-center">{{ capitalize($t('employee_severance_pay')) }}</h4>
    <div class="row items-center justify-center q-my-md">
      <q-input filled
               square
               class="text-capitalize"
               label="Enter badge number"
               type="number"
               dense
               debounce="300"
               color="primary"
               v-model="badge_number" />
      <q-btn @click="getPdf"
             label="Go"
             color="primary"
             square
             no-caps
             icon="search" />
    </div>
    <q-btn @click="printPdf"
           label="Print"
           class="q-my-sm"
           v-if="pdfFile"
           color="primary"
           no-caps
           icon="print" />
    <vue-pdf-embed v-if="pdfFile"
                   :source="pdfFile"
                   ref="pdfEmbed"
                   :page="1" />
  </q-page>
</template>
