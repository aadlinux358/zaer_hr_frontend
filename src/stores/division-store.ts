import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {DivisionReadOne, DivisionReadMany, DivisionCreate} from 'src/models/division';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/divisions';

export const useDivisionStore = defineStore('division', () => {

  const divisions: Ref<Map<string, Readonly<DivisionReadOne>>> = ref(new Map());

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
  } = useApiCrud<DivisionCreate, DivisionReadOne, DivisionReadMany>(ENDPOINT, divisions.value, 'division')

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
