<template>
  <q-page padding>
    <q-table bordered
             square
             :dense="uiStore.denseTable"
             :columns="columns"
             :rows="userStore.userList"
             @row-click="onSelected"
             row-key="uid"
             flat
             separator="cell"
             :loading="userStore.loading"
             :filter="filter">

      <template v-slot:top="props">
        <DataTableHeader title="users"
                         v-model:filter="filter"
                         entity="user"
                         :loading="userStore.loading"
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
      <UserForm @create="create"
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
import {AuthUserCreate as C, AuthUserReadOne as R} from 'src/models/auth-user';
import UserForm from 'src/forms/UserForm.vue'
import {format, date} from 'quasar';
import {useStores} from 'src/composables/stores';
import DataTableHeader from 'src/components/DataTableHeader.vue';
import {useCrud} from 'src/composables/crud';
defineEmits({
  ...useDialogPluginComponent.emitsObject
})

const {capitalize} = format;
const {userStore, uiStore} = useStores();
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
} = useCrud<C, R>(userStore)

function onSelected(evt, row) {
  edit(row);
}
const columns = [
  {
    name: 'first_name',
    required: true,
    label: 'First Name',
    align: 'left',
    field: (row: R) => row.first_name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'last_name',
    required: true,
    label: 'Last Name',
    align: 'left',
    field: (row: R) => row.last_name,
    format: (val: string) => capitalize(val),
    sortable: true
  },
  {
    name: 'email',
    required: true,
    label: 'Email',
    align: 'left',
    field: (row: R) => row.email,
    format: (val: string) => val,
    sortable: true
  },
  {
    name: 'username',
    required: true,
    label: 'Username',
    align: 'left',
    field: (row: R) => row.username,
    format: (val: string) => val,
    sortable: true
  },
  {
    name: 'is_superuser',
    required: true,
    label: 'Is Superuser',
    align: 'left',
    field: (row: R) => row.is_superuser,
    format: (val: string) => val,
    sortable: true
  },
  {
    name: 'is_staff',
    required: true,
    label: 'Is Staff',
    align: 'left',
    field: (row: R) => row.is_staff,
    format: (val: string) => val,
    sortable: true
  },
  {
    name: 'is_active',
    required: true,
    label: 'Is Active',
    align: 'left',
    field: (row: R) => row.is_active,
    format: (val: string) => val,
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
    label: 'Division UUID',
    align: 'left',
    field: (row: R) => row.uid,
  },
]
</script>
