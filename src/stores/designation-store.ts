import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DesignationReadOne, DesignationReadMany, DesignationCreate} from 'src/models/designation';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface DesignationState {
  designations: Map<string, DesignationReadOne>;
  selectedDesignation: DesignationReadOne | null | undefined;
  form: DesignationCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/designations';

export const useDesignationStore = defineStore('designation', () => {

  const authStore = useAuthStore();
  const config = {
    headers: {
      Authorization: `Bearer ${authStore.authState.access_token}`
    }
  }
  const state: DesignationState = reactive({
    designations: new Map(),
    selectedDesignation: null,
    form: {
      title: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const designationList = computed(() => {
    return Array.from(state.designations, entry => entry[1])
  })

  function resetForm() {
    state.form.title = '';
  }

  function _removeDesignation(uid: string) {
    state.designations.delete(uid);
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

  function addDesignation() {
    state.crudType = CRUDType.CREATE;
  }
  function editDesignation(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const designation = state.designations.get(uid);
    state.selectedDesignation = designation;
    state.form = <DesignationCreate>{...state.selectedDesignation}
  }

  async function deleteDesignation(uid: string) {
    state.crudType = CRUDType.DELETE
    const designation = state.designations.get(uid);
    state.selectedDesignation = designation;
    await deleteDBDesignation();
  }
  async function getManyDBDesignations() {
    state.designations = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DesignationReadMany = response.data;
      data.result.forEach((div) => state.designations.set(div.uid, div));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBDesignation() {
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const designation: DesignationReadOne = response.data;
      state.designations.set(designation.uid, designation);
      Notify.create({
        color: 'positive',
        message: 'Successfully created designation.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function updateDBDesignation() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedDesignation?.uid}`, state.form, config)
      const designation: DesignationReadOne = response.data;
      state.designations.set(designation.uid, designation);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated designation.'
      })

    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function deleteDBDesignation() {
    state.loading = true;
    try {
      if (state.selectedDesignation) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedDesignation.uid}`, config);
        _removeDesignation(state.selectedDesignation.uid);
        state.selectedDesignation = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted designation.'
        })
      } else {
        throw new Error('No designation selected')
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
      exportFile(`designations.${fileType}`, response.data)
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
