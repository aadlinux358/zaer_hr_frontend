<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="departmentStore.departmentList"
           row-key="uid"
           flat
           separator="cell"
           :loading="departmentStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="departments"
                       v-model:filter="filter"
                       entity="department"
                       :loading="departmentStore.loading"
                       :table-props="props"
                       @add="addDepartment" />
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
            persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-uppercase">{{ departmentStore.crudType }} Department</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <DepartmentForm @save="onSave"
                        @reset="onFormReset"
                        @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {DepartmentReadOne} from 'src/models/department';
import {CRUDType, DownloadFileType} from 'src/models/common';
import DepartmentForm from 'src/forms/DepartmentForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {divisionStore, departmentStore} = useStores();

const filter = ref('');

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
  switch (departmentStore.crudType) {
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
      const division = divisionStore.divisions.get(row.division_uid)
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
