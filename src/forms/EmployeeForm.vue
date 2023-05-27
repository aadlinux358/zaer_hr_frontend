<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('employee') }}</div>
      <q-space />
      <q-btn icon="close"
             flat
             round
             dense
             v-close-popup />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <div class="q-ma-md">
        <q-form :autofocus="true"
                v-on:submit.prevent
                @reset="onReset"
                ref="formRef"
                class="text-center">
          <div class="text-h6 q-my-md"
               v-if="payload">
            Badge Number: {{ payload.badge_number }}
          </div>
          <div class="row q-gutter-sm">
            <q-input square
                     filled
                     dense
                     class="col"
                     v-model="form.first_name"
                     label="First name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type first name']" />
            <q-input square
                     filled
                     dense
                     class="col"
                     v-model="form.last_name"
                     label="Last name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type last name']" />

            <q-input square
                     filled
                     dense
                     class="col"
                     v-model="form.grandfather_name"
                     label="Grandfather name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type grandfather\'s name']" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.gender"
                      :options="gender"
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                      :rules="[val => val && val.length > 0 || 'Please select gender']"
                      label="Gender" />
          </div>
          <div class="row q-gutter-sm items-center">
            <div class="col">
              <q-input filled
                       dense
                       label="Birth date"
                       v-model="form.birth_date"
                       mask="####-##-##"
                       lazy-rules
                       :rules="[val => isValid(new Date(val)) || 'Please enter valid date']">
              </q-input>
            </div>
            <q-input square
                     dense
                     class="col"
                     filled
                     v-model="form.birth_place"
                     label="Birth place"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type birth place']" />

            <q-input square
                     filled
                     dense
                     class="col"
                     v-model="form.mother_first_name"
                     label="Mother first name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type mother\'s first name']" />
            <q-input square
                     filled
                     dense
                     class="col"
                     v-model="form.mother_last_name"
                     label="Mother last name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type mother\'s last name']" />
          </div>

          <div class="row q-gutter-sm items-center">
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.educational_level_uid"
                      :options="eduStore.educationalLevelList"
                      emit-value
                      map-options
                      option-label="level"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select educational level']"
                      label="Educational level" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.marital_status"
                      :options="maritalStatus"
                      :rules="[val => val && val.length > 0 || 'Please select marital status']"
                      label="Marital status" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.nationality_uid"
                      :options="nationalityStore.nationalityList"
                      emit-value
                      map-options
                      option-label="name"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select nationality']"
                      label="Nationality" />

            <q-input square
                     class="col"
                     filled
                     dense
                     v-model="form.national_id"
                     label="National ID"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type national id']" />
          </div>
          <div class="row q-gutter-sm items-center">

            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.national_service"
                      :options="nationalService"
                      :rules="[val => val && val.length > 0 || 'Please select national service status']"
                      label="National service" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.contract_type"
                      :options="contractType"
                      :rules="[val => val && val.length > 0 || 'Please select contract type']"
                      label="Contract type" />

            <q-input square
                     class="col"
                     filled
                     dense
                     v-model.number="form.current_salary"
                     type="number"
                     label="Salary"
                     lazy-rules
                     :rules="[val => val && val > 0 || 'Please enter salary']" />

            <div class="col">
              <q-input filled
                       label="Hire date"
                       dense
                       v-model="form.current_hire_date"
                       mask="####-##-##"
                       lazy-rules
                       :rules="[val => isValid(new Date(val)) || 'Please enter valid date']">
              </q-input>
            </div>
          </div>
          <div class="row q-gutter-sm items-center">
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.divisionUid"
                      :options="divisionStore.divisionList"
                      emit-value
                      map-options
                      option-label="name"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select division']"
                      label="Division" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.departmentUid"
                      :options="departments"
                      emit-value
                      map-options
                      option-label="name"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select department']"
                      label="Department" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.sectionUid"
                      :options="sections"
                      emit-value
                      map-options
                      option-label="name"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select section']"
                      label="Section" />
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.unit_uid"
                      :options="units"
                      emit-value
                      map-options
                      option-label="name"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select unit']"
                      label="Unit" />
          </div>
          <div class="row q-gutter-sm items-center">
            <q-select square
                      class="col"
                      filled
                      dense
                      v-model="form.designation_uid"
                      :options="designationStore.designationList"
                      emit-value
                      map-options
                      option-label="title"
                      option-value="uid"
                      :rules="[val => val && val.length > 0 || 'Please select designation']"
                      label="Designation" />
            <q-input square
                     class="col"
                     filled
                     dense
                     v-model="form.phone_number"
                     label="Phone number"
                     lazy-rules
                     :rules="[val => val && val.length > 0 && isDigit(val) || 'Please type valid (digits) phone number']" />
          </div>
          <FormActionButtons @on-create="onCreate"
                             @on-update="onUpdate"
                             @on-cancel="onCancel"
                             :no-delete="true"
                             :isUpdate="payload ? true : false" />
        </q-form>

      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {computed, watch} from 'vue';
import {useStores} from 'src/composables/stores';
import {useForms} from 'src/composables/forms';
import {useLookups} from 'src/composables/lookups';
import {isValid} from 'date-fns'
import {isDigit} from 'src/utils/strings'
import {EmployeeReadOne} from 'src/models/employee';
import FormActionButtons from 'src/components/FormActionButtons.vue';

interface EmployeeForm extends EmployeeReadOne {
  divisionUid: string;
  departmentUid: string;
  sectionUid: string;
}
const emits = defineEmits(['create', 'update', 'reset', 'cancel'])
const props = defineProps<{
  payload: EmployeeReadOne | null;
}>()

const {
  divisionStore,
  departmentStore,
  sectionStore,
  unitStore,
  designationStore,
  eduStore,
  nationalityStore,
} = useStores();

const {
  crudType,
  form,
  formRef,
  onCreate,
  onUpdate,
  onReset,
  onCancel
} = useForms<EmployeeForm>(props, emits)

const {
  gender,
  maritalStatus,
  contractType,
  nationalService} = useLookups();

const departments = computed(() => {
  return departmentStore.departmentList.filter(dep => {
    return dep.division_uid == form.value.divisionUid
  })
})

const sections = computed(() => {
  return sectionStore.sectionList.filter(sec => {
    return sec.department_uid == form.value.departmentUid
  })
})

const units = computed(() => {
  return unitStore.unitList.filter(uni => {
    return uni.section_uid == form.value.sectionUid;
  })
})
const divisionUid = computed({
  get() {return form.value.divisionUid},
  set(div: string) {form.value.divisionUid = div}
})
const departmentUid = computed({
  get() {return form.value.departmentUid},
  set(dep: string) {form.value.departmentUid = dep}
})
const sectionUid = computed({
  get() {return form.value.sectionUid},
  set(sec: string) {form.value.sectionUid = sec}
})

watch(divisionUid, (newValue, oldValue) => {
  if (oldValue) {
    departmentUid.value = '';
    sectionUid.value = '';
    form.value.unit_uid = '';
  }
})
watch(departmentUid, (newValue, oldValue) => {
  if (oldValue) {
    sectionUid.value = '';
    form.value.unit_uid = '';
  }
})
</script>
