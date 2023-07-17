<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent} from 'quasar'
import {TerminationCreate as C, TerminationReadOne as R} from 'src/models/termination';
import TerminationForm from 'src/forms/TerminationForm.vue'
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {terminationStore, uiStore} = useStores();
const {terminationColumns} = useTableColumns();
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
} = useCrud<C, R>(terminationStore)

function onSelected(evt, row) {
  edit(row);
}
</script>
<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             title="Terminations"
             :columns="terminationColumns"
             :rows="terminationStore.terminationList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="terminationStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="terminations"
                         v-model:filter="filter"
                         entity="termination"
                         :loading="terminationStore.loading"
                         :table-props="props"
                         :show-add-button="false"
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
      <TerminationForm @create="create"
                       @update="update"
                       @delete="remove"
                       @cancel="onCancel"
                       :payload="selectedEntity" />
    </q-dialog>
  </q-page>
</template>
