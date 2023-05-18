<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="nationalityStore.nationalityList"
           row-key="uid"
           flat
           separator="cell"
           :loading="nationalityStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="nationalities"
                       v-model:filter="filter"
                       entity="nationality"
                       :loading="nationalityStore.loading"
                       :table-props="props"
                       @add="addNationality"
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
            persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-capitalize">{{ $t(nationalityStore.crudType) }} {{ $t('nationality') }}</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <NationalityForm @save="onSave"
                         @reset="onFormReset"
                         @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {NationalityReadOne} from 'src/models/nationality';
import {CRUDType, DownloadFileType} from 'src/models/common';
import NationalityForm from 'src/forms/NationalityForm.vue'
import DataTableHeader from 'src/components/DataTableHeader.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {nationalityStore} = useStores()

const filter = ref('');

function onEdit(uid: string) {
  nationalityStore.editNationality(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await nationalityStore.deleteNationality(uid);
  })
}

function addNationality() {
  nationalityStore.addNationality();
  dialogRef.value?.show()
}
function onSave() {
  switch (nationalityStore.crudType) {
    case CRUDType.CREATE: {
      nationalityStore.createDBNationality();
      break;
    }
    case CRUDType.UPDATE: {
      nationalityStore.updateDBNationality();
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
  nationalityStore.resetForm();
  onDialogCancel()
}
function onHide() {
  onDialogHide()
}

function onFormReset() {
  nationalityStore.resetForm();
}

function downloadCSV() {
  nationalityStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  nationalityStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nationality Name',
    align: 'left',
    field: (row: NationalityReadOne) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: NationalityReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Nationality UUID',
    align: 'left',
    field: (row: NationalityReadOne) => row.uid,
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
