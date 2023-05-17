<template>
  <q-table bordered
           square
           title="Divisions"
           :columns="columns"
           :rows="divisionStore.divisionList"
           row-key="uid"
           flat
           separator="cell"
           :loading="divisionStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="divisions"
                       v-model:filter="filter"
                       entity="division"
                       :loading="divisionStore.loading"
                       :table-props="props"
                       @add="addDivision" />
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
        <div class="text-h6 text-capitalize">{{ $t(divisionStore.crudType) }} {{ $t('division') }}</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <DivisionForm @save="onSave"
                      @reset="onFormReset"
                      @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useQuasar, useDialogPluginComponent} from 'quasar'
import {DivisionReadOne} from 'src/models/division';
import {CRUDType, DownloadFileType} from 'src/models/common';
import DivisionForm from 'src/forms/DivisionForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {divisionStore} = useStores();

const filter = ref('');

function onEdit(uid: string) {
  divisionStore.editDivision(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await divisionStore.deleteDivision(uid);
  })
}

function addDivision() {
  divisionStore.addDivision();
  dialogRef.value?.show()
}
function onSave() {
  switch (divisionStore.crudType) {
    case CRUDType.CREATE: {
      divisionStore.createDBDivision();
      break;
    }
    case CRUDType.UPDATE: {
      divisionStore.updateDBDivision();
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
  divisionStore.resetForm();
  onDialogCancel()
}
function onHide() {
  onDialogHide()
}

function onFormReset() {
  divisionStore.resetForm();
}

function downloadCSV() {
  divisionStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  divisionStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Division Name',
    align: 'left',
    field: (row: DivisionReadOne) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: DivisionReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Division UUID',
    align: 'left',
    field: (row: DivisionReadOne) => row.uid,
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
