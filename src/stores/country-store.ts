import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {CountryReadOne as R, CountryReadMany as RM, CountryCreate as C} from 'src/models/country';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/countries';

export const useCountryStore = defineStore('country', () => {
  const countries: Ref<Map<string, R>> = ref(new Map())
  const countryList = computed(() => {
    return Array.from(countries.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, countries.value, 'country')

  return {
    countries,
    countryList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
