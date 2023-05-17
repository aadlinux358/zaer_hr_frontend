<template>
  <div class="q-pa-md"
       style="max-width: 400px">

    <q-form :autofocus="true"
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md">
      <q-input square
               filled
               v-model="nationalityStore.form.name"
               label="Nationality name"
               lazy-rules
               :rules="[val => val && val.length > 0 || 'Please type something']" />

      <div class="q-gutter-xs">
        <q-btn no-caps
               class="text-capitalize"
               square
               :label="$t('save')"
               type="submit"
               color="primary" />
        <q-btn no-caps
               class="text-capitalize"
               square
               :label="$t('reset')"
               type="reset"
               color="primary" />
        <q-btn no-caps
               class="text-capitalize"
               square
               :label="$t('cancel')"
               type="button"
               @click="onCancel"
               color="primary" />
      </div>
    </q-form>

  </div>
</template>
<script setup lang="ts">
import {useNationalityStore} from 'src/stores/nationality-store';

const emit = defineEmits(['save', 'reset', 'cancel'])

const nationalityStore = useNationalityStore();

function onSubmit() {
  emit('save');
}
function onReset() {
  emit('reset')
}
function onCancel() {
  emit('cancel')
}
</script>
