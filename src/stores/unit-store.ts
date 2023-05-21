import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {UnitReadOne as R, UnitReadMany as RM, UnitCreate as C} from 'src/models/unit';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/units';

export const useUnitStore = defineStore('unit', () => {
  const units: Ref<Map<string, R>> = ref(new Map());
  const unitList = computed(() => {
    return Array.from(units.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, units.value, 'unit')

  return {
    units,
    unitList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
