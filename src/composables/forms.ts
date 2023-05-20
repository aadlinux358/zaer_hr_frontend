import {ref, Ref, onMounted, onUnmounted} from 'vue'
import {CRUDType} from 'src/models/common';

export function useForms<T>(props, emits) {

  const form: Ref<T> = ref({});

  const crudType = ref(CRUDType.CREATE)
  onMounted(() => {
    if (props.payload) {
      form.value = {...props.payload}
      crudType.value = CRUDType.UPDATE
    }
  })
  onUnmounted(() => form.value = {})

  function onCreate() {
    emits('create', form.value);
  }
  function onUpdate() {
    emits('update', form.value)
  }
  function onReset() {
    form.value = {};
  }
  function onCancel() {
    emits('cancel')
  }

  return {
    crudType,
    form,
    onCreate,
    onUpdate,
    onReset,
    onCancel
  }
}
