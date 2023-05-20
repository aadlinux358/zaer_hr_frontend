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
    <SectionForm @create="create"
                 @update="update"
                 @cancel="onCancel"
                 :payload="selectedEntity" />
  </q-dialog>
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
  sectionStore} = useStores();

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
    label: 'Section UUID',
    align: 'left',
    field: (row: R) => row.uid,
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
