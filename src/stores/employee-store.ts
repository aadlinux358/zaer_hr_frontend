import {computed, Ref, ref, watch} from 'vue';
import {defineStore} from 'pinia';
import {EmployeeReadOne as R, EmployeeReadMany as RM, EmployeeCreate as C} from 'src/models/employee';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/employees';

export const useEmployeeStore = defineStore('employee', () => {
  const employees: Ref<Map<string, R>> = ref(new Map())

  const employeeList = computed(() => {
    return Array.from(employees.value, entry => entry[1])
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, employees.value, 'employee')

  return {
    employees,
    employeeList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
