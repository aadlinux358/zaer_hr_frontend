<script setup lang="ts">
import {ref, computed} from 'vue';

const props = defineProps<{
  title: string
  entity: string
  loading: boolean
  filter: string
  tableProps: {
    toggleFullscreen: () => void
    inFullscreen: boolean
  }
}>()

const emits = defineEmits(['update:filter'])

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
             dense
             color="primary"
             :icon="tableProps.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
             @click="tableProps.toggleFullscreen"
             class="q-mx-md"
             size="lg" />
    </div>
    <div class="row q-my-md">
      <q-btn color="primary"
             class="text-capitalize"
             square
             no-caps
             :disable="loading"
             @click="$emit('add')"> {{ $t('new') }} {{ $t(entity) }} </q-btn>
      <q-space />
      <div class="row q-mx-md items-center">
        <q-btn color="primary"
               @click="$emit('downloadCsv')"
               flat
               round
               dense
               icon="fas fa-file-csv" />
        <q-btn color="primary"
               @click="$emit('downloadExcel')"
               flat
               round
               dense
               icon="fas fa-file-excel" />
      </div>
      <q-input filled
               square
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
