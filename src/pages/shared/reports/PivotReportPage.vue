<script setup lang="ts">
import PivotComponent from 'src/components/PivotComponent.vue'
import 'webdatarocks/webdatarocks.css'
import {useStores} from 'src/composables/stores'

const {
  empStore
} = useStores();

const options = {
  dataSource: {
    data: empStore.employeeList
  },
  slice: {
    rows: [
      {
        uniqueName: 'division',
      },
      {
        uniqueName: 'department',
      },
      {
        uniqueName: 'unit',
      },
      {
        uniqueName: 'section',
      }
    ],
    columns: [],
    measures: [
      {
        uniqueName: 'badge_number',
        format: 'badge_number',
        aggregation: 'count',
      },
      {
        uniqueName: 'current_salary',
        format: 'current_salary'
      }
    ]
  },
  formats: [
    {
      name: 'current_salary',
      thousandsSeparator: ',',
    },
    {
      name: 'badge_number',
      thousandsSeparator: ',',
    }
  ]
}

</script>
<template>
  <PivotComponent toolbar
                  :report="options" />
</template>
