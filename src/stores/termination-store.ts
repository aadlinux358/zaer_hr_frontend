import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {useApiCrud} from 'src/composables/api';
import {TerminationReadOne as R, TerminationCreate as C, TerminationReadMany as RM} from 'src/models/termination';

const ENDPOINT = '/terminations';

export const useTerminationStore = defineStore('termination', () => {
  const terminations: Ref<Map<string, R>> = ref(new Map());

  const terminationList = computed(() => {
    return Array.from(terminations.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    getById,
    createDB,
    updateDB,
    deleteDB,
    terminateDB,
    downloadFile
  } = useApiCrud<C, R, RM>(ENDPOINT, terminations.value, 'termination')

  return {
    terminationList,
    terminations,
    terminateDB,
    loading,
    getManyDB,
    getById,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
