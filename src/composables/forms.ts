import {ref, Ref, onMounted, onUnmounted} from 'vue'
import {CRUDType} from 'src/models/common';

export function useForms<T>(props, emits) {

  const form: Ref<T> = ref({});
  const formRef = ref(null);
  const crudType = ref(CRUDType.CREATE)
  onMounted(() => {
    if (props.payload) {
      form.value = {...props.payload}
      crudType.value = CRUDType.UPDATE
    }
  })
  onUnmounted(() => form.value = {})

  async function onCreate() {
    const isValid = await formRef.value.validate()
    if (isValid) {
      emits('create', form.value);
    }
  }
  async function onUpdate() {
    const isValid = await formRef.value.validate()
    if (isValid) {
      emits('update', form.value)
    }
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
    formRef,
    onCreate,
    onUpdate,
    onReset,
    onCancel
  }
}
