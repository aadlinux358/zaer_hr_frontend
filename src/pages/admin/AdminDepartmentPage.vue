<template>
  <q-table bordered square :columns="columns" :rows="departmentStore.departmentList" row-key="uid" flat separator="cell"
    :loading="departmentStore.state.loading" :filter="filter">

    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col-2 q-table__title">Departments</div>
          <q-space />

          <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen" class="q-mx-md" size="lg" />
        </div>
        <div class="row q-my-md">
          <q-btn color="primary" square no-caps :disable="departmentStore.state.loading" label="Add Department"
            @click="addDepartment" />
          <q-space />

          <div class="row q-mx-md items-center">

            <q-btn color="primary" @click="downloadCSV" flat round dense icon="fas fa-file-csv" />
            <q-btn color="primary" @click="downloadExcel" flat round dense icon="fas fa-file-excel" />
          </div>

          <q-input square filled dense debounce="300" color="primary" v-model="filter" label="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn size="xs" class="q-mx-xs" color="primary" icon="mode_edit" @click="onEdit(props.row.uid)"></q-btn>
        <q-btn size="xs" class="q-mx-xs" color="primary" icon="delete" @click="onDelete(props.row.uid)"></q-btn>
      </q-td>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
  <q-dialog ref="dialogRef" @hide="onHide" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-uppercase">{{ departmentStore.state.crudType }} Department</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <DepartmentForm @save="onSave" @reset="onFormReset" @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {onMounted} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {useDepartmentStore} from 'src/stores/department-store';
import {DepartmentReadOne} from 'src/models/department';
import {CRUDType, DownloadFileType} from 'src/models/common';
import DepartmentForm from 'src/forms/DepartmentForm.vue'
import {useDivisionStore} from 'src/stores/division-store';
import {format, date} from 'quasar';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;

const departmentStore = useDepartmentStore();
const divisionStore = useDivisionStore();
const filter = ref('');
onMounted(async () => {
  $q.loading.show();
  if (divisionStore.state.divisions.size == 0) {
    await divisionStore.getManyDBDivisions();
  }
  if (departmentStore.state.departments.size === 0) {
    await departmentStore.getManyDBDepartments();
  }
  $q.loading.hide();
})

function onEdit(uid: string) {
  departmentStore.editDepartment(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await departmentStore.deleteDepartment(uid);
  })
}

function addDepartment() {
  departmentStore.addDepartment();
  dialogRef.value?.show()
}
function onSave() {
  switch (departmentStore.state.crudType) {
    case CRUDType.CREATE: {
      departmentStore.createDBDepartment();
      break;
    }
    case CRUDType.UPDATE: {
      departmentStore.updateDBDepartment();
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
  departmentStore.resetForm();
  onDialogCancel()
}
function onHide() {
  onDialogHide()
}
function onFormReset() {
  departmentStore.resetForm();
}

function downloadCSV() {
  departmentStore.downloadFile(DownloadFileType.CSV)
}
function downloadExcel() {
  departmentStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row: DepartmentReadOne) => row.name,
    sortable: true,
    format: (val: string) => capitalize(val),
  },
  {
    name: 'division_uid',
    required: true,
    label: 'Division',
    align: 'left',
    field: (row: DepartmentReadOne) => {
      const division = divisionStore.state.divisions.get(row.division_uid)
      return division?.name
    },
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: DepartmentReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Department UUID',
    align: 'left',
    field: (row: DepartmentReadOne) => row.uid,
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
  background-color: #e91c1c
}
</style>
