<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="eduStore.educationalLevelList"
           row-key="uid"
           flat
           separator="cell"
           :loading="eduStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="educational_levels"
                       v-model:filter="filter"
                       entity="educational_level"
                       :loading="eduStore.loading"
                       :table-props="props"
                       @add="addEducationalLevel"
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
        <div class="text-h6 text-capitalize">{{ $t(eduStore.crudType) }} {{ $t('educational_level') }}</div>
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
import DataTableHeader from 'src/components/DataTableHeader.vue';
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
  switch (eduStore.crudType) {
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
    name: 'level_order',
    required: true,
    label: 'Educational Level Order',
    align: 'left',
    field: (row: EducationalLevelReadOne) => row.level_order,
    format: (val: number) => val,
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
