<template>
  <q-table bordered
           square
           title="Divisions"
           :columns="columns"
           :rows="divisionStore.divisionList"
           row-key="uid"
           flat
           separator="cell"
           :loading="divisionStore.state.loading"
           :filter="filter">

    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col-2 q-table__title text-capitalize">{{ $t('divisions') }}</div>
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
                 :disable="divisionStore.state.loading"
                 @click="addDivision"> {{ $t('new') }} {{ $t('division') }} </q-btn>
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
        <div class="text-h6 text-capitalize">{{ $t(divisionStore.state.crudType) }} {{ $t('division') }}</div>
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
  switch (divisionStore.state.crudType) {
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
