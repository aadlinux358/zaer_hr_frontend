<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="unitStore.unitList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="unitStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="units"
                         v-model:filter="filter"
                         entity="unit"
                         :loading="unitStore.loading"
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
      <UnitForm @create="create"
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
import {UnitCreate as C, UnitReadOne as R} from 'src/models/unit';
import UnitForm from 'src/forms/UnitForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import {useCrud} from 'src/composables/crud';
import DataTableHeader from 'src/components/DataTableHeader.vue';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const filter = ref('');

const {
  divisionStore,
  departmentStore,
  sectionStore,
  unitStore,
  uiStore} = useStores();

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
} = useCrud<C, R>(unitStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Unit Name',
    align: 'left',
    field: (row: R) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'department',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row: R) => {
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
    field: (row: R) => {
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
    field: (row: R) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Unit UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
