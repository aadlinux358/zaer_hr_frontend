<script setup lang="ts">
import PivotComponent from 'src/components/PivotComponent.vue'
import 'webdatarocks/webdatarocks.css'
import {useStores} from 'src/composables/stores'

const {
  empStore
} = useStores();

const dataSource = {
  data: empStore.employeeList
}
</script>
<template>
  <PivotComponent toolbar
                  :report="dataSource" />
</template>
