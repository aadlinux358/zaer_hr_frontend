import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {EducationalLevelReadOne as R, EducationalLevelReadMany as RM, EducationalLevelCreate as C} from 'src/models/educational-level';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/educational-levels';

export const useEducationalLevelStore = defineStore('education', () => {

  const educationalLevels: Ref<Map<string, R>> = ref(new Map())

  const educationalLevelList = computed(() => {
    return Array.from(educationalLevels.value, entry => entry[1])
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  } = useApiCrud<C, R, RM>(ENDPOINT, educationalLevels.value, 'educational level')

  return {
    educationalLevels,
    educationalLevelList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
