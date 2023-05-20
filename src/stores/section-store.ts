import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {SectionReadOne as R, SectionReadMany as RM, SectionCreate as C} from 'src/models/section';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/sections';

export const useSectionStore = defineStore('section', () => {
  const sections: Ref<Map<string, R>> = ref(new Map());
  const sectionList = computed(() => {
    return Array.from(sections.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, sections.value, 'section')

  return {
    sections,
    sectionList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
