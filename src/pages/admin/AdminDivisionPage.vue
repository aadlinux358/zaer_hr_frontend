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
                       @add="add"
                       @download-csv="downloadCSV"
                       @download-excel="downloadExcel" />
    </template>
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn size="xs"
               class="q-mx-xs"
               color="primary"
               icon="mode_edit"
               @click="edit(props.row)"></q-btn>
        <q-btn size="xs"
               class="q-mx-xs"
               color="primary"
               icon="delete"
               @click="remove(props.row.uid)"></q-btn>
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
    <DivisionForm @save="create"
                  @update="update"
                  @cancel="onCancel"
                  :division="selectedDivision" />
  </q-dialog>
</template>
<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useQuasar, useDialogPluginComponent} from 'quasar'
import {DivisionCreate, DivisionReadOne} from 'src/models/division';
import {DownloadFileType} from 'src/models/common';
import DivisionForm from 'src/forms/DivisionForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const $q = useQuasar();
const {t} = useI18n({useScope: 'global'})
const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel} = useDialogPluginComponent()
const {capitalize} = format;
const {divisionStore} = useStores();

const selectedDivision: Ref<DivisionReadOne | null> = ref(null)
const filter = ref('');

async function create(div: DivisionCreate) {
  await divisionStore.createDBDivision(div)
  onDialogOK();
}

function add() {
  selectedDivision.value = null;
  dialogRef.value?.show()
}

function edit(div: Readonly<DivisionReadOne>) {
  selectedDivision.value = {...div}
  dialogRef.value?.show()
}

async function update(div: DivisionReadOne) {
  await divisionStore.updateDBDivision(div);
  onDialogOK();
}
async function remove(uid: string) {
  $q.dialog({
    title: t('delete'),
    message: t('confirm_delete'),
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await divisionStore.deleteDBDivision(uid);
  })
}

function onCancel() {
  selectedDivision.value = null;
  onDialogCancel()
}
function onHide() {
  onDialogHide()
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
