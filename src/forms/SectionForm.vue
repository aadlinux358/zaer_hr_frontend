<template>
  <div class="q-pa-md" style="max-width: 400px">

    <q-form :autofocus="true" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-select square outlined v-model="divisionUid" :options="divisionStore.divisionList" label="Division" emit-value
        map-options option-label="name" option-value="uid" />
      <q-select square outlined v-model="sectionStore.state.form.department_uid" :options="filteredDepartments"
        label="Department" emit-value map-options option-label="name" option-value="uid" />
      <q-input square filled v-model="sectionStore.state.form.name" label="Section name" lazy-rules
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
import {onMounted, ref, computed, watch} from 'vue';
import {useDivisionStore} from 'src/stores/division-store';
import {useDepartmentStore} from 'src/stores/department-store';
import {useSectionStore} from 'src/stores/section-store.ts'
import {CRUDType} from 'src/models/common.ts'
const emit = defineEmits(['save', 'reset', 'cancel'])

const divisionStore = useDivisionStore();
const departmentStore = useDepartmentStore();
const sectionStore = useSectionStore();

const divisionUid = ref('')

const filteredDepartments = computed(() => {
  return departmentStore.departmentList.filter(d => d.division_uid === divisionUid.value)
})
watch(divisionUid, (newValue, oldVAlue) => {
  if (oldVAlue) {
    sectionStore.resetForm();
  }
})
onMounted(() => {
  if (divisionStore.state.divisions.size === 0) {
    divisionStore.getManyDBDivisions()
  }
  if (departmentStore.state.departments.size === 0) {
    departmentStore.getManyDBDepartments();
  }
  if (sectionStore.state.crudType === CRUDType.UPDATE) {
    const section = sectionStore.state.selectedSection;
    const dep = departmentStore.state.departments.get(section.department_uid);
    divisionUid.value = dep.division_uid;
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
