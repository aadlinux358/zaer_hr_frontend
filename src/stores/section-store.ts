import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {SectionReadOne, SectionReadMany, SectionCreate} from 'src/models/section';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface SectionState {
  sections: Map<string, SectionReadOne>;
  selectedSection: SectionReadOne | null | undefined;
  form: SectionCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/sections';

export const useSectionStore = defineStore('section', () => {

  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const state: SectionState = reactive({
    sections: new Map(),
    selectedSection: null,
    form: {
      name: '',
      department_uid: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const sectionList = computed(() => {
    return Array.from(state.sections, entry => entry[1])
  })

  function resetForm() {
    state.form.department_uid = '';
    state.form.name = '';
  }

  function _removeSection(uid: string) {
    state.sections.delete(uid);
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

  function addSection() {
    state.crudType = CRUDType.CREATE;
  }

  function editSection(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const section = state.sections.get(uid);
    state.selectedSection = section;
    state.form = <SectionCreate>{...state.selectedSection};
  }

  async function deleteSection(uid: string) {
    state.crudType = CRUDType.DELETE;
    const section = state.sections.get(uid);
    state.selectedSection = section;
    await deleteDBSection();
  }

  async function getManyDBSections() {
    state.sections = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: SectionReadMany = response.data;
      data.result.forEach((dep) => state.sections.set(dep.uid, dep));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBSection() {
    // create section
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const section: SectionReadOne = response.data;
      state.sections.set(section.uid, section);
      Notify.create({
        color: 'positive',
        message: 'Successfully created section.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function updateDBSection() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedSection?.uid}`, state.form, config)
      const section: SectionReadOne = response.data;
      state.sections.set(section.uid, section);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated section'
      })

    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }


  async function deleteDBSection() {
    // delete section
    state.loading = true;
    try {
      if (state.selectedSection) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedSection.uid}`, config);
        _removeSection(state.selectedSection.uid);
        state.selectedSection = null;
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
      state.loading = false;
    }
  }

  async function downloadFile(fileType: DownloadFileType) {
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`section.${fileType}`, response.data)
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
