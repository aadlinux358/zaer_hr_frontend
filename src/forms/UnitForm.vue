<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('unit') }}</div>
      <q-space />
      <q-btn icon="close"
             flat
             round
             dense
             v-close-popup />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <div class="q-pa-md"
           style="max-width: 400px">
        <q-form :autofocus="true"
                v-on:submit.prevent
                @reset="onReset"
                ref="formRef"
                class="q-gutter-md">
          <q-select square
                    outlined
                    v-model="form.divisionUid"
                    :options="divisionStore.divisionList"
                    label="Division"
                    emit-value
                    map-options
                    option-label="name"
                    option-value="uid"
                    :rules="[val => val && val.length > 0 || 'Please select division']" />
          <q-select square
                    outlined
                    v-model="form.departmentUid"
                    :options="filteredDepartments"
                    label="Department"
                    emit-value
                    map-options
                    option-label="name"
                    option-value="uid"
                    :rules="[val => val && val.length > 0 || 'Please select department']" />
          <q-select square
                    outlined
                    v-model="form.section_uid"
                    :options="filteredSections"
                    label="Section"
                    emit-value
                    map-options
                    option-label="name"
                    option-value="uid"
                    :rules="[val => val && val.length > 0 || 'Please select section']" />
          <q-input square
                   filled
                   v-model="form.name"
                   label="Unit name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type unit name']" />
          <FormActionButtons @on-update="onUpdate"
                             @on-cancel="onCancel"
                             @on-create="onCreate"
                             :isUpdate="payload ? true : false" />
        </q-form>

      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {onMounted, computed, watch} from 'vue';
import {useDivisionStore} from 'src/stores/division-store';
import {useDepartmentStore} from 'src/stores/department-store';
import {useSectionStore} from 'src/stores/section-store';
import {useForms} from 'src/composables/forms';
import {UnitReadOne} from 'src/models/unit';
import FormActionButtons from 'src/components/FormActionButtons.vue';

interface UnitForm extends UnitReadOne {
  divisionUid: string;
  departmentUid: string;
}

const emits = defineEmits(['create', 'update', 'reset', 'cancel'])
const props = defineProps<{
  payload: UnitReadOne | null;
}>()
const divisionStore = useDivisionStore();
const departmentStore = useDepartmentStore();
const sectionStore = useSectionStore();
const {
  crudType,
  form,
  formRef,
  onCreate,
  onUpdate,
  onReset,
  onCancel
} = useForms<UnitForm>(props, emits)

const filteredDepartments = computed(() => {
  return departmentStore.departmentList.filter(d => d.division_uid === form.value.divisionUid)
})
const filteredSections = computed(() => {
  return sectionStore.sectionList.filter(s => s.department_uid === form.value.departmentUid)
})
const divisionUid = computed(() => form.value.divisionUid)
const departmentUid = computed(() => form.value.departmentUid)
watch(divisionUid, (newValue, oldVAlue) => {
  if (oldVAlue) {
    onReset()
  }
})
watch(departmentUid, (newValu, oldValue) => {
  if (oldValue) {
    onReset()
  }
})
onMounted(async () => {
  if (props.payload) {
    const unit = props.payload;
    const section = sectionStore.sections.get(unit.section_uid);
    const dep = departmentStore.departments.get(section.department_uid);
    form.value.divisionUid = dep.division_uid;
    form.value.departmentUid = dep.uid;
  }
})
</script>
