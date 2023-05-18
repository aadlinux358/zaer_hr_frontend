import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DesignationReadOne, DesignationReadMany, DesignationCreate} from 'src/models/designation';
import {useAuthStore} from './auth-store';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/designations';

export const useDesignationStore = defineStore('designation', () => {

  const {crudType, loading, setError} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const designations: Ref<Map<string, DesignationReadOne>> = ref(new Map())
  const selectedDesignation: Ref<DesignationReadOne | null | undefined> = ref(null);
  const form: Ref<DesignationCreate> = ref({
    title: ''
  })

  const designationList = computed(() => {
    return Array.from(designations.value, entry => entry[1])
  })

  function resetForm() {
    form.value.title = '';
  }

  function _removeDesignation(uid: string) {
    designations.value.delete(uid);
  }

  function addDesignation() {
    crudType.value = CRUDType.CREATE;
  }
  function editDesignation(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const designation = designations.value.get(uid);
    selectedDesignation.value = designation;
    form.value = <DesignationCreate>{...selectedDesignation.value}
  }

  async function deleteDesignation(uid: string) {
    crudType.value = CRUDType.DELETE
    const designation = designations.value.get(uid);
    selectedDesignation.value = designation;
    await deleteDBDesignation();
  }
  async function getManyDBDesignations() {
    designations.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DesignationReadMany = response.data;
      data.result.forEach((div) => designations.value.set(div.uid, div));
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBDesignation() {
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const designation: DesignationReadOne = response.data;
      designations.value.set(designation.uid, designation);
      Notify.create({
        color: 'positive',
        message: 'Successfully created designation.'
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBDesignation() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedDesignation.value?.uid}`, form.value, config)
      const designation: DesignationReadOne = response.data;
      designations.value.set(designation.uid, designation);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated designation.'
      })

    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function deleteDBDesignation() {
    loading.value = true;
    try {
      if (selectedDesignation.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedDesignation.value.uid}`, config);
        _removeDesignation(selectedDesignation.value.uid);
        selectedDesignation.value = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted designation.'
        })
      } else {
        throw new Error('No designation selected')
      }
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
      exportFile(`designations.${fileType}`, response.data)
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    designations,
    selectedDesignation,
    form,
    crudType,
    loading,
    addDesignation,
    editDesignation,
    deleteDesignation,
    getManyDBDesignations,
    createDBDesignation,
    updateDBDesignation,
    deleteDBDesignation,
    downloadFile,
    designationList,
    resetForm,
  }
})
