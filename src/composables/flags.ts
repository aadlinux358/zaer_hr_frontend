import {CRUDType} from 'src/models/common'
import {Ref, ref} from 'vue'


export function useFlags() {

  const crudType: Ref<CRUDType> = ref(CRUDType.READ)
  const loading = ref(false)
  const error = ref('')

  return {
    loading,
    crudType,
    error,
  }
}
