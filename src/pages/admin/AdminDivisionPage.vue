<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             title="Divisions"
             :columns="columns"
             :rows="divisionStore.divisionList"
             @row-click="onSelected"
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
      <template v-slot:loading>
        <q-inner-loading showing
                         color="primary" />
      </template>
    </q-table>
    <q-dialog ref="dialogRef"
              @hide="onHide"
              persistent>
      <DivisionForm @create="create"
                    @update="update"
                    @delete="remove"
                    @cancel="onCancel"
                    :payload="selectedEntity" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent} from 'quasar'
import {DivisionCreate as C, DivisionReadOne as R} from 'src/models/division';
import DivisionForm from 'src/forms/DivisionForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {divisionStore, uiStore} = useStores();
const filter = ref('');

const {
  dialogRef,
  selectedEntity,
  create,
  add,
  edit,
  update,
  remove,
  onCancel,
  onHide,
  downloadCSV,
  downloadExcel
} = useCrud<C, R>(divisionStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Division Name',
    align: 'left',
    field: (row: R) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: R) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Division UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
