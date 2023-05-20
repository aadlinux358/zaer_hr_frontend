<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('division') }}</div>
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
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-md">
          <q-input square
                   filled
                   v-model="form.name"
                   label="Division name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type division name']" />
          <FormActionButtons @on-update="onUpdate"
                             @on-cancel="onCancel"
                             :isUpdate="division ? true : false" />
        </q-form>

      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {Ref, onMounted, onUnmounted, ref} from 'vue';
import {DivisionCreate, DivisionReadOne} from 'src/models/division';
import FormActionButtons from 'src/components/FormActionButtons.vue'
import {CRUDType} from 'src/models/common';
const props = defineProps<{
  division: Readonly<DivisionReadOne> | null
}>();
const emit = defineEmits(['save', 'update', 'reset', 'cancel'])

const form: Ref<DivisionCreate> = ref({
  name: ''
});
const crudType = ref(CRUDType.CREATE)
onMounted(() => {
  if (props.division) {
    form.value = {...props.division}
    crudType.value = CRUDType.UPDATE
  }
})
onUnmounted(() => form.value.name = '')

function onSubmit() {
  emit('save', form.value);
}
function onUpdate() {
  emit('update', form.value)
}
function onReset() {
  form.value.name = '';
}
function onCancel() {
  emit('cancel')
}
</script>
