<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form :autofocus="true" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-select square outlined v-model="departmentStore.state.form.division_uid" :options="divisionStore.divisionList"
        label="Division" emit-value map-options option-label="name" option-value="uid" />
      <q-input filled v-model="departmentStore.state.form.name" label="Department name" lazy-rules
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
import {onMounted} from 'vue';
import {useDivisionStore} from 'src/stores/division-store';
import {useDepartmentStore} from 'src/stores/department-store';

const emit = defineEmits(['save', 'reset', 'cancel'])

const divisionStore = useDivisionStore();
const departmentStore = useDepartmentStore();

onMounted(() => {
  if (divisionStore.state.divisions.size === 0) {
    divisionStore.getManyDBDivisions()
  }
})
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
