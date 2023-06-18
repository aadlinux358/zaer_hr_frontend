<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="designationColumns"
             :rows="designationStore.designationList"
             @row-click="onSelected"
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
                       @delete="remove"
                       @cancel="onCancel"
                       :payload="selectedEntity" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent} from 'quasar'
import {DesignationCreate, DesignationReadOne} from 'src/models/designation';
import DesignationForm from 'src/forms/DesignationForm.vue'
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {designationStore, uiStore} = useStores();
const filter = ref('');
const {designationColumns} = useTableColumns();
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

function onSelected(evt, row) {
  edit(row);
}
</script>
