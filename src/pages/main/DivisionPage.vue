<script setup lang="ts">
import {useTableColumns} from 'src/composables/table-columns';
import {useStores} from 'src/composables/stores';
import ListView from 'src/components/ListView.vue'
import StatsHeader from 'src/components/StatsHeader.vue';

const {divisionColumns} = useTableColumns();
const {divisionStore} = useStores();

</script>
<template>
  <q-page padding>
    <StatsHeader />
    <ListView :columns="divisionColumns"
              :rows="divisionStore.divisionList"
              :loading="divisionStore.loading"
              sort-by="name"
              title="division" />
  </q-page>
</template>
