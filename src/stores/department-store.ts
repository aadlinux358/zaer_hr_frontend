import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DepartmentReadOne, DepartmentReadMany, DepartmentCreate} from 'src/models/department';
import {useAuthStore} from './auth-store';
import {DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/departments';

export const useDepartmentStore = defineStore('department', () => {


  const {AuthorizationHeader} = useAuthStore();
  const {loading, setError} = useFlags();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const departments: Ref<Map<string, DepartmentReadOne>> = ref(new Map())

  const departmentList = computed(() => {
    return Array.from(departments.value, entry => entry[1])
  })

  async function getManyDB() {
    departments.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DepartmentReadMany = response.data;
      data.result.forEach((dep) => departments.value.set(dep.uid, dep));
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDB(dep: DepartmentCreate) {
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, dep, config);
      const department: DepartmentReadOne = response.data;
      departments.value.set(department.uid, department);
      Notify.create({
        color: 'positive',
        message: 'Successfully created department.'
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDB(dep: DepartmentReadOne) {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${dep.uid}`, dep, config)
      const department: DepartmentReadOne = response.data;
      departments.value.set(department.uid, department);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated department'
      })

    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }


  async function deleteDB(depUid: string) {
    loading.value = true;
    try {
      await hrApi.delete(`${ENDPOINT}/${depUid}`, config);
      departments.value.delete(depUid)
      Notify.create({
        color: 'positive',
        message: 'Successfully deleted department.'
      })
    } catch (err) {
      setError(err);
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
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
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
