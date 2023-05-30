import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {EmployeeReadOne as R, EmployeeReadMany as RM, EmployeeCreate as C} from 'src/models/employee';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/employees';

export const useEmployeeStore = defineStore('employee', () => {
  const employees: Ref<Map<string, R>> = ref(new Map())

  const employeeList = computed(() => {
    return Array.from(employees.value, entry => entry[1])
  })

  const salaryCost = computed(() => {
    if (employeeList.value.length !== 0) {
      return employeeList.value.reduce((acc, curr) => acc + curr.current_salary, 0)
    }
    return 0
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    activateDB,
    terminateDB,
    deactivateDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, employees.value, 'employee')

  return {
    employees,
    employeeList,
    salaryCost,
    loading,
    getManyDB,
    createDB,
    updateDB,
    activateDB,
    terminateDB,
    deactivateDB,
    deleteDB,
    downloadFile,
  }
})
