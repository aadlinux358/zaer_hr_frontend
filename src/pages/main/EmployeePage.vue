<template>
  <q-page padding>
    <StatsHeader />
    <q-table bordered
             :dense="uiStore.denseTable"
             square
             :columns="empColumns"
             :rows="empStore.employeeList"
             :pagination="{sortBy: 'badge_number', rowsPerPage: 20}"
             row-key="uid"
             flat
             separator="cell"
             @row-click="onSelected"
             :loading="empStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeaderVue title="employees"
                            v-model:filter="filter"
                            entity="employee"
                            :loading="empStore.loading"
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
              full-width
              full-height
              persistent>
      <EmployeeForm @create="create"
                    @upate="update"
                    @cancel="onCancel"
                    :payload="selectedEntity" />
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import {useDialogPluginComponent} from 'quasar'
import {useStores} from 'src/composables/stores';
import {useTableColumns} from 'src/composables/table-columns';
import {useCrud} from 'src/composables/crud';
import {EmployeeCreate as C, EmployeeReadOne as R} from 'src/models/employee';
import EmployeeForm from 'src/forms/EmployeeForm.vue'
import DataTableHeaderVue from 'src/components/DataTableHeader.vue';
import StatsHeader from 'src/components/StatsHeader.vue';
import Router from 'src/router'
defineEmits({
  ...useDialogPluginComponent.emitsObject
})
const {empStore, uiStore} = useStores();
const filter = ref('');
const {
  dialogRef,
  selectedEntity,
  create,
  add,
  update,
  onCancel,
  onHide,
  downloadCSV,
  downloadExcel
} = useCrud<C, R>(empStore)

const {empColumns} = useTableColumns();

function onSelected(evt, row) {
  Router.push({path: `/employees/${row.uid}`})
}
</script>
<style lang="scss">
// $
thead tr:first-child th {
  background-color: $dark-page;
  color: $indigo-1;
}
</style>
