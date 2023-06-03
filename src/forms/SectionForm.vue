<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('section') }}</div>
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
                    v-model="form.unit_uid"
                    :options="filteredUnits"
                    label="Unit"
                    emit-value
                    map-options
                    option-label="name"
                    option-value="uid"
                    :rules="[val => val && val.length > 0 || 'Please select unit']" />
          <q-input square
                   filled
                   v-model="form.name"
                   label="Section name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type section name']" />
          <FormActionButtons @on-update="onUpdate"
                             @on-cancel="onCancel"
                             @on-delete="onDelete"
                             @on-create="onCreate"
                             :isUpdate="payload ? true : false" />
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {onMounted, computed, watch} from 'vue';
import {useForms} from 'src/composables/forms';
import {useStores} from 'src/composables/stores';
import {SectionCreate, SectionReadOne} from 'src/models/section';
import FormActionButtons from 'src/components/FormActionButtons.vue';
interface SectionForm extends SectionCreate {
  divisionUid: string
  departmentUid: string;
}
const emits = defineEmits(['create', 'update', 'delete', 'reset', 'cancel'])
const props = defineProps<{
  payload: SectionReadOne | null;
}>()

const {
  divisionStore,
  departmentStore,
  unitStore
} = useStores();
const {
  crudType,
  form,
  formRef,
  onCreate,
  onUpdate,
  onDelete,
  onReset,
  onCancel
} = useForms<SectionForm>(props, emits)
const filteredDepartments = computed(() => {
  return departmentStore.departmentList.filter(d => d.division_uid === form.value.divisionUid)
})
const filteredUnits = computed(() => {
  return unitStore.unitList.filter(s => s.department_uid === form.value.departmentUid)
})
const divisionUid = computed(() => form.value.divisionUid)
const departmentUid = computed(() => form.value.departmentUid)
watch(divisionUid, (newValue, oldVAlue) => {
  if (oldVAlue) {
    onReset();
  }
})
watch(departmentUid, (newValu, oldValue) => {
  if (oldValue) {
    onReset()
  }
})
onMounted(() => {
  if (props.payload) {
    const section = props.payload;
    const unit = unitStore.units.get(section.unit_uid);
    const dep = departmentStore.departments.get(unit.department_uid);
    form.value.divisionUid = dep.division_uid;
    form.value.departmentUid = dep.uid
  }
})
</script>
