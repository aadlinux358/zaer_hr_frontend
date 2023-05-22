import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {useApiCrud} from 'src/composables/api';
import {ChieldReadOne as R, ChildCreate as C, ChildReadMany as RM} from 'src/models/child';

const ENDPOINT = '/children';

export const useChildStore = defineStore('child', () => {
  const children: Ref<Map<string, R>> = ref(new Map());

  const childList = computed(() => {
    return Array.from(children.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  } = useApiCrud<C, R, RM>(ENDPOINT, children.value, 'child')

  return {
    childList,
    children,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
