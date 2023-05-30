<template>
  <q-page padding>
    <div class="hr-grid-container">
      <!-- grid container start -->
      <EmployeeDetailActions class="hr-grid-item-1"
                             @edit="onEditEmployee"
                             @terminate="terminateLocal"
                             @deactivate="deactivateLocal"
                             @activate="activateLocal"
                             :is-active="emp.is_active!"
                             :is-terminated="emp.is_terminated" />
      <div class="hr-grid-item-2">
        <div class="column">
          <span class="text-h5 text-capitalize">{{ $t('employee_detail') }}</span>
          <div class="row q-my-sm">
            <div class="text-capitalize">{{ $t('active_status') }}:</div>
            <div v-if="emp.is_active"
                 class="q-mx-sm emp-active text-uppercase">{{ $t('active') }}</div>
            <div v-if="!emp.is_active"
                 class="q-mx-md emp-inactive text-uppercase">{{ $t('inactive') }}</div>
          </div>
          <div class="row q-my-sm"
               v-if="!emp.is_active">
            <div class="text-capitalize">{{ $t('terminated_status') }}:</div>
            <div v-if="emp.is_terminated"
                 class="q-mx-sm emp-active text-uppercase">{{ $t('terminated') }}</div>
            <div v-if="!emp.is_terminated"
                 class="q-mx-md emp-inactive text-uppercase">{{ $t('not_terminated') }}</div>
          </div>
          <div class="emp-inactive text-capitalize"
               v-if="!emp.is_active && !emp.is_terminated">
            <span class="text-uppercase">[{{ $t('warning') }}]:</span><span class="q-mx-xs text-uppercase">{{
              $t('inactive_not_terminated_warning') }}</span>
          </div>
        </div>
      </div>
      <div>
        <EmployeeRelatedList :columns="addressColumns"
                             :rows="addressRows"
                             title="address"
                             entity="address"
                             :emp-uid="emp.uid!"
                             :loading="addressStore.loading" />
      </div>
      <div class="column">
        <div class="text-capitalize"
             :class="$q.dark.isActive ? 'hr-header-dark' : 'hr-header-light'">
          {{ $t('personal_information') }}
        </div>
        <div class="row">
          <div class="column col q-pl-sm">
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Badge Number:</span><span class="text-uppercase">{{
                emp.badge_number
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">First Name:</span><span class="text-uppercase">{{ emp.first_name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Last Name:</span><span class="text-uppercase">{{ emp.last_name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Grandfather Name:</span><span class="text-uppercase">{{
                emp.grandfather_name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Gender:</span><span class="text-uppercase">{{
                emp.gender
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Birth Date:</span><span class="text-uppercase">{{
                emp.birth_date
              }}</span>
            </div>
          </div>
          <div class="column col">
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Birth Place:</span><span class="text-uppercase">{{
                emp.birth_place
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Educational Level:</span><span class="text-capitalize">{{
                empLookups.educationalLevel.level
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Marital Status:</span><span class="text-uppercase">{{
                emp.marital_status
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Nationality:</span><span class="text-uppercase">{{
                empLookups.nationality.name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">National ID:</span><span class="text-uppercase">{{
                emp.national_id
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Phone Number:</span><span class="text-uppercase">{{
                emp.phone_number
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <EmployeeRelatedList :columns="childColumns"
                             :rows="childRows"
                             entity="child"
                             :emp-uid="emp.uid!"
                             title="children"
                             :loading="childStore.loading" />
      </div>
      <div class="column">
        <div class="text-capitalize"
             :class="$q.dark.isActive ? 'hr-header-dark' : 'hr-header-light'">
          {{ $t('company_related') }}
        </div>
        <div class="row">
          <div class="column col q-pl-sm">
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Division:</span><span class="text-uppercase">{{
                empLookups.division.name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Department:</span><span class="text-uppercase">{{
                empLookups.department.name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Section:</span><span class="text-uppercase">{{
                empLookups.section.name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Unit:</span><span class="text-uppercase">{{
                empLookups.unit.name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Designation:</span><span class="text-uppercase">{{
                empLookups.designation.title
              }}</span>
            </div>
          </div>
          <div class="column col">
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">National Service:</span><span class="text-uppercase">{{
                emp.national_service
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Contract Type:</span><span class="text-uppercase">{{
                emp.contract_type
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Hire Date:</span><span class="text-uppercase">{{
                emp.current_hire_date
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Current Salary:</span><span class="text-uppercase">{{
                emp.current_salary
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <EmployeeRelatedList :columns="contactPersonColumns"
                             :rows="contactRows"
                             entity="contact"
                             :emp-uid="emp.uid!"
                             title="contact_person"
                             :loading="contactStore.loading" />
      </div>
      <!-- grid container end -->
    </div>
    <!--
    <div class="overflow-auto">
    -->
    <!--
    <div class="row no-wrap q-col-gutter-sm">
      <div class="column col">
        <div class="column">
          <EmployeeDetailActions @edit="onEditEmployee"
                                 @terminate="terminateLocal"
                                 @deactivate="deactivateLocal"
                                 @activate="activateLocal"
                                 :is-active="emp.is_active!"
                                 :is-terminated="emp.is_terminated" />
          <div class="column">
            <span class="text-h5">Employee Detail</span>
            <div class="row q-my-sm">
              <div>Active Status:</div>
              <div v-if="emp.is_active"
                   class="q-mx-sm emp-active">ACTIVE</div>
              <div v-if="!emp.is_active"
                   class="q-mx-md emp-inactive">INACTIVE</div>
            </div>
            <div class="row q-my-sm"
                 v-if="!emp.is_active">
              <div>Termination Status:</div>
              <div v-if="emp.is_terminated"
                   class="q-mx-sm emp-active">TERMINATED</div>
              <div v-if="!emp.is_terminated"
                   class="q-mx-md emp-inactive">NOT TERMINATED</div>
            </div>
            <div class="emp-inactive"
                 v-if="!emp.is_active && !emp.is_terminated">
              [WARNING]: Employee is inactive but not terminated.
            </div>
          </div>
          <div class="row">
            <div class="column col q-pa-sm">
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Badge Number:</span><span class="text-uppercase">{{
                  emp.badge_number
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">First Name:</span><span class="text-uppercase">{{ emp.first_name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Last Name:</span><span class="text-uppercase">{{ emp.last_name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Grandfather Name:</span><span class="text-uppercase">{{
                  emp.grandfather_name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Gender:</span><span class="text-uppercase">{{
                  emp.gender
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Birth Date:</span><span class="text-uppercase">{{
                  emp.birth_date
                }}</span>
              </div>
              <q-separator class="q-my-md" />
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Division:</span><span class="text-uppercase">{{
                  empLookups.division.name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Department:</span><span class="text-uppercase">{{
                  empLookups.department.name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Section:</span><span class="text-uppercase">{{
                  empLookups.section.name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Unit:</span><span class="text-uppercase">{{
                  empLookups.unit.name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Designation:</span><span class="text-uppercase">{{
                  empLookups.designation.title
                }}</span>
              </div>
            </div>
            <div class="column q-pa-sm col q-mx-sm">
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Birth Place:</span><span class="text-uppercase">{{
                  emp.birth_place
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Educational Level:</span><span class="text-capitalize">{{
                  empLookups.educationalLevel.level
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Marital Status:</span><span class="text-uppercase">{{
                  emp.marital_status
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Nationality:</span><span class="text-uppercase">{{
                  empLookups.nationality.name
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">National ID:</span><span class="text-uppercase">{{
                  emp.national_id
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Phone Number:</span><span class="text-uppercase">{{
                  emp.phone_number
                }}</span>
              </div>
              <q-separator class="q-my-md" />
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">National Service:</span><span class="text-uppercase">{{
                  emp.national_service
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Contract Type:</span><span class="text-uppercase">{{
                  emp.contract_type
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Hire Date:</span><span class="text-uppercase">{{
                  emp.current_hire_date
                }}</span>
              </div>
              <div class="q-ma-xs">
                <span class="text-caption q-mr-sm">Current Salary:</span><span class="text-uppercase">{{
                  emp.current_salary
                }}</span>
              </div>
            </div>
          </div>
          <q-separator class="q-my-sm" />
        </div>
      </div>
      <div class="column col q-gutter-lg">
        <div>
          <EmployeeRelatedList :columns="addressColumns"
                               :rows="addressRows"
                               title="address"
                               entity="address"
                               :emp-uid="emp.uid!"
                               :loading="addressStore.loading" />
        </div>
        <div>
          <EmployeeRelatedList :columns="childColumns"
                               :rows="childRows"
                               entity="child"
                               :emp-uid="emp.uid!"
                               title="children"
                               :loading="childStore.loading" />
        </div>
        <div>
          <EmployeeRelatedList :columns="contactPersonColumns"
                               :rows="contactRows"
                               entity="contact"
                               :emp-uid="emp.uid!"
                               title="contact_person"
                               :loading="contactStore.loading" />
        </div>
      </div>
    </div>
    -->
    <q-dialog ref="dialogRef"
              @hide="onHide"
              full-width
              full-height
              persistent>
      <EmployeeForm @create="create"
                    @update="update"
                    @cancel="onCancel"
                    :payload="selectedEntity" />
    </q-dialog>
    <!--
    </div>
      -->
  </q-page>
</template>
<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, Ref} from 'vue';
import {useRoute} from 'vue-router';
import {useDialogPluginComponent} from 'quasar'
import {useStores} from 'src/composables/stores'
import {useCrud} from 'src/composables/crud';
import {useTableColumns} from 'src/composables/table-columns'
import {EmployeeCreate as C, EmployeeReadOne as R, EmployeeObj} from 'src/models/employee';
import EmployeeDetailActions from 'src/components/EmployeeDetailActions.vue';
import EmployeeForm from 'src/forms/EmployeeForm.vue'
import EmployeeRelatedList from 'src/components/EmployeeRelatedList.vue'
import Router from 'src/router';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})
const empLookups = ref({
  division: {},
  department: {},
  section: {},
  unit: {},
  designation: {},
  educationalLevel: {},
  nationality: {}
})
const emp: Ref<R> = ref(EmployeeObj)
const {hydrateStore, empStore, childStore, contactStore, addressStore, eduStore, nationalityStore} = useStores();
const route = useRoute();
const {
  dialogRef,
  selectedEntity,
  create,
  edit,
  update,
  deactivate,
  terminate,
  activate,
  onCancel,
  onHide,
} = useCrud<C, R>(empStore)

const {
  childColumns,
  addressColumns,
  contactPersonColumns,
  getDivision,
  getDepartment,
  getSection,
  getUnit,
  getDesignation} = useTableColumns();

onMounted(async () => {
  if (empStore.employees.size === 0) {
    await hydrateStore()
  }
  const empUid: string = route.params.uid as string;
  const result = empStore.employees.get(empUid)
  if (!result) {
    Router.push({name: 'Employees'})
  } else {
    emp.value = result;
    empLookups.value.division = getDivision(emp.value.unit_uid)
    empLookups.value.department = getDepartment(emp.value.unit_uid)
    empLookups.value.section = getSection(emp.value.unit_uid)
    empLookups.value.unit = getUnit(emp.value.unit_uid)
    empLookups.value.designation = getDesignation(emp.value.designation_uid)
    empLookups.value.nationality = nationalityStore.nationalities.get(emp.value?.nationality_uid)
    empLookups.value.educationalLevel = eduStore.educationalLevels.get(emp.value.educational_level_uid)
  }
})
const childRows = computed(() => childStore.childList.filter(child => child.parent_uid === emp.value.uid))
const addressRows = computed(() => addressStore.addressList.filter(addr => addr.employee_uid === emp.value.uid))
const contactRows = computed(() => contactStore.contactList.filter(contact => contact.employee_uid === emp.value.uid))

const unsubscribe = empStore.$onAction(({name, store, after}) => {
  const actions = new Set(['updateDB', 'terminateDB', 'activateDB', 'deactivateDB'])
  if (actions.has(name)) {
    after(() => {
      if (emp.value && emp.value.uid) {
        const result = store.employees.get(emp.value.uid)
        if (result) {emp.value = result}
      }
    });

  }
})

onUnmounted(() => unsubscribe())

function onEditEmployee() {
  const extra = {
    divisionUid: empLookups.value.division.uid,
    departmentUid: empLookups.value.department.uid,
    sectionUid: empLookups.value.section.uid
  }
  edit(Object.assign(emp.value, extra))
}
function deactivateLocal() {
  deactivate(emp.value.uid)
}
function terminateLocal() {
  terminate(emp.value.uid)
}
function activateLocal() {
  activate(emp.value.uid)
}
</script>
<style lang="scss" scoped>
// $
.hr-grid-container {
  display: grid;
  gap: 20px 20px;
  grid-template-columns: auto auto;
}

.hr-grid-item-1 {
  grid-column-start: 1;
  grid-column-end: 2;
}

.hr-grid-item-2 {
  grid-column-start: 1;
  grid-column-end: 2;
}

.emp-inactive {
  color: $red-14;
}
</style>
