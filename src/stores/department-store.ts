import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DepartmentReadOne, DepartmentReadMany, DepartmentCreate} from 'src/models/department';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface DepartmentState {
  departments: Map<string, DepartmentReadOne>;
  selectedDepartment: DepartmentReadOne | null | undefined;
  form: DepartmentCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/departments';

export const useDepartmentStore = defineStore('department', () => {

  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const state: DepartmentState = reactive({
    departments: new Map(),
    selectedDepartment: null,
    form: {
      name: '',
      division_uid: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const departmentList = computed(() => {
    return Array.from(state.departments, entry => entry[1])
  })

  function resetForm() {
    state.form.division_uid = '';
    state.form.name = '';
  }

  function _removeDepartment(uid: string) {
    state.departments.delete(uid);
  }
  function _setError(err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        state.error = 'connection error.'
      } else {
        if (err.response?.data.detail instanceof String) {
          state.error = err.response?.data.detail
        } else {
          state.error = err.message
        }
      }
    } else if (err instanceof Error) {
      state.error = err.message;
    } else {
      state.error = 'Unknown error.'
    }

    Notify.create({
      color: 'negative',
      message: state.error,
    });

  }

  function addDepartment() {
    state.crudType = CRUDType.CREATE;
  }

  function editDepartment(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const department = state.departments.get(uid);
    state.selectedDepartment = department;
    state.form = <DepartmentCreate>{...state.selectedDepartment};
  }

  async function deleteDepartment(uid: string) {
    state.crudType = CRUDType.DELETE;
    const department = state.departments.get(uid);
    state.selectedDepartment = department;
    await deleteDBDepartment();
  }

  async function getManyDBDepartments() {
    state.departments = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DepartmentReadMany = response.data;
      data.result.forEach((dep) => state.departments.set(dep.uid, dep));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBDepartment() {
    // create department
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const department: DepartmentReadOne = response.data;
      state.departments.set(department.uid, department);
      Notify.create({
        color: 'positive',
        message: 'Successfully created department.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function updateDBDepartment() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedDepartment?.uid}`, state.form, config)
      const department: DepartmentReadOne = response.data;
      state.departments.set(department.uid, department);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated department'
      })

    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }


  async function deleteDBDepartment() {
    // delete department
    state.loading = true;
    try {
      if (state.selectedDepartment) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedDepartment.uid}`, config);
        _removeDepartment(state.selectedDepartment.uid);
        state.selectedDepartment = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted department.'
        })
      } else {
        throw new Error('No department selected')
      }
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function downloadFile(fileType: DownloadFileType) {
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`department.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  return {
    state,
    addDepartment,
    editDepartment,
    deleteDepartment,
    getManyDBDepartments,
    createDBDepartment,
    updateDBDepartment,
    deleteDBDepartment,
    downloadFile,
    departmentList,
    resetForm,
  }
})
