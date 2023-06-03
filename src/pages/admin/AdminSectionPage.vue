<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="sectionStore.sectionList"
             @row-click="onSelected"
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
      <SectionForm @create="create"
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
import {SectionCreate as C, SectionReadOne as R} from 'src/models/section';
import SectionForm from 'src/forms/SectionForm.vue'
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
  unitStore,
  sectionStore,
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
} = useCrud<C, R>(sectionStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Section Name',
    align: 'left',
    field: (row: R) => row.name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'name',
    required: true,
    label: 'Unit Name',
    align: 'left',
    field: (row: R) => {
      const unit = unitStore.units.get(row.unit_uid);
      return capitalize(unit.name)
    },
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'department',
    required: true,
    label: 'Department Name',
    align: 'left',
    field: (row: R) => {
      const unit = unitStore.units.get(row.unit_uid)
      const dep = departmentStore.departments.get(unit.department_uid);
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
      const unit = unitStore.units.get(row.unit_uid)
      const dep = departmentStore.departments.get(unit.department_uid);
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
    label: 'Section UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
