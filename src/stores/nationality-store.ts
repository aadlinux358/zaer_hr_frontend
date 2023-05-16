import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {NationalityReadOne, NationalityReadMany, NationalityCreate} from 'src/models/nationality';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/nationalities';

export const useNationalityStore = defineStore('nationality', () => {

  const {crudType, loading, error} = useFlags()
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const nationalities: Ref<Map<string, NationalityReadOne>> = ref(new Map())
  const selectedNationality: Ref<NationalityReadOne | null | undefined> = ref(null)
  const form: Ref<NationalityCreate> = ref({
    name: ''
  })

  // getters  and setters

  const nationalityList = computed(() => {
    return Array.from(nationalities.value, entry => entry[1])
  })

  function resetForm() {
    form.value.name = '';
  }

  function _removeNationality(uid: string) {
    nationalities.value.delete(uid);
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

  function addNationality() {
    crudType.value = CRUDType.CREATE;
  }
  function editNationality(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const nationality = nationalities.value.get(uid);
    selectedNationality.value = nationality;
    form.value = <NationalityCreate>{...selectedNationality.value}
  }

  async function deleteNationality(uid: string) {
    crudType.value = CRUDType.DELETE
    const nationality = nationalities.value.get(uid);
    selectedNationality.value = nationality;
    await deleteDBNationality();
  }
  async function getManyDBNationalities() {
    nationalities.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: NationalityReadMany = response.data;
      data.result.forEach((nat) => nationalities.value.set(nat.uid, nat));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function createDBNationality() {
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const nationality: NationalityReadOne = response.data;
      nationalities.value.set(nationality.uid, nationality);
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

  async function updateDBNationality() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedNationality.value?.uid}`, form.value, config)
      const nationality: NationalityReadOne = response.data;
      nationalities.value.set(nationality.uid, nationality);
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

  async function deleteDBNationality() {
    loading.value = true;
    try {
      if (selectedNationality.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedNationality.value.uid}`, config);
        _removeNationality(selectedNationality.value.uid);
        selectedNationality.value = null;
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
      exportFile(`nationalities.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    nationalities,
    selectedNationality,
    form,
    crudType,
    loading,
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
