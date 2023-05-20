<template>
  <q-table bordered
           square
           :columns="columns"
           :rows="designationStore.designationList"
           row-key="uid"
           flat
           separator="cell"
           :loading="designationStore.loading"
           :filter="filter">

    <template v-slot:top="props">
      <DataTableHeader title="designations"
                       v-model:filter="filter"
                       entity="designation"
                       :loading="designationStore.loading"
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
    <DesignationForm @create="create"
                     @update="update"
                     @cancel="onCancel"
                     :payload="selectedEntity" />
  </q-dialog>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent} from 'quasar'
import {DesignationCreate, DesignationReadOne} from 'src/models/designation';
import DesignationForm from 'src/forms/DesignationForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {designationStore} = useStores();
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
} = useCrud<DesignationCreate, DesignationReadOne>(designationStore)

const columns = [
  {
    name: 'title',
    required: true,
    label: 'Designation Title',
    align: 'left',
    field: (row: DesignationReadOne) => row.title,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'date_created',
    required: true,
    label: 'Date Created',
    align: 'left',
    field: (row: DesignationReadOne) => row.date_created,
    format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
    sortable: true
  },
  {
    name: 'uid',
    required: true,
    label: 'Designation UUID',
    align: 'left',
    field: (row: DesignationReadOne) => row.uid,
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
