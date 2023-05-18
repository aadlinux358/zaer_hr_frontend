import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {EducationalLevelReadOne, EducationalLevelReadMany, EducationalLevelCreate} from 'src/models/educational-level';
import {useAuthStore} from './auth-store';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/educational-levels';

export const useEducationalLevelStore = defineStore('education', () => {

  const {crudType, loading, setError} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const educationalLevels: Ref<Map<string, EducationalLevelReadOne>> = ref(new Map())
  const selectedEducationalLevel: Ref<EducationalLevelReadOne | null | undefined> = ref(null);
  const form: Ref<EducationalLevelCreate> = ref({
    level: '',
    level_order: 0
  })


  const educationalLevelList = computed(() => {
    return Array.from(educationalLevels.value, entry => entry[1])
  })

  function resetForm() {
    form.value.level = '';
    form.value.level_order = 0;
  }

  function _removeEducationalLevel(uid: string) {
    educationalLevels.value.delete(uid);
  }

  function addEducationalLevel() {
    crudType.value = CRUDType.CREATE;
  }
  function editEducationalLevel(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const educational_level = educationalLevels.value.get(uid);
    selectedEducationalLevel.value = educational_level;
    console.log(selectedEducationalLevel.value)
    form.value = <EducationalLevelCreate>{...selectedEducationalLevel.value}
  }

  async function deleteEducationalLevel(uid: string) {
    crudType.value = CRUDType.DELETE
    const educational_level = educationalLevels.value.get(uid);
    selectedEducationalLevel.value = educational_level;
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
      setError(err);
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
      const educational_level: EducationalLevelReadOne = response.data;
      educationalLevels.value.set(educational_level.uid, educational_level);
      Notify.create({
        color: 'positive',
        message: 'Successfully created educational_level.'
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBEducationalLevel() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedEducationalLevel.value?.uid}`, form.value, config)
      const educational_level: EducationalLevelReadOne = response.data;
      educationalLevels.value.set(educational_level.uid, educational_level);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated educational_level.'
      })

    } catch (err) {
      setError(err);
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
          message: 'Successfully deleted educational_level.'
        })
      } else {
        throw new Error('No educational_level selected')
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
      exportFile(`educationalLevels.${fileType}`, response.data)
    }
    catch (err) {
      setError(err);
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
