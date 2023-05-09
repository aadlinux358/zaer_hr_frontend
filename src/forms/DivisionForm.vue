<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form :autofocus="true" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input filled v-model="divisionStore.state.form.name" label="Division name" lazy-rules
        :rules="[val => val && val.length > 0 || 'Please type something']" />

      <div class="q-gutter-xs">
        <q-btn label="Save" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" />
        <q-btn label="Cancel" type="button" @click="onCancel" color="primary" />
      </div>
    </q-form>

  </div>
</template>
<script setup lang="ts">
import {useDivisionStore} from 'src/stores/division-store';

const emit = defineEmits(['save', 'reset', 'cancel'])

const divisionStore = useDivisionStore();

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
