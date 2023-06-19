<script setup lang="ts">
import {useTableColumns} from 'src/composables/table-columns';
import {useStores} from 'src/composables/stores';
import ListView from 'src/components/ListView.vue'
import StatsHeader from 'src/components/StatsHeader.vue';

const {unitColumns} = useTableColumns();
const {unitStore} = useStores();
</script>
<template>
  <q-page padding>
    <StatsHeader />
    <ListView :columns="unitColumns"
              :rows="unitStore.unitList"
              :loading="unitStore.loading"
              sort-by="name"
              title="unit" />
  </q-page>
</template>
