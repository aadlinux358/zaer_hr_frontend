<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('termination') }}</div>
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
        <q-form @reset="onReset"
                :autofocus="true"
                ref="formRef"
                v-on:submit.prevent>
          <div class="column q-gutter-xs">
            <q-input filled
                     square
                     dense
                     label="Termination date"
                     v-model="form.termination_date"
                     mask="####-##-##"
                     lazy-rules
                     :rules="[val => isValid(new Date(val)) || 'Please enter valid date']">
            </q-input>
          </div>
          <FormActionButtons @on-create="onCreate"
                             @on-update="onUpdate"
                             @on-delete="onDelete"
                             @on-cancel="onCancel"
                             :isUpdate="payload ? true : false" />
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';
import {isValid} from 'date-fns'
import {useForms} from 'src/composables/forms'
import FormActionButtons from 'src/components/FormActionButtons.vue';
import {TerminationCreate, TerminationReadOne} from 'src/models/termination';
const props = defineProps<{
  employeeUid: string | null;
  payload: TerminationReadOne | null;
}>()


const emits = defineEmits(['create', 'update', 'delete', 'reset', 'cancel'])
const {
  crudType,
  form,
  formRef,
  onCreate,
  onUpdate,
  onDelete,
  onReset,
  onCancel
} = useForms<TerminationCreate>(props, emits);
onMounted(() => {
  if (!props.payload && props.employeeUid) {
    form.value.employee_uid = props.employeeUid;
  }
})
</script>
