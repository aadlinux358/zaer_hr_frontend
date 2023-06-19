<script setup lang="ts">
const props = defineProps<{
  columns: []
  rows: []
  loading: boolean
  title: string
  sortBy: string
}>()
</script>
<template>
  <q-table dense
           bordered
           square
           :columns="props.columns"
           :rows="props.rows"
           row-key="uid"
           flat
           :pagination="{rowsPerPage: 25, sortBy: props.sortBy}"
           separator="cell"
           no-data-label="This table has no data. Please add if nessessary."
           :loading="loading">
    <template v-slot:top>
      <div class="column full-width">
        <div class="row items-center full-width">
          <div class="col q-table__title text-capitalize">{{ $t(title) }}</div>
          <q-space />
        </div>
      </div>
    </template>
  </q-table>
</template>
