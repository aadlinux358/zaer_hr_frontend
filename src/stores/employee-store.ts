import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {hrApi} from 'src/boot/axios';
import {useFlags} from 'src/composables/flags';
import {EmployeeReadOneFull as R, EmployeeReadManyFull as RM, EmployeeCreate as C, EmployeeSeverancePay} from 'src/models/employee';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/employees';

export const useEmployeeStore = defineStore('employee', () => {
  const employees: Ref<Map<string, R>> = ref(new Map())
  const employeeList = computed(() => {
    const data: R[] = [];
    employees.value.forEach(e => {
      if (e.is_active === true) {
        data.push(e)
      }
    })
    return data;
  })


  const inactiveEmployeeList = computed(() => {
    const data: R[] = [];
    employees.value.forEach(e => {
      if (e.is_active === false) {
        data.push(e)
      }
    })
    return data;
  })
  const salaryCost = computed(() => {
    if (employeeList.value.length !== 0) {
      return employeeList.value.reduce((acc, curr) => acc + curr.current_salary, 0)
    }
    return 0
  })

  const {
    loading,
    config,
    getById,
    createDB,
    updateDB,
    deleteDB,
    activateDB,
    deactivateDB,
    downloadFile,
  } = useApiCrud<C, R, RM>(ENDPOINT, employees.value, 'employee')

  const {setError} = useFlags();
  async function getManyDB() {
    employees.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/full`, config);
      const data: RM = response.data;
      data.result.forEach((entity: R) => employees.value.set(entity.uid, entity));
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function getEmployeeByBadgeNumber(badge_number: number) {
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/badge-number/${badge_number}`, config);
      const entity: R = response.data;
      employees.value.set(entity.uid, entity)
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function getSeverancePay(badge_number: number) {
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/severance-pay/${badge_number}`, Object.assign(config, {ResponseType: 'blob'}))
      return response.data
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }


  return {
    employees,
    employeeList,
    inactiveEmployeeList,
    salaryCost,
    loading,
    getManyDB,
    getEmployeeByBadgeNumber,
    getSeverancePay,
    getById,
    createDB,
    updateDB,
    activateDB,
    deactivateDB,
    deleteDB,
    downloadFile,
  }
})
