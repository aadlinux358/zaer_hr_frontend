<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="departmentStore.departmentList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="departmentStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="departments"
                         v-model:filter="filter"
                         entity="department"
                         :loading="departmentStore.loading"
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
      <DepartmentForm @create="create"
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
import {DepartmentReadOne as R, DepartmentCreate as C} from 'src/models/department';
import DepartmentForm from 'src/forms/DepartmentForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {divisionStore, departmentStore, uiStore} = useStores();
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
} = useCrud<C, R>(departmentStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row: R) => row.name,
    sortable: true,
    format: (val: string) => capitalize(val),
  },
  {
    name: 'division_uid',
    required: true,
    label: 'Division',
    align: 'left',
    field: (row: R) => {
      const division = divisionStore.divisions.get(row.division_uid)
      return division?.name
    },
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
    label: 'Department UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
