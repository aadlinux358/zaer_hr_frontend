<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="nationalityStore.nationalityList"
           row-key="uid"
           flat
           separator="cell"
           :loading="nationalityStore.state.loading"
           :filter="filter">

    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col-2 q-table__title text-capitalize">{{ $t('nationalities') }}</div>
          <q-space />

          <q-btn flat
                 round
                 dense
                 :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                 @click="props.toggleFullscreen"
                 class="q-mx-md"
                 size="lg" />
        </div>
        <div class="row q-my-md">
          <q-btn color="primary"
                 class="text-capitalize"
                 square
                 no-caps
                 :disable="nationalityStore.state.loading"
                 @click="addNationality"> {{ $t('new') }} {{ $t('nationality') }} </q-btn>
          <q-space />
          <div class="row q-mx-md items-center">
            <q-btn color="primary"
                   @click="downloadCSV"
                   flat
                   round
                   dense
                   icon="fas fa-file-csv" />
            <q-btn color="primary"
                   @click="downloadExcel"
                   flat
                   round
                   dense
                   icon="fas fa-file-excel" />
          </div>
          <q-input filled
                   square
                   dense
                   debounce="300"
                   color="primary"
                   v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
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
        <div class="text-h6 text-capitalize">{{ $t(nationalityStore.state.crudType) }} {{ $t('nationality') }}</div>
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
  switch (nationalityStore.state.crudType) {
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
