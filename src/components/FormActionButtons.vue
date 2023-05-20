<template>
  <div class="q-gutter-xs">
    <q-btn no-caps
           class="text-capitalize"
           v-if="!props.isUpdate"
           square
           :label="$t('save')"
           type="button"
           @click="emits('onCreate')"
           color="primary" />
    <q-btn no-caps
           class="text-capitalize"
           v-if="props.isUpdate"
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
           class="text-capitalize"
           square
           :label="$t('cancel')"
           type="button"
           @click="emits('onCancel')"
           color="primary" />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  isUpdate: boolean
}>()
const emits = defineEmits(['onCreate', 'onCancel', 'onUpdate'])
</script>
