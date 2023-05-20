import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {DivisionReadOne as R, DivisionReadMany as RM, DivisionCreate as C} from 'src/models/division';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/divisions';

export const useDivisionStore = defineStore('division', () => {

  const divisions: Ref<Map<string, Readonly<R>>> = ref(new Map());

  const divisionList = computed(() => {
    return Array.from(divisions.value, entry => entry[1])
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  } = useApiCrud<C, R, RM>(ENDPOINT, divisions.value, 'division')

  return {
    divisions,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
    divisionList,
  }
})
