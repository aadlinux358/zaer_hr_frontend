import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DivisionReadOne, DivisionReadMany, DivisionCreate} from 'src/models/division';
import {useAuthStore} from './auth-store';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/divisions';

export const useDivisionStore = defineStore('division', () => {

  const {crudType, loading, setError} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const divisions: Ref<Map<string, DivisionReadOne>> = ref(new Map());
  const selectedDivision: Ref<DivisionReadOne | null | undefined> = ref(null);
  const form: Ref<DivisionCreate> = ref({
    name: ''
  });


  const divisionList = computed(() => {
    return Array.from(divisions.value, entry => entry[1])
  })


  function resetForm() {
    form.value.name = '';
  }

  function _removeDivision(uid: string) {
    divisions.value.delete(uid);
  }

  function addDivision() {
    crudType.value = CRUDType.CREATE;
  }
  function editDivision(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const division = divisions.value.get(uid);
    selectedDivision.value = division;
    form.value = <DivisionCreate>{...selectedDivision.value}
  }

  async function deleteDivision(uid: string) {
    crudType.value = CRUDType.DELETE
    const division = divisions.value.get(uid);
    selectedDivision.value = division;
    await deleteDBDivision();
  }
  async function getManyDBDivisions() {
    divisions.value.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: DivisionReadMany = response.data;
      data.result.forEach((div) => divisions.value.set(div.uid, div));
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBDivision() {
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const division: DivisionReadOne = response.data;
      divisions.value.set(division.uid, division);
      Notify.create({
        color: 'positive',
        message: 'Successfully created division.'
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBDivision() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedDivision.value?.uid}`, form.value, config)
      const division: DivisionReadOne = response.data;
      divisions.value.set(division.uid, division);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated division.'
      })

    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function deleteDBDivision() {
    loading.value = true;
    try {
      if (selectedDivision.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedDivision.value.uid}`, config);
        _removeDivision(selectedDivision.value.uid);
        selectedDivision.value = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted division.'
        })
      } else {
        throw new Error('No division selected')
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
      exportFile(`divisions.${fileType}`, response.data)
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    divisions,
    selectedDivision,
    form,
    crudType,
    loading,
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
