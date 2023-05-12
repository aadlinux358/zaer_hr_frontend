import {computed, reactive} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {UnitReadOne, UnitReadMany, UnitCreate} from 'src/models/unit';
import {useAuthStore} from './auth-store';
import axios from 'axios';
import {CRUDType, DownloadFileType} from 'src/models/common';

export interface UnitState {
  units: Map<string, UnitReadOne>;
  selectedUnit: UnitReadOne | null | undefined;
  form: UnitCreate;
  crudType: CRUDType;
  loading: boolean;
  error: string;
}

const ENDPOINT = '/units';

export const useUnitStore = defineStore('unit', () => {

  const authStore = useAuthStore();
  const config = {
    headers: {
      Authorization: `Bearer ${authStore.authState.access_token}`
    }
  }
  const state: UnitState = reactive({
    units: new Map(),
    selectedUnit: null,
    form: {
      name: '',
      section_uid: ''
    },
    crudType: CRUDType.READ,
    loading: false,
    error: ''
  })

  const unitList = computed(() => {
    return Array.from(state.units, entry => entry[1])
  })

  function resetForm() {
    state.form.name = '';
    state.form.section_uid = '';
  }

  function _removeUnit(uid: string) {
    state.units.delete(uid);
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

  function addUnit() {
    state.crudType = CRUDType.CREATE;
  }

  function editUnit(uid: string) {
    state.crudType = CRUDType.UPDATE;
    const unit = state.units.get(uid);
    state.selectedUnit = unit;
    state.form = <UnitCreate>{...state.selectedUnit};
  }

  async function deleteUnit(uid: string) {
    state.crudType = CRUDType.DELETE;
    const unit = state.units.get(uid);
    state.selectedUnit = unit;
    await deleteDBUnit();
  }

  async function getManyDBUnits() {
    state.units = new Map();
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}`, config);
      const data: UnitReadMany = response.data;
      data.result.forEach((dep) => state.units.set(dep.uid, dep));
    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }
  async function createDBUnit() {
    // create unit
    state.loading = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, state.form, config);
      resetForm();
      const unit: UnitReadOne = response.data;
      state.units.set(unit.uid, unit);
      Notify.create({
        color: 'positive',
        message: 'Successfully created unit.'
      })
    } catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }

  async function updateDBUnit() {
    state.loading = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${state.selectedUnit?.uid}`, state.form, config)
      const unit: UnitReadOne = response.data;
      state.units.set(unit.uid, unit);
      Notify.create({
        color: 'positive',
        message: 'Successfully updated unit'
      })

    }
    catch (err) {
      _setError(err);
    }
    finally {
      state.loading = false;
    }
  }


  async function deleteDBUnit() {
    // delete unit
    state.loading = true;
    try {
      if (state.selectedUnit) {
        await hrApi.delete(`${ENDPOINT}/${state.selectedUnit.uid}`, config);
        _removeUnit(state.selectedUnit.uid);
        state.selectedUnit = null;
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
      state.loading = false;
    }
  }

  async function downloadFile(fileType: DownloadFileType) {
    state.loading = true;
    try {
      const response = await hrApi.get(`${ENDPOINT}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`unit.${fileType}`, response.data)
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
