<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('child') }}</div>
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
            <q-input square
                     filled
                     dense
                     v-model="form.first_name"
                     label="First name"
                     lazy-rules
                     :rules="[val => val && val.length > 0 || 'Please type first name']" />
            <q-select square
                      filled
                      dense
                      v-model="form.gender"
                      :options="gender"
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                      :rules="[val => val && val.length > 0 || 'Please select gender']"
                      label="Gender" />
            <q-input filled
                     square
                     dense
                     label="Birth date"
                     v-model="form.birth_date"
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
import {useLookups} from 'src/composables/lookups';
import FormActionButtons from 'src/components/FormActionButtons.vue';
import {ChildCreate, ChildReadOne} from 'src/models/child';
const props = defineProps<{
  parentUid: string | null;
  payload: ChildReadOne | null;
}>()

const {gender} = useLookups();

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
} = useForms<ChildCreate>(props, emits);
onMounted(() => {
  if (!props.payload && props.parentUid) {
    form.value.parent_uid = props.parentUid;
  }
})
</script>
