<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="eduStore.educationalLevelList"
           row-key="uid"
           flat
           separator="cell"
           :loading="eduStore.state.loading"
           :filter="filter">

    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col-2 q-table__title text-capitalize">{{ $t('educational_levels') }}</div>
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
                 :disable="eduStore.state.loading"
                 @click="addEducationalLevel"> {{ $t('new') }} {{ $t('educational_level') }} </q-btn>
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
        <div class="text-h6 text-capitalize">{{ $t(eduStore.state.crudType) }} {{ $t('educational_level') }}</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <EducationalLevelForm @save="onSave"
                              @reset="onFormReset"
                              @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {EducationalLevelReadOne} from 'src/models/education';
import {CRUDType, DownloadFileType} from 'src/models/common';
import EducationalLevelForm from 'src/forms/EducationalLevelForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {eduStore} = useStores();

const filter = ref('');

function onEdit(uid: string) {
  eduStore.editEducationalLevel(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await eduStore.deleteEducationalLevel(uid);
  })
}

function addEducationalLevel() {
  eduStore.addEducationalLevel();
  dialogRef.value?.show()
}
function onSave() {
  switch (eduStore.state.crudType) {
    case CRUDType.CREATE: {
      eduStore.createDBEducationalLevel();
      break;
    }
    case CRUDType.UPDATE: {
      eduStore.updateDBEducationalLevel();
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
  eduStore.resetForm();
  onDialogCancel()
}
function onHide() {
  onDialogHide()
}

function onFormReset() {
  eduStore.resetForm();
}

function downloadCSV() {
  eduStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  eduStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'level',
    required: true,
    label: 'Educational Level',
    align: 'left',
    field: (row: EducationalLevelReadOne) => row.level,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: EducationalLevelReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Educational Level UUID',
    align: 'left',
    field: (row: EducationalLevelReadOne) => row.uid,
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