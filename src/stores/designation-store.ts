import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {DesignationReadOne as R, DesignationReadMany as RM, DesignationCreate as C} from 'src/models/designation';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/designations';

export const useDesignationStore = defineStore('designation', () => {

  const designations: Ref<Map<string, R>> = ref(new Map())
  const designationList = computed(() => {
    return Array.from(designations.value, entry => entry[1])
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, designations.value, 'designation')

  return {
    designations,
    designationList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
