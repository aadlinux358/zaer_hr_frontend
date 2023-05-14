import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {NationalityReadOne, NationalityReadMany, NationalityCreate} from 'src/models/nationality';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface NationalityState {
  nationalities: Map<string, NationalityReadOne>;
  selectedNationality: NationalityReadOne | null | undefined;
  form: NationalityCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/nationalities';

export const useNationalityStore = defineStore('nationality', () => {

  const authStore = useAuthStore();
  const config = {
    headers: {
      Authorization: `Bearer ${authStore.authState.access_token}`
    }
  }
  const state: NationalityState = reactive({
    nationalities: new Map(),
    selectedNationality: null,
    form: {
      name: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const nationalityList = computed(() => {
    return Array.from(state.nationalities, entry => entry[1])
  })

  function resetForm() {
    state.form.name = '';
  }

  function _removeNationality(uid: string) {
    state.nationalities.delete(uid);
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

  function addNationality() {
    state.crudType = CRUDType.CREATE;
  }
  function editNationality(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const nationality = state.nationalities.get(uid);
    state.selectedNationality = nationality;
    state.form = <NationalityCreate>{...state.selectedNationality}
  }

  async function deleteNationality(uid: string) {
    state.crudType = CRUDType.DELETE
    const nationality = state.nationalities.get(uid);
    state.selectedNationality = nationality;
    await deleteDBNationality();
  }
  async function getManyDBNationalities() {
    state.nationalities = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: NationalityReadMany = response.data;
      data.result.forEach((nat) => state.nationalities.set(nat.uid, nat));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBNationality() {
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const nationality: NationalityReadOne = response.data;
      state.nationalities.set(nationality.uid, nationality);
      Notify.create({
        color: 'positive',
        message: 'Successfully created nationality.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function updateDBNationality() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedNationality?.uid}`, state.form, config)
      const nationality: NationalityReadOne = response.data;
      state.nationalities.set(nationality.uid, nationality);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated nationality.'
      })

    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function deleteDBNationality() {
    state.loading = true;
    try {
      if (state.selectedNationality) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedNationality.uid}`, config);
        _removeNationality(state.selectedNationality.uid);
        state.selectedNationality = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted nationality.'
        })
      } else {
        throw new Error('No nationality selected')
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
      exportFile(`nationalities.${fileType}`, response.data)
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
    addNationality,
    editNationality,
    deleteNationality,
    getManyDBNationalities,
    createDBNationality,
    updateDBNationality,
    deleteDBNationality,
    downloadFile,
    nationalityList,
    resetForm,
  }
})
