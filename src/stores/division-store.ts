import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';
import {exportFile, Notify} from 'quasar';
import {hrApi} from 'src/boot/axios';
import {DivisionReadOne, DivisionReadMany, DivisionCreate} from 'src/models/division';
import {useAuthStore} from './auth-store';
import {DownloadFileType} from 'src/models/common';
import {useFlags} from 'src/composables/flags';

const ENDPOINT = '/divisions';

export const useDivisionStore = defineStore('division', () => {

  const {loading, setError} = useFlags();
  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }

  const divisions: Ref<Map<string, Readonly<DivisionReadOne>>> = ref(new Map());

  const divisionList = computed(() => {
    return Array.from(divisions.value, entry => entry[1])
  })

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
  async function createDBDivision(div: DivisionCreate) {
    loading.value = true;
    try {
      const response = await hrApi.post(`${ENDPOINT}`, div, config);
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

  async function updateDBDivision(div: DivisionReadOne) {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${ENDPOINT}/${div.uid}`, div, config)
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

  async function deleteDBDivision(divUid: string) {
    loading.value = true;
    try {
      await hrApi.delete(`${ENDPOINT}/${divUid}`, config);
      divisions.value.delete(divUid)
      Notify.create({
        color: 'positive',
        message: 'Successfully deleted division.'
      })
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
    loading,
    getManyDBDivisions,
    createDBDivision,
    updateDBDivision,
    deleteDBDivision,
    downloadFile,
    divisionList,
  }
})
