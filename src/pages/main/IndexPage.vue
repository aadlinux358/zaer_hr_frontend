<script setup lang="ts">
import {computed, watch} from 'vue';
import {format} from 'quasar'
import {useI18n} from 'vue-i18n';
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
exportingInit(Highcharts)

import {Chart} from 'highcharts-vue';
import StatsHeader from 'src/components/StatsHeader.vue'
import ListView from 'src/components/ListView.vue'
import {useStores} from 'src/composables/stores';
import {useQuasar} from 'quasar';

const $q = useQuasar();
const {t} = useI18n({useScope: 'global'})
const {capitalize} = format;
const highcharts = Chart;
const {empStore, departmentStore, divisionStore} = useStores();

watch(computed(() => empStore.loading), (newValue) => {
  $q.loading.show();
  if (!newValue) {
    $q.loading.hide();
  }
})
const yearsLabel = computed(() => {
  return Array.from(new Set(
    empStore.employeeList.map(x => new Date(x.current_hire_date).getFullYear()).sort()));

})
const hireData = computed(() => {
  let data: number[] = [];
  yearsLabel.value.forEach((y) => {
    let count = 0;
    empStore.employeeList.forEach(emp => {
      if (new Date(emp.current_hire_date).getFullYear() === y) {
        count += 1
      }
    })
    data.push(count)
  })
  return data
})

const hireOptions = computed(() => {
  return {
    title: {
      text: capitalize(t('employees_by_hire_date')),
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
})
const departments = computed(() => {
  return departmentStore.departmentList.map(d => d.name.toUpperCase()).sort()
})
const empDepData = computed(() => {
  let data: number[] = [];
  departments.value.forEach((d) => {
    let count = 0;
    empStore.employeeList.forEach(emp => {
      if (emp.department?.toLowerCase() === d.toLowerCase()) {
        count += 1
      }
    })
    data.push(count)
  })
  return data
})
const empPerDepOptions = computed(() => {
  return {
    title: {text: capitalize(t('employees_by_department'))},
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
      height: 600,
    }
  }

})
const genderData = computed(() => {
  let maleCount = 0
  let femaleCount = 0
  empStore.employeeList.forEach(e => {
    if (e.gender === 'f') {
      femaleCount += 1;
    } else if (e.gender === 'm') {
      maleCount += 1;
    }
  })
  return {maleCount, femaleCount}
})
const genderOptions = computed(() => {
  return {
    title: {text: capitalize(t('employees_by_gender'))},
    subtitle: {text: 'Source: ZaEr HR'},
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    series: [
      {
        name: 'Total',
        data: [{name: 'Male', y: genderData.value.maleCount}, {name: 'Female', y: genderData.value.femaleCount}],
        color: '#f44336',
      }
    ],
    chart: {
      type: 'pie',
      height: 400,
    }
  }


})
const divisions = computed(() => {
  return divisionStore.divisionList.map(d => d.name.toUpperCase()).sort()
})
const empDivData = computed(() => {
  let data: number[] = [];
  divisions.value.forEach(d => {
    let count = 0;
    empStore.employeeList.forEach(emp => {
      if (emp.division?.toLowerCase() === d.toLowerCase()) {
        count += 1;
      }
    })
    data.push(count);
  })
  return data;
})
const divisionOptions = computed(() => {
  return {
    title: {text: capitalize(t('employees_by_division'))},
    subtitle: {text: 'Source: ZaEr HR'},
    xAxis: {categories: divisions.value, crosshair: true},
    yAxis: {title: {text: 'Divisions'}},
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    series: [
      {
        name: 'Total',
        data: empDivData.value,
        color: '#f44336',
      }
    ],
    chart: {
      type: 'column',
      height: 400,
    }
  }
})

export interface DesignationStat {
  title: string;
  count: number;
}
const designationStatColumns = [
  {
    name: 'title',
    required: true,
    label: 'Designation',
    align: 'left',
    field: (row: DesignationStat) => row.title,
  },
  {
    name: 'count',
    required: true,
    label: 'Count',
    align: 'left',
    field: (row: DesignationStat) => row.count,
  }
]
const designationStatData = computed(() => {
  const counts = empStore.employeeList.reduce((acc, curr) => {
    if (!acc.has(curr.designation)) {
      acc.set(curr.designation, {title: curr.designation, count: 0})
    }
    acc.get(curr.designation).count++;
    return acc
  }, new Map())
  return Array.from(counts, entry => entry[1])
})
</script>
<template>
  <q-page padding>
    <StatsHeader />
    <div class="row q-gutter-sm q-my-sm">
      <highcharts class="col"
                  :options="genderOptions"></highcharts>
      <highcharts class="col"
                  :options="divisionOptions"></highcharts>
    </div>
    <highcharts class="q-my-sm"
                :options="empPerDepOptions"></highcharts>
    <highcharts class="q-my-sm"
                :options="hireOptions"></highcharts>
    <ListView :columns="designationStatColumns"
              :rows="designationStatData"
              :loading="empStore.loading"
              sort-by="title"
              title="employees_by_designation" />
  </q-page>
</template>
