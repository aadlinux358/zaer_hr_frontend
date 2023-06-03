<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="countryStore.countryList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="countryStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="countries"
                         v-model:filter="filter"
                         entity="country"
                         :loading="countryStore.loading"
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
      <CountryForm @create="create"
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
import {CountryCreate as C, CountryReadOne as R} from 'src/models/country';
import CountryForm from 'src/forms/CountryForm.vue'
import DataTableHeader from 'src/components/DataTableHeader.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import {useCrud} from 'src/composables/crud';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {countryStore, uiStore} = useStores()
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
} = useCrud<C, R>(countryStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Country Name',
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
    label: 'Country UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
