<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="nationalityStore.nationalityList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="nationalityStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="nationalities"
                         v-model:filter="filter"
                         entity="nationality"
                         :loading="nationalityStore.loading"
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
      <NationalityForm @create="create"
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
import {NationalityCreate as C, NationalityReadOne as R} from 'src/models/nationality';
import NationalityForm from 'src/forms/NationalityForm.vue'
import DataTableHeader from 'src/components/DataTableHeader.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import {useCrud} from 'src/composables/crud';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {nationalityStore, uiStore} = useStores()
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
} = useCrud<C, R>(nationalityStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nationality Name',
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
    label: 'Nationality UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
