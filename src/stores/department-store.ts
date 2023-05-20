import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {DepartmentReadOne as R, DepartmentReadMany as RM, DepartmentCreate as C} from 'src/models/department';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/departments';

export const useDepartmentStore = defineStore('department', () => {

  const departments: Ref<Map<string, R>> = ref(new Map())

  const departmentList = computed(() => {
    return Array.from(departments.value, entry => entry[1])
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, departments.value, 'department')

  return {
    departments,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
    departmentList,
  }
})
