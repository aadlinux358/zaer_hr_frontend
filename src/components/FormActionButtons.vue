<template>
  <div class="q-gutter-xs">
    <q-btn no-caps
           class="text-capitalize"
           v-if="!props.isUpdate && !props.noCreate"
           square
           :label="$t('save')"
           type="button"
           @click="emits('onCreate')"
           color="primary" />
    <q-btn no-caps
           class="text-capitalize"
           v-if="props.isUpdate && !props.noUpdate"
           square
           :label="$t('update')"
           type="button"
           @click="emits('onUpdate')"
           color="primary" />
    <q-btn no-caps
           class="text-capitalize"
           square
           :label="$t('reset')"
           type="reset"
           color="primary" />
    <q-btn no-caps
           v-if="!props.noCancel"
           class="text-capitalize"
           square
           :label="$t('cancel')"
           type="button"
           @click="emits('onCancel')"
           color="primary" />
    <q-btn no-caps
           v-if="props.isUpdate && !props.noDelete"
           class="text-capitalize"
           square
           :label="$t('delete')"
           type="button"
           @click="emits('onDelete')"
           color="primary" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  isUpdate: {type: Boolean, default: false},
  noCreate: {type: Boolean, default: false},
  noUpdate: {type: Boolean, default: false},
  noDelete: {type: Boolean, default: false},
  noCancel: {type: Boolean, default: false},
})
const emits = defineEmits(['onCreate', 'onCancel', 'onUpdate', 'onDelete'])
</script>
