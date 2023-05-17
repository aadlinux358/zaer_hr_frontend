<template>
  <div class="q-pa-md"
       style="max-width: 400px">

    <q-form :autofocus="true"
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md">
      <q-select square
                outlined
                v-model="divisionUid"
                :options="divisionStore.divisionList"
                label="Division"
                emit-value
                map-options
                option-label="name"
                option-value="uid" />
      <q-select square
                outlined
                v-model="departmentUid"
                :options="filteredDepartments"
                label="Department"
                emit-value
                map-options
                option-label="name"
                option-value="uid" />
      <q-select square
                outlined
                v-model="unitStore.form.section_uid"
                :options="filteredSections"
                label="Section"
                emit-value
                map-options
                option-label="name"
                option-value="uid" />
      <q-input square
               filled
               v-model="unitStore.form.name"
               label="Unit name"
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
import {onMounted, ref, computed, watch} from 'vue';
import {useDivisionStore} from 'src/stores/division-store';
import {useDepartmentStore} from 'src/stores/department-store';
import {useSectionStore} from 'src/stores/section-store.ts';
import {useUnitStore} from 'src/stores/unit-store.ts';
import {CRUDType} from 'src/models/common.ts'
const emit = defineEmits(['save', 'reset', 'cancel'])

const divisionStore = useDivisionStore();
const departmentStore = useDepartmentStore();
const sectionStore = useSectionStore();
const unitStore = useUnitStore();
const divisionUid = ref('');
const departmentUid = ref('');

const filteredDepartments = computed(() => {
  return departmentStore.departmentList.filter(d => d.division_uid === divisionUid.value)
})
const filteredSections = computed(() => {
  return sectionStore.sectionList.filter(s => s.department_uid === departmentUid.value)
})
watch(divisionUid, (newValue, oldVAlue) => {
  if (oldVAlue) {
    unitStore.resetForm();
  }
})
watch(departmentUid, (newValu, oldValue) => {
  if (oldValue) {
    unitStore.resetForm();
  }
})

onMounted(async () => {
  if (unitStore.crudType === CRUDType.UPDATE) {
    const unit = unitStore.selectedUnit;
    const section = sectionStore.sections.get(unit.section_uid);
    const dep = departmentStore.departments.get(section.department_uid);
    divisionUid.value = dep.division_uid;
    departmentUid.value = dep.uid;
  }
})
function onSubmit() {
  emit('save');
}
function onReset() {
  divisionUid.value = '';
  departmentUid.value = '';
  emit('reset')
}
function onCancel() {
  divisionUid.value = '';
  departmentUid.value = '';
  emit('cancel')
}
</script>
