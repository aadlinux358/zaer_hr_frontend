<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="sectionColumns"
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
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import {useCrud} from 'src/composables/crud';
import DataTableHeader from 'src/components/DataTableHeader.vue';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const filter = ref('');
const {
  sectionStore,
  uiStore} = useStores();
const {sectionColumns} = useTableColumns();
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
</script>
