import {Ref, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useQuasar, useDialogPluginComponent} from 'quasar'
import {DownloadFileType} from 'src/models/common';
import {Store} from 'pinia';
export function useCrud<C, R>(store: Store) {

  const {
    dialogRef,
    onDialogHide,
    onDialogOK,
    onDialogCancel} = useDialogPluginComponent()
  const $q = useQuasar();
  const {t} = useI18n({useScope: 'global'})
  const selectedEntity: Ref<R | null> = ref(null)

  async function create(div: C) {
    await store.createDB(div)
    onDialogOK();
  }

  function add() {
    selectedEntity.value = null;
    dialogRef.value?.show()
  }

  function edit(div: Readonly<R>) {
    selectedEntity.value = {...div}
    dialogRef.value?.show()
  }

  async function update(div: R) {
    await store.updateDB(div);
    onDialogOK();
  }
  async function remove(uid: string) {
    $q.dialog({
      title: t('delete'),
      message: t('confirm_delete'),
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await store.deleteDB(uid);
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
    remove,
    onCancel,
    onHide,
    downloadCSV,
    downloadExcel
  }
}
