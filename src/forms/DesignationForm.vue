<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form :autofocus="true" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input square filled v-model="designationStore.state.form.title" label="Designation title" lazy-rules
        :rules="[val => val && val.length > 0 || 'Please type something']" />

      <div class="q-gutter-xs">
        <q-btn square label="Save" type="submit" color="primary" />
        <q-btn square label="Reset" type="reset" color="primary" />
        <q-btn square label="Cancel" type="button" @click="onCancel" color="primary" />
      </div>
    </q-form>

  </div>
</template>
<script setup lang="ts">
import {useDesignationStore} from 'src/stores/designation-store';

const emit = defineEmits(['save', 'reset', 'cancel'])

const designationStore = useDesignationStore();

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
