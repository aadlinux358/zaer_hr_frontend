import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {NationalityReadOne as R, NationalityReadMany as RM, NationalityCreate as C} from 'src/models/nationality';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/nationalities';

export const useNationalityStore = defineStore('nationality', () => {
  const nationalities: Ref<Map<string, R>> = ref(new Map())
  const nationalityList = computed(() => {
    return Array.from(nationalities.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, nationalities.value, 'nationality')

  return {
    nationalities,
    nationalityList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
