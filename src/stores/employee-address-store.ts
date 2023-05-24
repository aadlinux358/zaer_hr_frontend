import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {useApiCrud} from 'src/composables/api';
import {AddressReadOne as R, AddressCreate as C, AddressReadMany as RM} from 'src/models/employee-address'

const ENDPOINT = '/employee/addresses';

export const useAddressStore = defineStore('address', () => {
  const addresses: Ref<Map<string, R>> = ref(new Map());

  const addressList = computed(() => {
    return Array.from(addresses.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  } = useApiCrud<C, R, RM>(ENDPOINT, addresses.value, 'address')

  return {
    addresses,
    addressList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
