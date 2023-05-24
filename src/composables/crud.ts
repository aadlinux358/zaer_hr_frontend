import {Ref, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useQuasar, format, useDialogPluginComponent} from 'quasar'
import {DownloadFileType} from 'src/models/common';
import {Store} from 'pinia';
export function useCrud<C, R>(store: Store | null) {
  const {capitalize} = format;
  if (!store) {
    throw new Error('invalid store')
  } else {
    const {
      dialogRef,
      onDialogHide,
      onDialogOK,
      onDialogCancel} = useDialogPluginComponent()
    const $q = useQuasar();
    const {t} = useI18n({useScope: 'global'})
    const selectedEntity: Ref<R | null> = ref(null)

    async function create(entity: C) {
      await store.createDB(entity)
      onDialogOK();
    }

    function add() {
      selectedEntity.value = null;
      dialogRef.value?.show()
    }

    function edit(entity: Readonly<R>) {
      selectedEntity.value = {...entity}
      dialogRef.value?.show()
    }

    async function update(entity: R) {
      await store.updateDB(entity);
      onDialogOK();
    }
    async function remove(uid: string) {
      $q.dialog({
        title: capitalize(t('delete')),
        message: capitalize(t('confirm_delete')),
        cancel: {
          push: true,
          label: t('cancel'),
          square: true,
          class: 'text-capitalize',
          color: 'red-14',
        },
        ok: {
          push: true,
          label: t('ok'),
          square: true,
          class: 'text-capitalize',
          color: 'red-14',
        },
        persistent: true,
      }).onOk(async () => {
        await store.deleteDB(uid);
        onDialogCancel()
      })
    }
    async function deactivate(uid: string) {
      $q.dialog({
        title: capitalize(t('deactivate')),
        message: capitalize(t('confirm_deactivate')),
        cancel: {
          push: true,
          label: t('cancel'),
          square: true,
          class: 'text-capitalize',
          color: 'red-14',
        },
        ok: {
          push: true,
          label: t('ok'),
          square: true,
          class: 'text-capitalize',
          color: 'red-14',
        },
        persistent: true
      }).onOk(async () => {
        await store.deactivate(uid)
        onDialogCancel()
      })
    }
    async function terminate(uid: string) {
      $q.dialog({
        title: capitalize(t('terminate')),
        message: capitalize(t('confirm_termination')),
        cancel: {
          push: true,
          label: t('cancel'),
          class: 'text-capitalize',
          square: true,
          color: 'red-14',
        },
        ok: {
          push: true,
          label: t('ok'),
          class: 'text-capitalize',
          square: true,
          color: 'red-14',
        },
        persistent: true
      }).onOk(async () => {
        await store.terminate(uid)
        onDialogCancel()
      })
    }
    function onCancel() {
      selectedEntity.value = null;
      onDialogCancel()
    }
    function onHide() {
      onDialogHide()
    }

    function downloadCSV() {
      store.downloadFile(DownloadFileType.CSV)
    }

    function downloadExcel() {
      store.downloadFile(DownloadFileType.EXCEL)
    }
    return {
      dialogRef,
      selectedEntity,
      create,
      add,
      edit,
      update,
      deactivate,
      terminate,
      remove,
      onCancel,
      onHide,
      downloadCSV,
      downloadExcel
    }
  }
}
