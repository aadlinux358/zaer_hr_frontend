<script setup lang="ts">
import {useTableColumns} from 'src/composables/table-columns';
import {useStores} from 'src/composables/stores';
import ListView from 'src/components/ListView.vue'
import StatsHeader from 'src/components/StatsHeader.vue';

const {designationColumns} = useTableColumns();
const {designationStore} = useStores();
</script>
<template>
  <q-page padding>
    <StatsHeader />
    <ListView :columns="designationColumns"
              :rows="designationStore.designationList"
              :loading="designationStore.loading"
              sort-by="title"
              title="designation" />
  </q-page>
</template>
