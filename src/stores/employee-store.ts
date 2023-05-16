import {computed, Ref, ref, watch} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify, date} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {EmployeeReadOne, EmployeeReadMany, EmployeeCreate} from 'src/models/employee';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useDivisionStore} from './division-store';
import {useDepartmentStore} from './department-store';
import {useSectionStore} from './section-store';
import {useUnitStore} from './unit-store';
import {useDesignationStore} from './designation-store';
import {useLookups} from 'src/composables/lookups';
import {useNationalityStore} from './nationality-store';
import {useEducationalLevelStore} from './educational-level-store';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/employees';

export const useEmployeeStore = defineStore('employee', () => {
  const {AuthorizationHeader} = useAuthStore();
  const {
    gender,
    maritalStatus,
    contractType,
    nationalService} = useLookups();

  const divStore = useDivisionStore();
  const depStore = useDepartmentStore();
  const secStore = useSectionStore();
  const uniStore = useUnitStore();
  const desgStore = useDesignationStore();
  const natStore = useNationalityStore();
  const eduStore = useEducationalLevelStore();

  const {loading, crudType, error} = useFlags();
  const employees: Ref<Map<string, EmployeeReadOne>> = ref(new Map())
  const selectedEmployee: Ref<EmployeeReadOne | null | undefined> = ref(null)
  const form: Ref<EmployeeCreate> = ref({
    first_name: '',
    last_name: '',
    grandfather_name: '',
    gender: '',
    birth_date: '',
    current_salary: 0,
    current_hire_date: '',
    designation_uid: '',
    unit_uid: '',
    is_active: true,
    nationality_uid: '',
    birth_place: '',
    mother_first_name: '',
    mother_last_name: '',
    marital_status: '',
    educational_level_uid: '',
    phone_number: '',
    national_id: '',
    contract_type: '',
    national_service: '',
  })

  const _divisionUid = ref('')
  const _departmentUid = ref('')
  const _sectionUid = ref('')
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const divisionUid = computed({
    get() {return _divisionUid.value},
    set(div: string) {_divisionUid.value = div}
  })
  const departmentUid = computed({
    get() {return _departmentUid.value},
    set(div: string) {_departmentUid.value = div}
  })
  const sectionUid = computed({
    get() {return _sectionUid.value},
    set(sec: string) {_sectionUid.value = sec}
  })

  watch(divisionUid, (newValue, oldValue) => {
    if (oldValue) {
      departmentUid.value = '';
      sectionUid.value = '';
      form.value.unit_uid = '';
    }
  })
  watch(departmentUid, (newValue, oldValue) => {
    if (oldValue) {
      sectionUid.value = '';
      form.value.unit_uid = '';
    }
  })

  const divisions = computed(() => divStore.divisionList)
  const designations = computed(() => desgStore.designationList)
  const educationalLevels = computed(() => eduStore.educationalLevelList);
  const nationalities = computed(() => natStore.nationalityList);
  const departments = computed(() => {
    return depStore.departmentList.filter(dep => {
      return dep.division_uid == divisionUid.value
    })
  })

  const sections = computed(() => {
    return secStore.sectionList.filter(sec => {
      return sec.department_uid == departmentUid.value
    })
  })

  const units = computed(() => {
    return uniStore.unitList.filter(uni => {
      return uni.section_uid == sectionUid.value;
    })
  })

  const employeeList = computed(() => {
    return Array.from(employees.value, entry => entry[1])
  })


  function resetForm() {
    form.value.first_name = '',
      form.value.last_name = '',
      form.value.grandfather_name = '',
      form.value.gender = '',
      form.value.birth_date = '',
      form.value.birth_place = '',

      form.value.mother_first_name = '',
      form.value.mother_last_name = '',

      form.value.marital_status = '',
      form.value.educational_level_uid = '',
      form.value.phone_number = '',

      form.value.national_id = '',
      form.value.nationality_uid = '',
      form.value.national_service = ''

    form.value.current_salary = 0,
      form.value.current_hire_date = '',
      form.value.designation_uid = '',
      form.value.unit_uid = '',
      form.value.is_active = true,
      form.value.contract_type = ''
  }

  function getUnit(unitUid: string) {
    return uniStore.units.get(unitUid)
  }

  function getSection(unitUid: string) {
    const unit = uniStore.units.get(unitUid);
    return secStore.sections.get(unit?.section_uid);
  }

  function getDepartment(unitUid: string) {
    const unit = uniStore.units.get(unitUid);
    const sec = secStore.sections.get(unit?.section_uid);
    return depStore.departments.get(sec?.department_uid);
  }
  function getDivision(unitUid: string) {
    const unit = uniStore.units.get(unitUid);
    const sec = secStore.sections.get(unit?.section_uid);
    const dep = depStore.departments.get(sec?.department_uid);
    return divStore.divisions.get(dep?.division_uid);
  }

  function getDesignation(designationUid: string) {
    return desgStore.designations.get(designationUid);
  }

  function _removeEmployee(uid: string) {
    employees.value.delete(uid);
  }
  function _setError(err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        error.value = 'connection error.'
      } else {
        if (err.response?.data.detail instanceof String) {
          error.value = err.response?.data.detail
        } else {
          error.value = err.message
        }
      }
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'Unknown error.'
    }

    Notify.create({
      color: 'negative',
      message: error.value,
    });

  }

  function addEmployee() {
    crudType.value = CRUDType.CREATE;
  }
  function editEmployee(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const employee = employees.value.get(uid);
    selectedEmployee.value = employee;
    const formObj = <EmployeeCreate>{...selectedEmployee.value}
    // TODO: fix quasar date mask
    formObj.birth_date = date.formatDate(formObj.birth_date, 'YYYY/MM/DD')
    formObj.current_hire_date = date.formatDate(formObj.current_hire_date, 'YYYY/MM/DD')
    form.value = formObj;
  }

  async function deleteEmployee(uid: string) {
    crudType.value = CRUDType.DELETE
    const employee = employees.value.get(uid);
    selectedEmployee.value = employee;
    await deleteDBEmployee();
  }
  async function getManyDBEmployees() {
    employees.value = new Map();
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: EmployeeReadMany = response.data;
      data.result.forEach((div) => employees.value.set(div.uid, div));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBEmployee() {
    loading.value = true;
    try {
      const payload = Object.assign({}, form.value)
      payload.current_hire_date = date.formatDate(payload.current_hire_date, 'YYYY-MM-DD')
      payload.birth_date = date.formatDate(payload.birth_date, 'YYYY-MM-DD')
      const response = await hrApi.post(`${ENDPOINT}`, payload, config);
      resetForm();
      const employee: EmployeeReadOne = response.data;
      employees.value.set(employee.uid, employee);
      Notify.create({
        color: 'positive',
        message: 'Successfully created employee.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBEmployee() {
    loading.value = true;
    try {
      const payload = Object.assign({}, form.value)
      payload.current_hire_date = date.formatDate(payload.current_hire_date, 'YYYY-MM-DD')
      payload.birth_date = date.formatDate(payload.birth_date, 'YYYY-MM-DD')
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedEmployee?.uid}`, payload, config)
      const employee: EmployeeReadOne = response.data;
      state.employees.set(employee.uid, employee);
      resetForm();
      Notify.create({
        color: 'positive',
        message: 'Successfully updated employee.'
      })

    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function deleteDBEmployee() {
    loading.value = true;
    try {
      if (selectedEmployee.value) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedEmployee.uid}`, config);
        _removeEmployee(state.selectedEmployee.uid);
        selectedEmployee.value = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted employee.'
        })
      } else {
        throw new Error('No employee selected')
      }
    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function downloadFile(fileType: DownloadFileType) {
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`employees.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    employees,
    form,
    selectedEmployee,
    crudType,
    loading,
    gender,
    nationalService,
    maritalStatus,
    contractType,
    addEmployee,
    editEmployee,
    deleteEmployee,
    getDivision,
    getDepartment,
    getSection,
    getUnit,
    getDesignation,
    getManyDBEmployees,
    createDBEmployee,
    updateDBEmployee,
    deleteDBEmployee,
    downloadFile,
    employeeList,
    resetForm,
    divisions,
    departments,
    sections,
    units,
    designations,
    educationalLevels,
    nationalities,
    divisionUid,
    departmentUid,
    sectionUid
  }
})
