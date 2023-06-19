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
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Birth Place:</span><span class="text-uppercase">{{
                emp.birth_place
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Origin of Birth:</span><span class="text-uppercase">{{
                emp.origin_of_birth
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Marital Status:</span><span class="text-uppercase">{{
                emp.marital_status
              }}</span>
            </div>
          </div>
          <div class="column col">
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Mother's First Name:</span><span class="text-capitalize">{{
                emp.mother_first_name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Mother's Last Name:</span><span class="text-capitalize">{{
                emp.mother_last_name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Mother's Grandfather Name:</span><span class="text-capitalize">{{
                emp.mother_grandfather_name
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Educational Level:</span><span class="text-capitalize">{{
                emp.educationalLevel
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Country:</span><span class="text-uppercase">{{
                emp.country
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Nationality:</span><span class="text-uppercase">{{
                emp.nationality
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
                emp.division
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Department:</span><span class="text-uppercase">{{
                emp.department
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Unit:</span><span class="text-uppercase">{{
                emp.unit
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Section:</span><span class="text-uppercase">{{
                emp.section
              }}</span>
            </div>
            <div class="q-ma-xs">
              <span class="text-caption q-mr-sm">Designation:</span><span class="text-uppercase">{{
                emp.designation
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
    <q-dialog ref="terminateDialogRef"
              @hide="terminationOnHide"
              persistent>
      <TerminationForm @create="terminationCreate"
                       @cancel="terminationOnCancel"
                       :employee-uid="emp.uid"
                       :payload="terminationSelectedEntity" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, Ref} from 'vue';
import {useRoute} from 'vue-router';
import {useDialogPluginComponent} from 'quasar'
import {useStores} from 'src/composables/stores'
import {useCrud} from 'src/composables/crud';
import {useTableColumns} from 'src/composables/table-columns'
import {EmployeeCreate as C, EmployeeReadOneFull as R, EmployeeObj} from 'src/models/employee';
import EmployeeDetailActions from 'src/components/EmployeeDetailActions.vue';
import EmployeeForm from 'src/forms/EmployeeForm.vue'
import EmployeeRelatedList from 'src/components/EmployeeRelatedList.vue'
import TerminationForm from 'src/forms/TerminationForm.vue'
import Router from 'src/router';
import {TerminationCreate, TerminationReadOne} from 'src/models/termination';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const emp: Ref<R> = ref(EmployeeObj)
const {hydrateStore, empStore, childStore, contactStore, addressStore, divisionStore, departmentStore, unitStore, sectionStore, terminationStore} = useStores();
const route = useRoute();
const {
  dialogRef,
  selectedEntity,
  create,
  edit,
  update,
  deactivate,
  activate,
  onCancel,
  onHide,
} = useCrud<C, R>(empStore)

const {
  dialogRef: terminateDialogRef,
  selectedEntity: terminationSelectedEntity,
  create: terminationCreate,
  onHide: terminationOnHide,
  onCancel: terminationOnCancel} = useCrud<TerminationCreate, TerminationReadOne>(terminationStore)


const {
  childColumns,
  addressColumns,
  contactPersonColumns,
} = useTableColumns();

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
  }
})
const childRows = computed(() => childStore.childList.filter(child => child.parent_uid === emp.value.uid))
const addressRows = computed(() => addressStore.addressList.filter(addr => addr.employee_uid === emp.value.uid))
const contactRows = computed(() => contactStore.contactList.filter(contact => contact.employee_uid === emp.value.uid))

const empUnsubscribe = empStore.$onAction(({name, store, after}) => {
  const actions = new Set(['updateDB', 'createDB', 'activateDB', 'deactivateDB'])
  if (actions.has(name)) {
    after(() => {
      if (emp.value && emp.value.uid) {
        const result = store.employees.get(emp.value.uid)
        if (result) {
          emp.value = result;
        }
      }
    });

  }
})
const terminateUnsubscribe = terminationStore.$onAction(({name, after}) => {
  const actions = new Set(['updateDB', 'createDB'])
  if (actions.has(name)) {
    after(async () => {
      if (emp.value && emp.value.uid) {
        await empStore.getById(emp.value.uid)
        const result = empStore.employees.get(emp.value.uid)
        if (result) {
          emp.value = result;
        }
      }
    });

  }
})

onUnmounted(() => {
  empUnsubscribe();
  terminateUnsubscribe();
})

function onEditEmployee() {
  const section = sectionStore.sections.get(emp.value.section_uid);
  const unit = unitStore.units.get(section.unit_uid);
  const department = departmentStore.departments.get(unit.department_uid)
  const division = divisionStore.divisions.get(department.division_uid)
  const extra = {
    divisionUid: division.uid,
    departmentUid: department.uid,
    unitUid: unit.uid
  }
  edit(Object.assign(emp.value, extra))
}
function deactivateLocal() {
  deactivate(emp.value.uid)
}
function terminateLocal() {
  terminationSelectedEntity.value = null;
  terminateDialogRef.value?.show();
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

.emp-active {
  color: $positive
}
</style>
