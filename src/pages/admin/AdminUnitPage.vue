<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="unitStore.unitList"
           row-key="uid"
           flat
           separator="cell"
           :loading="unitStore.state.loading"
           :filter="filter">

    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col-2 q-table__title">Units</div>
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
                 square
                 no-caps
                 :disable="unitStore.state.loading"
                 label="Add Unit"
                 @click="addUnit" />
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
        <div class="text-h6 text-uppercase">{{ unitStore.state.crudType }} Unit</div>
        <q-space />
        <q-btn icon="close"
               flat
               round
               dense
               v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <UnitForm @save="onSave"
                  @reset="onFormReset"
                  @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {UnitReadOne} from 'src/models/unit';
import {CRUDType, DownloadFileType} from 'src/models/common';
import UnitForm from 'src/forms/UnitForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;

const {
  divisionStore,
  departmentStore,
  sectionStore,
  unitStore} = useStores();

const filter = ref('');

function onEdit(uid: string) {
  unitStore.editUnit(uid);
  dialogRef.value?.show();
}

function onDelete(uid: string) {
  $q.dialog({
    title: 'Delete',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await unitStore.deleteUnit(uid);
  })
}

function addUnit() {
  unitStore.addUnit();
  dialogRef.value?.show()
}
function onSave() {
  switch (unitStore.state.crudType) {
    case CRUDType.CREATE: {
      unitStore.createDBUnit();
      break;
    }
    case CRUDType.UPDATE: {
      unitStore.updateDBUnit();
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
  unitStore.resetForm();
  onDialogCancel()
}
function onHide() {
  unitStore.resetForm();
  onDialogHide()
}

function onFormReset() {
  unitStore.resetForm();
}

function downloadCSV() {
  unitStore.downloadFile(DownloadFileType.CSV)
}

function downloadExcel() {
  unitStore.downloadFile(DownloadFileType.EXCEL)
}

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Unit Name',
    align: 'left',
    field: (row: UnitReadOne) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'section',
    required: true,
    label: 'Section Name',
    align: 'left',
    field: (row: UnitReadOne) => {
      const sec = sectionStore.state.sections.get(row.section_uid);
      return capitalize(sec?.name);
    },
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'department',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row: UnitReadOne) => {
      const sec = sectionStore.state.sections.get(row.section_uid);
      const dep = departmentStore.state.departments.get(sec.department_uid);
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
    field: (row: UnitReadOne) => {
      const sec = sectionStore.state.sections.get(row.section_uid);
      const dep = departmentStore.state.departments.get(sec.department_uid);
      const div = divisionStore.state.divisions.get(dep?.division_uid);
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
    field: (row: UnitReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Unit UUID',
    align: 'left',
    field: (row: UnitReadOne) => row.uid,
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
