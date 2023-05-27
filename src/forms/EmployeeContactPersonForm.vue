<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('contact_person') }}</div>
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
          <div class="row q-gutter-xs">
            <q-input square
                     filled
                     dense
                     v-model="form.first_name"
                     label="First name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type first name']" />
            <q-input square
                     filled
                     dense
                     v-model="form.last_name"
                     label="Last name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type last name']" />
            <q-input square
                     dense
                     filled
                     label="Phone number"
                     v-model="form.phone_number"
                     lazy-rules
                     :rules="[val => val && val.length > 0 && isDigit(val) || 'Please type valid (digits) phone number']" />
            <q-input square
                     dense
                     filled
                     label="Relationship with employee"
                     v-model="form.relationship_to_employee"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type relationship to employee']" />
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
import {useForms} from 'src/composables/forms'
import {isDigit} from 'src/utils/strings'
import FormActionButtons from 'src/components/FormActionButtons.vue';
import {ContactPersonCreate, ContactPersonReadOne} from 'src/models/employee-contact-person'
const props = defineProps<{
  empUid: string | null;
  payload: ContactPersonReadOne | null;
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
} = useForms<ContactPersonCreate>(props, emits);
onMounted(() => {
  if (!props.payload && props.empUid) {
    form.value.employee_uid = props.empUid
  }
})
</script>
