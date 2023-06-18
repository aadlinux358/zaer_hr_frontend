<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             title="Divisions"
             :columns="divisionColumns"
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
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {divisionStore, uiStore} = useStores();
const {divisionColumns} = useTableColumns();
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
</script>
