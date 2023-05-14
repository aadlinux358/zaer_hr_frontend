import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {EducationalLevelReadOne, EducationalLevelReadMany, EducationalLevelCreate} from 'src/models/educational-level';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface EducationalLevelState {
  educationalLevels: Map<string, EducationalLevelReadOne>;
  selectedEducationalLevel: EducationalLevelReadOne | null | undefined;
  form: EducationalLevelCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/educational-levels';

export const useEducationalLevelStore = defineStore('education', () => {

  const authStore = useAuthStore();
  const config = {
    headers: {
      Authorization: `Bearer ${authStore.authState.access_token}`
    }
  }
  const state: EducationalLevelState = reactive({
    educationalLevels: new Map(),
    selectedEducationalLevel: null,
    form: {
      level: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const educationalLevelList = computed(() => {
    return Array.from(state.educationalLevels, entry => entry[1])
  })

  function resetForm() {
    state.form.level = '';
  }

  function _removeEducationalLevel(uid: string) {
    state.educationalLevels.delete(uid);
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

  function addEducationalLevel() {
    state.crudType = CRUDType.CREATE;
  }
  function editEducationalLevel(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const nationality = state.educationalLevels.get(uid);
    state.selectedEducationalLevel = nationality;
    state.form = <EducationalLevelCreate>{...state.selectedEducationalLevel}
  }

  async function deleteEducationalLevel(uid: string) {
    state.crudType = CRUDType.DELETE
    const nationality = state.educationalLevels.get(uid);
    state.selectedEducationalLevel = nationality;
    await deleteDBEducationalLevel();
  }
  async function getManyDBNationalities() {
    state.educationalLevels = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: EducationalLevelReadMany = response.data;
      data.result.forEach((nat) => state.educationalLevels.set(nat.uid, nat));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBEducationalLevel() {
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const nationality: EducationalLevelReadOne = response.data;
      state.educationalLevels.set(nationality.uid, nationality);
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

  async function updateDBEducationalLevel() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedEducationalLevel?.uid}`, state.form, config)
      const nationality: EducationalLevelReadOne = response.data;
      state.educationalLevels.set(nationality.uid, nationality);
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

  async function deleteDBEducationalLevel() {
    state.loading = true;
    try {
      if (state.selectedEducationalLevel) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedEducationalLevel.uid}`, config);
        _removeEducationalLevel(state.selectedEducationalLevel.uid);
        state.selectedEducationalLevel = null;
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
      exportFile(`educationalLevels.${fileType}`, response.data)
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
    addEducationalLevel,
    editEducationalLevel,
    deleteEducationalLevel,
    getManyDBNationalities,
    createDBEducationalLevel,
    updateDBEducationalLevel,
    deleteDBEducationalLevel,
    downloadFile,
    educationalLevelList,
    resetForm,
  }
})
