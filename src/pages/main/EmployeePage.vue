<template>
  <q-page padding>
    <q-table bordered
             dense
             square
             :columns="columns"
             :rows="empStore.employeeList"
             row-key="uid"
             flat
             separator="cell"
             :loading="empStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeaderVue title="employees"
                            v-model:filter="filter"
                            entity="employee"
                            :loading="empStore.loading"
                            :table-props="props"
                            @add="addEmployee"
                            @download-csv="downloadCSV"
                            @download-excel="downloadExcel" />

      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="xs"
                 class="q-mx-xs"
                 color="primary"
                 icon="mode_edit"
                 @click="onEdit(props.row.uid)"></q-btn>
          <q-btn size="xs"
                 class="q-mx-xs"
                 color="primary"
                 icon="delete"
                 @click="onDelete(props.row.uid)"></q-btn>
        </q-td>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing
                         color="primary" />
      </template>
    </q-table>
    <q-dialog ref="dialogRef"
              @hide="onHide"
              full-width
              full-height
              persistent>
      <q-card class="q-dialog-plugin">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-capitalize">{{ $t(empStore.crudType) }} {{ $t('employee') }}</div>
          <q-space />
          <q-btn icon="close"
                 flat
                 round
                 dense
                 v-close-popup />
        </q-card-section>
        <q-card-section class="q-mt-md">
          <EmployeeForm @save="onSave"
                        @reset="onFormReset"
                        @cancel="onCancel" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {EmployeeReadOne} from 'src/models/employee';
import {CRUDType, DownloadFileType} from 'src/models/common';
import EmployeeForm from 'src/forms/EmployeeForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeaderVue from 'src/components/DataTableHeader.vue';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();

const {t} = useI18n({useScope: 'global'})
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {empStore} = useStores();

const filter = ref('');


function onEdit(uid: string) {
  empStore.editEmployee(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: t('Delete'),
    message: t('confirm_delete'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await empStore.deleteEmployee(uid);
  })
}

function addEmployee() {
  empStore.addEmployee();
  dialogRef.value?.show()
}

function onSave() {
  switch (empStore.crudType) {
    case CRUDType.CREATE: {
      empStore.createDBEmployee();
      break;
    }
    case CRUDType.UPDATE: {
      empStore.updateDBEmployee();
      break;
    }
    default: {
      throw new Error('Invalid CRUD Operaion.')
      break;
    }
  }
  onDialogOK();
}
function onCancel() {
  empStore.resetForm();
  onDialogCancel()
}
function onHide() {
  onDialogHide()
}

function onFormReset() {
  empStore.resetForm();
}

function downloadCSV() {
  empStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  empStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'badge_number',
    required: true,
    label: 'Badge Number',
    align: 'left',
    field: (row: EmployeeReadOne) => row.badge_number,
    sortable: true
  },
  {
    name: 'first_name',
    required: true,
    label: 'First Name',
    align: 'left',
    field: (row: EmployeeReadOne) => row.first_name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'last_name',
    required: true,
    label: 'Last Name',
    align: 'left',
    field: (row: EmployeeReadOne) => row.last_name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'grandfather_name',
    required: true,
    label: 'Grandfather Name',
    align: 'left',
    field: (row: EmployeeReadOne) => row.grandfather_name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'gender',
    required: true,
    label: 'Gender',
    align: 'left',
    field: (row: EmployeeReadOne) => row.gender,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'current_hire_date',
    required: true,
    label: 'Hire Date',
    align: 'left',
    field: (row: EmployeeReadOne) => row.current_hire_date,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY'),
    sortable: true
  },
  {
    name: 'division',
    required: true,
    label: 'Division',
    align: 'left',
    field: (row: EmployeeReadOne) => {
      const division = empStore.getDivision(row.unit_uid);
      return capitalize(division.name);
    }
  },
  {
    name: 'department',
    required: true,
    label: 'Department',
    align: 'left',
    field: (row: EmployeeReadOne) => {
      const department = empStore.getDepartment(row.unit_uid);
      return capitalize(department.name);
    },
  },
  {
    name: 'section',
    required: true,
    label: 'Section',
    align: 'left',
    field: (row: EmployeeReadOne) => {
      const section = empStore.getSection(row.unit_uid);
      return capitalize(section.name);
    }
  },
  {
    name: 'unit',
    required: true,
    label: 'Unit',
    align: 'left',
    field: (row: EmployeeReadOne) => {
      const unit = empStore.getUnit(row.unit_uid);
      return capitalize(unit.name)
    }
  },
  {
    name: 'designation',
    required: true,
    label: 'Designation',
    align: 'left',
    field: (row: EmployeeReadOne) => {
      const designation = empStore.getDesignation(row.designation_uid);
      return capitalize(designation.title)
    }
  },
  {
    name: 'actions',
    required: true,
    label: 'Action',
    align: 'left',
  }

]
</script>
<style lang="scss">
thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #e91c1c;
}
</style>
