import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {SectionReadOne, SectionReadMany, SectionCreate} from 'src/models/section';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/sections';

export const useSectionStore = defineStore('section', () => {

  const {crudType, loading, error} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const sections: Ref<Map<string, SectionReadOne>> = ref(new Map());
  const selectedSection: Ref<SectionReadOne | null | undefined> = ref(null)
  const form: Ref<SectionCreate> = ref({
    name: '',
    department_uid: ''
  })

  const sectionList = computed(() => {
    return Array.from(sections.value, entry => entry[1])
  })

  function resetForm() {
    form.value.department_uid = '';
    form.value.name = '';
  }

  function _removeSection(uid: string) {
    sections.value.delete(uid);
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

  function addSection() {
    crudType.value = CRUDType.CREATE;
  }

  function editSection(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const section = sections.value.get(uid);
    selectedSection.value = section;
    form.value = <SectionCreate>{...selectedSection.value};
  }

  async function deleteSection(uid: string) {
    crudType.value = CRUDType.DELETE;
    const section = sections.value.get(uid);
    selectedSection.value = section;
    await deleteDBSection();
  }

  async function getManyDBSections() {
    sections.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: SectionReadMany = response.data;
      data.result.forEach((dep) => sections.value.set(dep.uid, dep));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBSection() {
    // create section
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const section: SectionReadOne = response.data;
      sections.value.set(section.uid, section);
      Notify.create({
        color: 'positive',
        message: 'Successfully created section.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBSection() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedSection.value?.uid}`, form.value, config)
      const section: SectionReadOne = response.data;
      sections.value.set(section.uid, section);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated section'
      })

    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }


  async function deleteDBSection() {
    // delete section
    loading.value = true;
    try {
      if (selectedSection.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedSection.value.uid}`, config);
        _removeSection(selectedSection.value.uid);
        selectedSection.value = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted section.'
        })
      } else {
        throw new Error('No section selected')
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
      exportFile(`section.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  return {
    sections,
    selectedSection,
    loading,
    crudType,
    addSection,
    editSection,
    deleteSection,
    getManyDBSections,
    createDBSection,
    updateDBSection,
    deleteDBSection,
    downloadFile,
    sectionList,
    resetForm,
  }
})
