<template>
  <div>
    <q-table dense
             bordered
             square
             :columns="columns"
             @row-click="onSelected"
             :rows="rows"
             row-key="uid"
             :hide-pagination="true"
             flat
             separator="cell"
             no-data-label="This table has no data. Please add if nessessary."
             :loading="loading">
      <template v-slot:top>
        <div class="column full-width">
          <div class="row items-center full-width">
            <div class="col q-table__title text-capitalize">{{ $t(title) }}</div>
            <q-space />
            <q-btn color="primary"
                   v-if="rows.length === 0 || title === 'children'"
                   no-caps
                   square
                   class="text-capitalize"
                   icon="add"
                   :label="$t('new')"
                   :disable="loading"
                   @click="add" />
          </div>
        </div>
      </template>
    </q-table>
    <q-dialog ref="dialogRef"
              @hide="onHide"
              persistent>
      <EmployeeAddressForm v-if="entity === 'address'"
                           @create="create"
                           @update="update"
                           @delete="remove"
                           @cancel="onCancel"
                           :emp-uid="empUid"
                           :payload="selectedEntity" />
      <EmployeeChildForm v-if="entity === 'child'"
                         @create="create"
                         @update="update"
                         @delete="remove"
                         @cancel="onCancel"
                         :parent-uid="empUid"
                         :payload="selectedEntity" />
      <EmployeeContactPersonForm v-if="entity === 'contact'"
                                 @create="create"
                                 @update="update"
                                 @delete="remove"
                                 @cancel="onCancel"
                                 :emp-uid="empUid"
                                 :payload="selectedEntity" />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {useCrud} from 'src/composables/crud';
import {useStores} from 'src/composables/stores'
import EmployeeChildForm from 'src/forms/EmployeeChildForm.vue';
import EmployeeContactPersonForm from 'src/forms/EmployeeContactPersonForm.vue';
import EmployeeAddressForm from 'src/forms/EmployeeAddressForm.vue';
const props = defineProps<{
  columns: []
  rows: []
  loading: boolean
  entity: string
  title: string
  empUid: string | null;
}>()

const {childStore, addressStore, contactStore} = useStores();
function getStore() {
  switch (props.entity) {
    case 'address':
      return addressStore
      break;
    case 'child':
      return childStore;
      break;
    case 'contact':
      return contactStore;
      break;
    default:
      return null;
      break

  }
}
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
} = useCrud(getStore())

function onSelected(evt, row) {
  edit(row);
}
</script>

<style lang="scss">
// $
thead tr:first-child th {
  background-color: $dark-page;
  color: $indigo-1;
}
</style>
