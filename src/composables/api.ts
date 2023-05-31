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

  async function getById(uid: string) {
    console.log('Getting by id')
    loading.value = true;
    try {
      const response = await hrApi.get(`${endpoint}/${uid}`, config);
      const entity: R = response.data;
      entityMap.set(entity.uid, entity)
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
  async function activateDB(entityUid: string) {
    loading.value = true
    try {
      const new_config = {headers: {...config.headers, 'Content-Length': 0}};
      const response = await hrApi.post(`${endpoint}/activate/${entityUid}`, {}, new_config)
      const activatedEntity: R = response.data;
      entityMap.set(activatedEntity.uid, activatedEntity);
      Notify.create({
        color: 'positive',
        message: `Successfully activated ${entityName}.`
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
      const new_config = {headers: {...config.headers, 'Content-Length': 0}};
      const response = await hrApi.post(`${endpoint}/deactivate/${entityUid}`, {}, new_config)
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
    console.log('Terminating..')
    try {
      const response = await hrApi.post(`${endpoint}`, payload, config);
      const entity: R = response.data;
      entityMap.set(entity.uid, entity);
      await getById(payload.employee_uid);
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
    getById,
    createDB,
    updateDB,
    activateDB,
    deactivateDB,
    terminateDB,
    deleteDB,
    downloadFile,
  }
}
