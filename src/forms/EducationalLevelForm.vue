<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('educational_level') }}</div>
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
                   v-model="form.level"
                   label="Educational level name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type educational level name']" />
          <q-input square
                   filled
                   type="number"
                   v-model.number="form.level_order"
                   label="Educational level order number"
                   lazy-rules
                   :rules="[val => val >= 0 || 'Please type level order number']" />
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
import {useForms} from 'src/composables/forms'
import FormActionButtons from 'src/components/FormActionButtons.vue';
import {EducationalLevelCreate, EducationalLevelReadOne} from 'src/models/educational-level';

const props = defineProps<{
  payload: EducationalLevelReadOne | null;
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
} = useForms<EducationalLevelCreate>(props, emits);
</script>
