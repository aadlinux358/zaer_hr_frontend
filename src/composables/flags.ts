import {CRUDType} from 'src/models/common'
import {Ref, ref} from 'vue'
import axios from 'axios';
import {Notify} from 'quasar';

export function useFlags() {

  const crudType: Ref<CRUDType> = ref(CRUDType.READ)
  const loading = ref(false)
  const error = ref('')

  function setError(err: unknown) {
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
  return {
    loading,
    crudType,
    error,
    setError
  }
}
