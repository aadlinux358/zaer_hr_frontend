<script setup lang="ts">
import {useTableColumns} from 'src/composables/table-columns';
import {useStores} from 'src/composables/stores';
import ListView from 'src/components/ListView.vue'
import StatsHeader from 'src/components/StatsHeader.vue';

const {sectionColumns} = useTableColumns();
const {sectionStore} = useStores();
</script>
<template>
  <q-page padding>
    <StatsHeader />
    <ListView :columns="sectionColumns"
              :rows="sectionStore.sectionList"
              :loading="sectionStore.loading"
              sort-by="name"
              title="section" />
  </q-page>
</template>
