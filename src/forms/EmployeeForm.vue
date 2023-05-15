<template>
  <div class="q-pa-md full-width">

    <q-form :autofocus="true"
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md full-width">
      <div class="text-h5"
           v-if="empStore.state.crudType === CRUDType.UPDATE">
        Badge Number: {{ empStore.state.selectedEmployee?.badge_number }}
      </div>
      <div class="row q-gutter-md">
        <q-input square
                 filled
                 class="col-2"
                 v-model="empStore.state.form.first_name"
                 label="First name"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type first name']" />
        <q-input square
                 filled
                 class="col-2"
                 v-model="empStore.state.form.last_name"
                 label="Last name"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type last name']" />

        <q-input square
                 filled
                 class="col-2"
                 v-model="empStore.state.form.grandfather_name"
                 label="Grandfather name"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type grandfather\'s name']" />
        <div class="col-2">
          <div class="row items-center">
            <div class="text-h6 text-weight-light">
              Gender
            </div>
            <div class="row items-center justify-center"
                 style="width: 200px">
              <q-option-group :options="gender"
                              dense
                              type="radio"
                              v-model="empStore.state.form.gender"
                              class="row items-center justify-center" />
            </div>
          </div>
        </div>
      </div>
      <div class="row q-gutter-md items-center">
        <div class="col-2">
          <q-input filled
                   label="Birth date"
                   v-model="empStore.state.form.birth_date"
                   mask="date"
                   :rules="['date']">
            <template v-slot:append>
              <q-icon name="event"
                      class="cursor-pointer">
                <q-popup-proxy cover
                               transition-show="scale"
                               transition-hide="scale">
                  <q-date title="Birth date"
                          mask="YYYY-MM-DD"
                          subtitle="Plese enter"
                          v-model="empStore.state.form.birth_date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup
                             label="Close"
                             color="primary"
                             flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-input square
                 class="col-2"
                 filled
                 v-model="empStore.state.form.birth_place"
                 label="Birth place"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type birth place']" />

        <q-input square
                 filled
                 class="col-2"
                 v-model="empStore.state.form.mother_first_name"
                 label="Mother first name"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type mother\'s first name']" />
        <q-input square
                 filled
                 class="col-2"
                 v-model="empStore.state.form.mother_last_name"
                 label="Mother last name"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type mother\'s last name']" />
      </div>

      <div class="row q-gutter-md items-center">
        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.educational_level_uid"
                  :options="eduStore.educationalLevelList"
                  emit-value
                  map-options
                  option-label="level"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select educational level']"
                  label="Educational level" />
        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.marital_status"
                  :options="maritalStatus"
                  :rules="[val => val && val.length > 0 || 'Please select marital status']"
                  label="Marital status" />
        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.nationality_uid"
                  :options="nationalityStore.nationalityList"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select nationality']"
                  label="Nationality" />

        <q-input square
                 class="col-2"
                 filled
                 v-model="empStore.state.form.national_id"
                 label="National ID"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type national id']" />
      </div>
      <div class="row q-gutter-md items-center">

        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.national_service"
                  :options="nationalService"
                  :rules="[val => val && val.length > 0 || 'Please select national service status']"
                  label="National service" />
        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.contract_type"
                  :options="contractType"
                  :rules="[val => val && val.length > 0 || 'Please select contract type']"
                  label="Contract type" />

        <q-input square
                 class="col-2"
                 filled
                 v-model.number="empStore.state.form.current_salary"
                 type="number"
                 label="Salary"
                 lazy-rules
                 :rules="[val => val && val > 0 || 'Please enter salary']" />

        <div class="col-2">
          <q-input filled
                   label="Hire date"
                   v-model="empStore.state.form.current_hire_date"
                   mask="date"
                   :rules="['date']">
            <template v-slot:append>
              <q-icon name="event"
                      class="cursor-pointer">
                <q-popup-proxy cover
                               transition-show="scale"
                               transition-hide="scale">
                  <q-date title="Hire date"
                          mask="YYYY-MM-DD"
                          subtitle="Plese enter"
                          v-model="empStore.state.form.current_hire_date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup
                             label="Close"
                             color="primary"
                             flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-gutter-md items-center">
        <q-select square
                  class="col-2"
                  filled
                  v-model="divisionUid"
                  :options="divisionStore.divisionList"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select division']"
                  label="Division" />
        <q-select square
                  class="col-2"
                  filled
                  v-model="departmentUid"
                  :options="departmentStore.departmentList"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select department']"
                  label="Department" />
        <q-select square
                  class="col-2"
                  filled
                  v-model="sectionUid"
                  :options="sectionStore.sectionList"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select section']"
                  label="Section" />
        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.unit_uid"
                  :options="unitStore.unitList"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select unit']"
                  label="Unit" />
      </div>
      <div class="row q-gutter-md items-center">
        <q-select square
                  class="col-2"
                  filled
                  v-model="empStore.state.form.designation_uid"
                  :options="designationStore.designationList"
                  emit-value
                  map-options
                  option-label="title"
                  option-value="uid"
                  :rules="[val => val && val.length > 0 || 'Please select designation']"
                  label="Designation" />
        <q-input square
                 class="col-2"
                 filled
                 v-model="empStore.state.form.phone_number"
                 label="Phone number"
                 lazy-rules
                 :rules="[val => val && val.length > 0 || 'Please type phone number']" />
      </div>

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
import {CRUDType} from 'src/models/common';
import {useStores} from 'src/composables/stores';
import {ref} from 'vue';

const emit = defineEmits(['save', 'reset', 'cancel'])

const {
  divisionStore,
  departmentStore,
  sectionStore,
  unitStore,
  designationStore,
  eduStore,
  nationalityStore,
  empStore
} = useStores();

const divisionUid = ref('')
const departmentUid = ref('')
const sectionUid = ref('')


function onSubmit() {
  emit('save');
}
function onReset() {
  emit('reset')
}
function onCancel() {
  emit('cancel')
}
const gender = [
  {
    label: 'Male',
    value: 'm',
    color: 'blue',
    size: 'lg'
  },
  {
    label: 'Female',
    value: 'f',
    color: 'pink',
    size: 'lg'
  },
]

const maritalStatus = [
  'single', 'married', 'divorced', 'widowed'
]
const nationalService = [
  'released', 'exempted', 'serving'
]
const contractType = [
  'full time', 'part time'
]
</script>
