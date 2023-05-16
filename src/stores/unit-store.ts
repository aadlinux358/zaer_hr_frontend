import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {UnitReadOne, UnitReadMany, UnitCreate} from 'src/models/unit';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';


const ENDPOINT = '/units';

export const useUnitStore = defineStore('unit', () => {

  const {crudType, loading, error} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const units: Ref<Map<string, UnitReadOne>> = ref(new Map());
  const selectedUnit: Ref<UnitReadOne | null | undefined> = ref(null);
  const form: Ref<UnitCreate> = ref({
    name: '',
    section_uid: ''
  })
  const unitList = computed(() => {
    return Array.from(units.value, entry => entry[1])
  })



  function resetForm() {
    form.value.name = '';
    form.value.section_uid = '';
  }

  function _removeUnit(uid: string) {
    units.value.delete(uid);
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

  function addUnit() {
    crudType.value = CRUDType.CREATE;
  }

  function editUnit(uid: string) {
    crudType.value = CRUDType.UPDATE;
    const unit = units.value.get(uid);
    selectedUnit.value = unit;
    form.value = <UnitCreate>{...selectedUnit.value};
  }

  async function deleteUnit(uid: string) {
    crudType.value = CRUDType.DELETE;
    const unit = units.value.get(uid);
    selectedUnit.value = unit;
    await deleteDBUnit();
  }

  async function getManyDBUnits() {
    units.value.clear();
    loading.value = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: UnitReadMany = response.data;
      data.result.forEach((dep) => units.value.set(dep.uid, dep));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDBUnit() {
    // create unit
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, form.value, config);
      resetForm();
      const unit: UnitReadOne = response.data;
      units.value.set(unit.uid, unit);
      Notify.create({
        color: 'positive',
        message: 'Successfully created unit.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDBUnit() {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${selectedUnit.value?.uid}`, form.value, config)
      const unit: UnitReadOne = response.data;
      units.value.set(unit.uid, unit);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated unit'
      })

    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }


  async function deleteDBUnit() {
    // delete unit
    loading.value = true;
    try {
      if (selectedUnit.value) {
        await hrApi.delete(`${ENDPOINT}/${selectedUnit.value.uid}`, config);
        _removeUnit(selectedUnit.value.uid);
        selectedUnit.value = null;
        Notify.create({
          color: 'positive',
          message: 'Successfully deleted unit.'
        })
      } else {
        throw new Error('No unit selected')
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
      exportFile(`unit.${fileType}`, response.data)
    }
    catch (err) {
      _setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  return {
    units,
    selectedUnit,
    crudType,
    loading,
    form,
    addUnit,
    editUnit,
    deleteUnit,
    getManyDBUnits,
    createDBUnit,
    updateDBUnit,
    deleteDBUnit,
    downloadFile,
    unitList,
    resetForm,
  }
})
