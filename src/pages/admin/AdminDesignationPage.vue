<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="designationStore.designationList"
           row-key="uid"
           flat
           separator="cell"
           :loading="designationStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="designations"
                       v-model:filter="filter"
                       entity="designation"
                       :loading="designationStore.loading"
                       :table-props="props"
                       @add="addDesignation" />
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
        <div class="text-h6 text-uppercase">{{ designationStore.crudType }} Designation</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <DesignationForm @save="onSave"
                         @reset="onFormReset"
                         @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {DesignationReadOne} from 'src/models/designation';
import {CRUDType, DownloadFileType} from 'src/models/common';
import DesignationForm from 'src/forms/DesignationForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {designationStore} = useStores();

const filter = ref('');

function onEdit(uid: string) {
  designationStore.editDesignation(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await designationStore.deleteDesignation(uid);
  })
}

function addDesignation() {
  designationStore.addDesignation();
  dialogRef.value?.show()
}
function onSave() {
  switch (designationStore.crudType) {
    case CRUDType.CREATE: {
      designationStore.createDBDesignation();
      break;
    }
    case CRUDType.UPDATE: {
      designationStore.updateDBDesignation();
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
  designationStore.resetForm();
  onDialogCancel()
}
function onHide() {
  onDialogHide()
}

function onFormReset() {
  designationStore.resetForm();
}

function downloadCSV() {
  designationStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  designationStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'title',
    required: true,
    label: 'Designation Title',
    align: 'left',
    field: (row: DesignationReadOne) => row.title,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: DesignationReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Designation UUID',
    align: 'left',
    field: (row: DesignationReadOne) => row.uid,
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
