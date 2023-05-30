<script setup lang="ts">
import {useStores} from 'src/composables/stores';

const {authStore} = useStores();
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
             :disable="authStore.lock"
             @click="emits('edit')">

        <q-tooltip class="text-capitalize"
                   v-if="authStore.lock">{{ $t('staff_or_admin_tooltip') }}</q-tooltip>
      </q-btn>
      <q-btn :label="$t('activate')"
             v-if="!props.isActive"
             square
             no-caps
             class="col text-capitalize"
             color="primary"
             icon="add"
             :disable="authStore.lock"
             @click="emits('activate')">
        <q-tooltip class="text-capitalize"
                   v-if="authStore.lock">{{ $t('staff_or_admin_tooltip') }}</q-tooltip>
      </q-btn>
      <q-btn :label="$t('deactivate')"
             v-if="props.isActive"
             square
             no-caps
             class="col text-capitalize"
             color="primary"
             icon="remove_circle"
             :disable="authStore.lock"
             @click="emits('deactivate')">
        <q-tooltip class="text-capitalize"
                   v-if="authStore.lock">{{ $t('staff_or_admin_tooltip') }}</q-tooltip>
      </q-btn>
      <q-btn :label="$t('terminate')"
             v-if="!props.isTerminated"
             square
             no-caps
             :disable="props.isActive || authStore.lock"
             class="col text-capitalize"
             color="primary"
             icon="clear"
             @click="emits('terminate')">
        <q-tooltip v-if="props.isActive">Employee is active. Deactivate first.</q-tooltip>
        <q-tooltip class="text-capitalize"
                   v-if="authStore.lock">{{ $t('staff_or_admin_tooltip') }}</q-tooltip>
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
