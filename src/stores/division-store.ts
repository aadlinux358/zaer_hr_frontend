import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DivisionReadOne, DivisionReadMany, DivisionCreate} from 'src/models/division';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface DivisionState {
  divisions: Map<string, DivisionReadOne>;
  selectedDivision: DivisionReadOne | null | undefined;
  form: DivisionCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/divisions';

export const useDivisionStore = defineStore('division', () => {

  const authStore = useAuthStore();
  const config = {
    headers: {
      Authorization: `Bearer ${authStore.authState.access_token}`
    }
  }
  const state: DivisionState = reactive({
    divisions: new Map(),
    selectedDivision: null,
    form: {
      name: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const divisionList = computed(() => {
    return Array.from(state.divisions, entry => entry[1])
  })

  function resetForm() {
    state.form.name = '';
  }

  function _removeDivision(uid: string) {
    state.divisions.delete(uid);
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

  function addDivision() {
    state.crudType = CRUDType.CREATE;
  }
  function editDivision(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const division = state.divisions.get(uid);
    state.selectedDivision = division;
    state.form = <DivisionCreate>{...state.selectedDivision}
  }

  async function deleteDivision(uid: string) {
    state.crudType = CRUDType.DELETE
    const division = state.divisions.get(uid);
    state.selectedDivision = division;
    await deleteDBDivision();
  }
  async function getManyDBDivisions() {
    state.divisions = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DivisionReadMany = response.data;
      data.result.forEach((div) => state.divisions.set(div.uid, div));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBDivision() {
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const division: DivisionReadOne = response.data;
      state.divisions.set(division.uid, division);
      Notify.create({
        color: 'positive',
        message: 'Successfully created division.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function updateDBDivision() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedDivision?.uid}`, state.form, config)
      const division: DivisionReadOne = response.data;
      state.divisions.set(division.uid, division);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated division.'
      })

    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function deleteDBDivision() {
    state.loading = true;
    try {
      if (state.selectedDivision) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedDivision.uid}`, config);
        _removeDivision(state.selectedDivision.uid);
        state.selectedDivision = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted division.'
        })
      } else {
        throw new Error('No division selected')
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
      exportFile(`divisions.${fileType}`, response.data)
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
    addDivision,
    editDivision,
    deleteDivision,
    getManyDBDivisions,
    createDBDivision,
    updateDBDivision,
    deleteDBDivision,
    downloadFile,
    divisionList,
    resetForm,
  }
})
