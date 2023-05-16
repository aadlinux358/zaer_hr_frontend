import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {EducationalLevelReadOne, EducationalLevelReadMany, EducationalLevelCreate} from 'src/models/educational-level';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/educational-levels';

export const useEducationalLevelStore = defineStore('education', () => {

  const {crudType, loading, error} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const educationalLevels: Ref<Map<string, EducationalLevelReadOne>> = ref(new Map())
  const selectedEducationalLevel: Ref<EducationalLevelReadOne | null | undefined> = ref(null);
  const form: Ref<EducationalLevelCreate> = ref({
    level: ''
  })


  const educationalLevelList = computed(() => {
    return Array.from(educationalLevels.value, entry => entry[1])
  })

  function resetForm() {
    form.value.level = '';
  }

  function _removeEducationalLevel(uid: string) {
    educationalLevels.value.delete(uid);
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

  function addEducationalLevel() {
    crudType.value = CRUDType.CREATE;
  }
  function editEducationalLevel(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const nationality = educationalLevels.value.get(uid);
    selectedEducationalLevel.value = nationality;
    form.value = <EducationalLevelCreate>{...selectedEducationalLevel.value}
  }

  async function deleteEducationalLevel(uid: string) {
    crudType.value = CRUDType.DELETE
    const nationality = educationalLevels.value.get(uid);
    selectedEducationalLevel.value = nationality;
    await deleteDBEducationalLevel();
  }
  async function getManyDBEducationalLevels() {
    educationalLevels.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: EducationalLevelReadMany = response.data;
      data.result.forEach((edu) => educationalLevels.value.set(edu.uid, edu));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBEducationalLevel() {
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const nationality: EducationalLevelReadOne = response.data;
      educationalLevels.value.set(nationality.uid, nationality);
      Notify.create({
        color: 'positive',
        message: 'Successfully created nationality.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBEducationalLevel() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedEducationalLevel.value?.uid}`, form.value, config)
      const nationality: EducationalLevelReadOne = response.data;
      educationalLevels.value.set(nationality.uid, nationality);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated nationality.'
      })

    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function deleteDBEducationalLevel() {
    loading.value = true;
    try {
      if (selectedEducationalLevel.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedEducationalLevel.value.uid}`, config);
        _removeEducationalLevel(selectedEducationalLevel.value.uid);
        selectedEducationalLevel.value = null;
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
      loading.value = false;
    }
  }

  async function downloadFile(fileType: DownloadFileType) {
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`educationalLevels.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    educationalLevels,
    selectedEducationalLevel,
    form,
    crudType,
    loading,
    addEducationalLevel,
    editEducationalLevel,
    deleteEducationalLevel,
    getManyDBEducationalLevels,
    createDBEducationalLevel,
    updateDBEducationalLevel,
    deleteDBEducationalLevel,
    downloadFile,
    educationalLevelList,
    resetForm,
  }
})
