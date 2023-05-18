<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="sectionStore.sectionList"
           row-key="uid"
           flat
           separator="cell"
           :loading="sectionStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="sections"
                       v-model:filter="filter"
                       entity="section"
                       :loading="sectionStore.loading"
                       :table-props="props"
                       @add="addSection"
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
        <div class="text-h6 text-uppercase">{{ sectionStore.crudType }} Section</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <SectionForm @save="onSave"
                     @reset="onFormReset"
                     @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {SectionReadOne} from 'src/models/section';
import {CRUDType, DownloadFileType} from 'src/models/common';
import SectionForm from 'src/forms/SectionForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;

const {
  divisionStore,
  departmentStore,
  sectionStore} = useStores();

const filter = ref('');

function onEdit(uid: string) {
  sectionStore.editSection(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await sectionStore.deleteSection(uid);
  })
}

function addSection() {
  sectionStore.addSection();
  dialogRef.value?.show()
}
function onSave() {
  switch (sectionStore.crudType) {
    case CRUDType.CREATE: {
      sectionStore.createDBSection();
      break;
    }
    case CRUDType.UPDATE: {
      sectionStore.updateDBSection();
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
  sectionStore.resetForm();
  onDialogCancel()
}
function onHide() {
  sectionStore.resetForm();
  onDialogHide()
}

function onFormReset() {
  sectionStore.resetForm();
}

function downloadCSV() {
  sectionStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  sectionStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Section Name',
    align: 'left',
    field: (row: SectionReadOne) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'department',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row: SectionReadOne) => {
      const dep = departmentStore.departments.get(row.department_uid);
      return capitalize(dep?.name);
    },
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'division',
    required: true,
    label: 'Division Name',
    align: 'left',
    field: (row: SectionReadOne) => {
      const dep = departmentStore.departments.get(row.department_uid);
      const div = divisionStore.divisions.get(dep?.division_uid);
      return capitalize(div?.name);
    },
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: SectionReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Section UUID',
    align: 'left',
    field: (row: SectionReadOne) => row.uid,
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
