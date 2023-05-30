<script setup lang="ts">
import Router from 'src/router'
import {useStores} from 'src/composables/stores';
import {computed, ref, Ref} from 'vue';

interface SinceLastMonth {
  arrow: 'up' | 'down'
  percentage: number
}
interface StatsData {
  title: string;
  value: number;
  valueSymbol?: string
  againstLastMonth?: SinceLastMonth
}

const {empStore,
  departmentStore,
  sectionStore,
  unitStore,
} = useStores();
const data: Ref<Array<StatsData>> = ref([
  {
    title: 'Cost (Salary)',
    value: computed(() => empStore.salaryCost),
    valueSymbol: '$',
    againstLastMonth: {
      arrow: 'up',
      percentage: 3.8
    }
  },
  {
    title: 'Employees',
    value: computed(() => empStore.employees.size),
    againstLastMonth: {
      arrow: 'down',
      percentage: 5.8
    }
  },
  {
    title: 'Departments',
    value: computed(() => departmentStore.departments.size),
    againstLastMonth: {
      arrow: 'down',
      percentage: 5.8
    }
  },
  {
    title: 'Sections',
    value: computed(() => sectionStore.sections.size),
    againstLastMonth: {
      arrow: 'down',
      percentage: 5.8
    }
  },
  {
    title: 'Units',
    value: computed(() => unitStore.units.size),
    againstLastMonth: {
      arrow: 'down',
      percentage: 5.8
    }
  },
])

function gotTo(routeName: string) {
  Router.push({name: routeName})
}
</script>

<template>
  <div class="row justify-between q-my-sm">
    <q-banner dense
              v-for="s in data"
              :key="s.title"
              class="my-banner"
              @click="gotTo('Employees')"
              :class="$q.dark.isActive ? 'hr-border-dark' : 'hr-border'">
      <q-list dense
              style="min-width: 100px;">
        <q-item>
          <q-item-section>
            {{ s.title }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-h6">
            <template v-if="s.valueSymbol">{{ s.valueSymbol }}</template>{{ s.value }}
          </q-item-section>
        </q-item>
        <q-item v-if="s.againstLastMonth">
          <span class="text-caption">
            <i class="fa-solid "
               :class="s.againstLastMonth.arrow === 'up' ? 'fa-arrow-up-long' : 'fa-arrow-down-long'"></i>
            {{ s.againstLastMonth.percentage }}% Since last month</span>
        </q-item>
      </q-list>
    </q-banner>
  </div>
</template>

<style style="scss" scoped>
.my-banner {
  width: 100%;
  max-width: 200px;
}
</style>
