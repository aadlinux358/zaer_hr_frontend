import {computed, Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {useApiCrud} from 'src/composables/api';
import {ContactPersonReadOne as R, ContactPersonCreate as C, ContactPersonReadMany as RM} from 'src/models/employee-contact-person';

const ENDPOINT = '/employee/contact-persons';

export const useContactStore = defineStore('contact', () => {
  const contacts: Ref<Map<string, R>> = ref(new Map());

  const contactList = computed(() => {
    return Array.from(contacts.value, entry => entry[1])
  })
  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  } = useApiCrud<C, R, RM>(ENDPOINT, contacts.value, 'contact_person')

  return {
    contacts,
    contactList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile,
  }
})
