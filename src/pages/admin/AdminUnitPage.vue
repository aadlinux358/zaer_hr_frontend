<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="unitColumns"
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
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import {useCrud} from 'src/composables/crud';
import DataTableHeader from 'src/components/DataTableHeader.vue';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const filter = ref('');

const {
  unitStore,
  uiStore} = useStores();

const {unitColumns} = useTableColumns();
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
</script>
