<script setup lang="ts">
const emits = defineEmits(['edit', 'terminate', 'activate', 'deactivate',])
const props = defineProps<{
  isActive: boolean
  isTerminated: boolean
}>()
</script>
<template>
  <div class="overflow-auto q-pa-xs"
       :class="$q.dark.isActive ? 'hr-border-dark' : 'hr-border-light'">
    <div class="row q-gutter-sm items-center">
      <q-btn :label="$t('edit')"
             square
             no-caps
             class="col text-capitalize"
             color="primary"
             icon="edit"
             @click="emits('edit')" />
      <q-btn :label="$t('activate')"
             v-if="!props.isActive"
             square
             no-caps
             class="col text-capitalize"
             color="primary"
             icon="add"
             @click="emits('activate')" />
      <q-btn :label="$t('deactivate')"
             v-if="props.isActive"
             square
             no-caps
             class="col text-capitalize"
             color="primary"
             icon="remove_circle"
             @click="emits('deactivate')" />
      <q-btn :label="$t('terminate')"
             v-if="!props.isTerminated"
             square
             no-caps
             :disable="props.isActive"
             class="col text-capitalize"
             color="primary"
             icon="clear"
             @click="emits('terminate')">
        <q-tooltip v-if="props.isActive">Employee is active. Deactivate first.</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<style lang="scss" scoped>
// $
.hr-border-light {
  border: 1px solid $separator-color;
}

.hr-border-dark {
  border: 1px solid $separator-dark-color;
}
</style>
