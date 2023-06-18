<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('address') }}</div>
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
          <div class="column q-gutter-sm q-my-sm">
            <q-input square
                     filled
                     dense
                     v-model="form.city"
                     label="City"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type city name']" />
            <q-input square
                     dense
                     filled
                     label="District"
                     v-model="form.district"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please enter district name']" />
            <q-input square
                     dense
                     filled
                     label="Street"
                     v-model="form.street"
                     hint="Optional" />
            <q-input square
                     class="col"
                     filled
                     dense
                     min="0"
                     v-model.number="form.house_number"
                     type="number"
                     label="House number"
                     hint="Optional" />
          </div>
          <FormActionButtons @on-create="onCreate"
                             @on-update="onUpdate"
                             @on-cancel="onCancel"
                             @on-delete="onDelete"
                             :isUpdate="payload ? true : false" />
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';
import {useForms} from 'src/composables/forms'
import FormActionButtons from 'src/components/FormActionButtons.vue';
import {AddressCreate, AddressReadOne} from 'src/models/employee-address'
const props = defineProps<{
  empUid: string | null;
  payload: AddressReadOne | null;
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
} = useForms<AddressCreate>(props, emits);
onMounted(() => {
  if (!props.payload && props.empUid)
    form.value.employee_uid = props.empUid;
})
</script>
