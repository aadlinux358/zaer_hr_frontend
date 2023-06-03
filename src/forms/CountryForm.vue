<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('country') }}</div>
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
          <q-input square
                   filled
                   v-model="form.name"
                   label="Country name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type country name']" />
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
import {CountryCreate} from 'src/models/country';
import FormActionButtons from 'src/components/FormActionButtons.vue'
import {useForms} from 'src/composables/forms';
const props = defineProps<{
  payload: CountryCreate | null;
}>()
const emits = defineEmits(['create', 'update', 'delete', 'reset', 'cancel'])

const {
  crudType,
  form,
  formRef,
  onCreate,
  onDelete,
  onUpdate,
  onReset,
  onCancel
} = useForms<CountryCreate>(props, emits);

</script>
