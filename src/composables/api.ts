import {hrApi} from 'src/boot/axios';
import {useFlags} from 'src/composables/flags';
import {useAuthStore} from 'src/stores/auth-store';
import {exportFile, Notify} from 'quasar';
import {DownloadFileType} from 'src/models/common';


export function useApiCrud<C, R, RM>(endpoint: string, entityMap: Map<string, R>, entityName: string) {

  // C => Type Create, R => Type ReadOne, RM => Type ReadMany

  const {AuthorizationHeader} = useAuthStore();
  const config = {
    headers: {
      Authorization: AuthorizationHeader
    }
  }
  const {loading, setError} = useFlags();
  async function getManyDB() {
    entityMap.clear()
    loading.value = true;
    try {
      const response = await hrApi.get(`${endpoint}`, config);
      const data: RM = response.data;
      data.result.forEach((entity: R) => entityMap.set(entity.uid, entity));
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function createDB(payload: C) {
    loading.value = true;
    try {
      const response = await hrApi.post(`${endpoint}`, payload, config);
      const entity: R = response.data;
      entityMap.set(entity.uid, entity);
      Notify.create({
        color: 'positive',
        message: `Successfully created ${entityName}.`
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function updateDB(entity: R) {
    loading.value = true;
    try {
      const response = await hrApi.patch(`${endpoint}/${entity.uid}`, entity, config)
      const updatedEntity: R = response.data;
      entityMap.set(updatedEntity.uid, updatedEntity);
      Notify.create({
        color: 'positive',
        message: `Successfully updated ${entityName}.`
      })

    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  async function deleteDB(entityUid: string) {
    loading.value = true;
    try {
      await hrApi.delete(`${endpoint}/${entityUid}`, config);
      entityMap.delete(entityUid)
      Notify.create({
        color: 'positive',
        message: `Successfully deleted ${entityName}.`
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function deactivateDB(entityUid: string) {
    loading.value = true
    try {
      const response = await hrApi.delete(`${endpoint}/deactivate/${entityUid}`, config)
      const deactivatedEntity: R = response.data;
      entityMap.set(deactivatedEntity.uid, deactivatedEntity);
      Notify.create({
        color: 'positive',
        message: `Successfully deactivated ${entityName}.`
      })
    } catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }
  async function terminateDB(payload: C) {
    try {
      const response = await hrApi.post(`${endpoint}/terminate`, payload, config);
      const entity: R = response.data;
      entityMap.set(entity.uid, entity);
      Notify.create({
        color: 'positive',
        message: `Successfully terminated ${entityName}.`
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
      const response = await hrApi.get(`${endpoint}/download/${fileType}`, Object.assign(config, {ResponseType: 'blob'}))
      exportFile(`${endpoint}.${fileType}`, response.data)
    }
    catch (err) {
      setError(err);
    }
    finally {
      loading.value = false;
    }
  }

  return {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deactivateDB,
    terminateDB,
    deleteDB,
    downloadFile,
  }
}
