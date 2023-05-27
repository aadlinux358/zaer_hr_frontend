<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="eduStore.educationalLevelList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="eduStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="educational_levels"
                         v-model:filter="filter"
                         entity="educational_level"
                         :loading="eduStore.loading"
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
      <EducationalLevelForm @create="create"
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
import {EducationalLevelCreate as C, EducationalLevelReadOne as R} from 'src/models/education';
import {useCrud} from 'src/composables/crud';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import EducationalLevelForm from 'src/forms/EducationalLevelForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {eduStore, uiStore} = useStores();

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
} = useCrud<C, R>(eduStore)
function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'level',
    required: true,
    label: 'Educational Level',
    align: 'left',
    field: (row: R) => row.level,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'level_order',
    required: true,
    label: 'Educational Level Order',
    align: 'left',
    field: (row: R) => row.level_order,
    format: (val: number) => val,
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
    label: 'Educational Level UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
