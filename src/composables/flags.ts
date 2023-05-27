import {ref} from 'vue'
import axios from 'axios';
import {Notify} from 'quasar';
import {isString} from 'src/utils/strings'

export function useFlags() {

  const loading = ref(false)
  const error = ref('')

  function setError(err: unknown) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        error.value = 'connection error.'
      } else {
        if (isString(err.response?.data.detail)) {
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
    error,
    setError
  }
}
