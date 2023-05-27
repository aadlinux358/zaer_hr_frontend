<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">
        {{ $t(crudType) }} {{ $t('department') }}
      </div>
      <q-space />
      <q-btn icon="close"
             flat
             round
             dense
             v-close-popup />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <div class="q-pa-md"
           style="max-width: 400px">
        <q-form :autofocus="true"
                v-on:submit.prevent
                @reset="onReset"
                ref="formRef"
                class="q-gutter-md">
          <q-select square
                    outlined
                    v-model="form.division_uid"
                    :options="divisionStore.divisionList"
                    label="Division"
                    emit-value
                    map-options
                    option-label="name"
                    option-value="uid"
                    :rules="[val => val && val.length > 0 || 'Please select division']" />
          <q-input square
                   filled
                   v-model="form.name"
                   label="Department name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type department name']" />
          <FormActionButtons @on-update="onUpdate"
                             @on-cancel="onCancel"
                             @on-delete="onDelete"
                             @on-create="onCreate"
                             :isUpdate="payload ? true : false" />
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {useDivisionStore} from 'src/stores/division-store';
import {useForms} from 'src/composables/forms'
import {DepartmentCreate, DepartmentReadOne} from 'src/models/department';
import FormActionButtons from 'src/components/FormActionButtons.vue'

const props = defineProps<{
  payload: DepartmentReadOne | null;
}>()

const emits = defineEmits(['create', 'update', 'delete', 'reset', 'cancel'])

const divisionStore = useDivisionStore();
const {
  crudType,
  form,
  formRef,
  onCreate,
  onDelete,
  onUpdate,
  onReset,
  onCancel
} = useForms<DepartmentCreate>(props, emits);
</script>
