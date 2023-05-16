import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DepartmentReadOne, DepartmentReadMany, DepartmentCreate} from 'src/models/department';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/departments';

export const useDepartmentStore = defineStore('department', () => {


  const {AuthorizationHeader} = useAuthStore();
  const {crudType, loading, error} = useFlags();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const departments: Ref<Map<string, DepartmentReadOne>> = ref(new Map())
  const selectedDepartment: Ref<DepartmentReadOne | null | undefined> = ref(null);
  const form: Ref<DepartmentCreate> = ref({
    name: '',
    division_uid: ''
  })

  const departmentList = computed(() => {
    return Array.from(departments.value, entry => entry[1])
  })

  function resetForm() {
    form.value.division_uid = '';
    form.value.name = '';
  }

  function _removeDepartment(uid: string) {
    departments.value.delete(uid);
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

  function addDepartment() {
    crudType.value = CRUDType.CREATE;
  }

  function editDepartment(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const department = departments.value.get(uid);
    selectedDepartment.value = department;
    form.value = <DepartmentCreate>{...selectedDepartment.value};
  }

  async function deleteDepartment(uid: string) {
    crudType.value = CRUDType.DELETE;
    const department = departments.value.get(uid);
    selectedDepartment.value = department;
    await deleteDBDepartment();
  }

  async function getManyDBDepartments() {
    departments.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DepartmentReadMany = response.data;
      data.result.forEach((dep) => departments.value.set(dep.uid, dep));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBDepartment() {
    // create department
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const department: DepartmentReadOne = response.data;
      departments.value.set(department.uid, department);
      Notify.create({
        color: 'positive',
        message: 'Successfully created department.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBDepartment() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedDepartment.value?.uid}`, form.value, config)
      const department: DepartmentReadOne = response.data;
      departments.value.set(department.uid, department);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated department'
      })

    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }


  async function deleteDBDepartment() {
    // delete department
    loading.value = true;
    try {
      if (selectedDepartment.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedDepartment.value.uid}`, config);
        _removeDepartment(selectedDepartment.value.uid);
        selectedDepartment.value = null;
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
      loading.value = false;
    }
  }

  async function downloadFile(fileType: DownloadFileType) {
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`department.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  return {
    departments,
    selectedDepartment,
    form,
    crudType,
    loading,
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
