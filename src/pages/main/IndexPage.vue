<script setup lang="ts">
import {computed} from 'vue';
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
exportingInit(Highcharts)

import {Chart} from 'highcharts-vue';
import StatsHeader from 'src/components/StatsHeader.vue'
import {useStores} from 'src/composables/stores';

const highcharts = Chart;
const {empStore, departmentStore} = useStores();

const yearsLabel = computed(() => {
  return Array.from(new Set(
    empStore.employeeList.map(x => new Date(x.current_hire_date).getFullYear()).sort()));

})
const hireData = computed(() => {
  let data: number[] = [];
  let count = 0;
  yearsLabel.value.forEach((y) => {
    empStore.employeeList.forEach(emp => {
      if (new Date(emp.current_hire_date).getFullYear() === y) {
        count += 1
      }
    })
    data.push(count)
  })
  return data
})


const hireOptions = {
  title: {
    text: 'Employee Hiring',
  },
  subtitle: {
    text: 'Only showing currently active employees.'
  },
  xAxis: {
    categories: yearsLabel.value,
    crosshair: true,
  },
  yAxis: {
    title: {
      text: 'Number of Employees'
    }
  },
  series: [
    {
      name: 'Employees hired',
      data: hireData.value,
      color: '#f44336'
    }
  ]
}

const departments = computed(() => {
  return departmentStore.departmentList.map(d => d.name).sort()
})
const empDepData = computed(() => {
  let data: number[] = [];
  let count = 0;
  departments.value.forEach((d) => {
    empStore.employeeList.forEach(emp => {
      if (emp.department === d) {
        count += 1
      }
    })
    data.push(count)
  })
  return data
})
const empPerDepOptions = {
  title: {text: 'Number of Employees/Department'},
  subtitle: {text: 'Source: ZaEr HR'},
  xAxis: {categories: departments.value, crosshair: true},
  yAxis: {title: {text: 'Departments'}},

  tooltip: {
    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    pointFormat:
      '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
      '<td style="padding:0"><b>{point.y}</b></td></tr>',
    footerFormat: '</table>',
    shared: true,
    useHTML: true,
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    }
  },
  series: [
    {
      name: 'Total',
      data: empDepData.value,
      color: '#f44336'
    }
  ],
  chart: {
    type: 'bar',
  }
}

const genderOptions = {
  title: {text: 'Gender'},
  subtitle: {text: 'Source: ZaEr HR'},
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
  },
  series: [
    {
      name: 'Total',
      data: [{gender: 'Male', count: 233}, {gender: 'Female', count: 334}],
      color: '#f44336',
    }
  ],
  chart: {
    type: 'pie',
  }
}
</script>
<template>
  <q-page padding>
    <StatsHeader />
    <div class="row q-gutter-sm">
      <highcharts class="col"
                  :options="genderOptions"></highcharts>
      <highcharts class="col"
                  :options="empPerDepOptions"></highcharts>
    </div>
    <highcharts class="col"
                :options="hireOptions"></highcharts>
    <highcharts class="col"
                :options="empPerDepOptions"></highcharts>
  </q-page>
</template>
<style lang="scss" scoped>
// $
.hr-grid-container {
  display: grid;
  gap: 20px 20px;
  grid-template-columns: auto auto;
}

.hr-grid-item-1 {
  grid-column-start: 1;
  grid-column-end: 2;
}

.hr-grid-item-2 {
  grid-column-start: 2;
  grid-column-end: 3;
}
</style>
