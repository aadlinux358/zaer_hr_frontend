<script setup lang="ts">
import {useTableColumns} from 'src/composables/table-columns';
import {useStores} from 'src/composables/stores';
import ListView from 'src/components/ListView.vue'
import StatsHeader from 'src/components/StatsHeader.vue';

const {departmentColumns} = useTableColumns();
const {departmentStore} = useStores();
</script>
<template>
  <q-page padding>
    <StatsHeader />
    <ListView :columns="departmentColumns"
              :rows="departmentStore.departmentList"
              :loading="departmentStore.loading"
              sort-by="name"
              title="department" />
  </q-page>
</template>
