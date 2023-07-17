<script setup lang="ts">
import {computed} from 'vue';
import {useStores} from 'src/composables/stores';
export interface Props {
  title: string;
  entity: string;
  loading: boolean;
  filter: string;
  showAddButton?: boolean;
  tableProps: {
    toggleFullscreen: () => void
    inFullscreen: boolean
  }
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  entity: '',
  loading: false,
  showAddButton: true
})

const emits = defineEmits(['update:filter', 'add', 'downloadCsv', 'downloadExcel'])
const {uiStore, authStore} = useStores();
const filter = computed({
  get() {return props.filter},
  set(value: string) {emits('update:filter', value)}
})
</script>

<template>
  <div class="column full-width">
    <div class="row items-center full-width">
      <div class="col-2 q-table__title text-capitalize">{{ $t(title) }}</div>
      <q-space />
      <q-btn flat
             round
             color="primary"
             :icon="tableProps.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
             @click="tableProps.toggleFullscreen"
             size="lg" />
    </div>
    <div class="row q-mt-md">
      <q-btn color="primary"
             v-if="props.showAddButton"
             class="text-capitalize"
             square
             no-caps
             :disable="loading || authStore.lock"
             @click="$emit('add')"> {{ $t('new') }} {{ $t(entity) }}
        <q-tooltip class="text-capitalize"
                   v-if="authStore.lock">{{ $t('staff_or_admin_tooltip') }}</q-tooltip>
      </q-btn>
    </div>
    <div class="row items-center">
      <q-toggle v-model="uiStore.denseTable"
                color="primary"
                label="Dense" />
      <q-space />
      <div class="row q-mx-md items-center">
        <q-btn @click="$emit('downloadCsv')"
               :color="$q.dark.isActive ? 'white' : 'primary'"
               flat
               round
               icon="fas fa-file-csv">
          <q-tooltip>Download full table info as a csv file</q-tooltip>
        </q-btn>
      </div>
      <q-input filled
               square
               class="text-capitalize"
               :label="$t('search')"
               dense
               debounce="300"
               color="primary"
               v-model="filter">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
  </div>
</template>
