<script setup lang="ts">
const emits = defineEmits(['edit', 'terminate', 'deactivate',])
</script>
<template>
  <div class="row q-gutter-sm q-ma-sm ">
    <q-btn :label="$t('edit')"
           square
           no-caps
           class="col text-capitalize"
           color="primary"
           icon="edit"
           @click="emits('edit')" />
    <q-btn :label="$t('deactivate')"
           square
           no-caps
           class="col text-capitalize"
           color="primary"
           icon="remove_circle"
           @click="emits('deactivate')" />
    <q-btn :label="$t('terminate')"
           square
           no-caps
           class="col text-capitalize"
           color="primary"
           icon="clear"
           @click="emits('terminate')" />
  </div>
</template>
