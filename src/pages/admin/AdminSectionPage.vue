<template>
  <q-table bordered square :columns="columns" :rows="sectionStore.sectionList" row-key="uid" flat separator="cell"
    :loading="sectionStore.state.loading" :filter="filter">

    <template v-slot:top="props">
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col-2 q-table__title">Sections</div>
          <q-space />

          <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen" class="q-mx-md" size="lg" />
        </div>
        <div class="row q-my-md">
          <q-btn color="primary" square no-caps :disable="sectionStore.state.loading" label="Add Section"
            @click="addSection" />
          <q-space />
          <div class="row q-mx-md items-center">
            <q-btn color="primary" @click="downloadCSV" flat round dense icon="fas fa-file-csv" />
            <q-btn color="primary" @click="downloadExcel" flat round dense icon="fas fa-file-excel" />
          </div>
          <q-input filled square dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn size="xs" class="q-mx-xs" color="primary" icon="mode_edit" @click="onEdit(props.row.uid)"></q-btn>
        <q-btn size="xs" class="q-mx-xs" color="primary" icon="delete" @click="onDelete(props.row.uid)"></q-btn>
      </q-td>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
  </q-table>
  <q-dialog ref="dialogRef" @hide="onHide" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Add Section</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-mt-md">
        <SectionForm @save="onSave" @reset="onFormReset" @cancel="onCancel" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {onMounted} from 'vue';
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {useSectionStore} from 'src/stores/section-store';
import {SectionReadOne} from 'src/models/section';
import {CRUDType, DownloadFileType} from 'src/models/common';
import SectionForm from 'src/forms/SectionForm.vue'
import {format, date} from 'quasar';
import {useDepartmentStore} from 'src/stores/department-store';
import {useDivisionStore} from 'src/stores/division-store';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;

const divisionStore = useDivisionStore();
const departmentStore = useDepartmentStore();
const sectionStore = useSectionStore();

const filter = ref('');
onMounted(() => {
  if (sectionStore.state.sections.size === 0) {
    sectionStore.getManyDBSections();
  }
})

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
  switch (sectionStore.state.crudType) {
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
      const dep = departmentStore.state.departments.get(row.department_uid);
      return capitalize(dep.name);
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
      const dep = departmentStore.state.departments.get(row.department_uid);
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
