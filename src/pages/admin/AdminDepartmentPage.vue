<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="departmentColumns"
             :rows="departmentStore.departmentList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="departmentStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="departments"
                         v-model:filter="filter"
                         entity="department"
                         :loading="departmentStore.loading"
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
      <DepartmentForm @create="create"
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
import {DepartmentReadOne as R, DepartmentCreate as C} from 'src/models/department';
import DepartmentForm from 'src/forms/DepartmentForm.vue'
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';

defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {departmentStore, uiStore} = useStores();
const {departmentColumns} = useTableColumns();
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
} = useCrud<C, R>(departmentStore)

function onSelected(evt, row) {
  edit(row);
}
</script>
