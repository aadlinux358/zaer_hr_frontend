import {Ref, ref} from 'vue';
import {defineStore} from 'pinia';
import {useStores} from 'src/composables/stores';
import {ChieldReadOne, ChildCreate} from 'src/models/child';

export const useChildStore = defineStore('child', () => {
  const {authStore} = useStores();
  const children: Ref<Map<string, ChieldReadOne>> = ref(new Map());
  const form: Ref<ChildCreate> = ref({
    parent_uid: '',
    first_name: '',
    gender: '',
    birth_date: ''
  })

  const config = {
    headers: {
      Authorization: authStore.AuthorizationHeader
    }
  }

  function createChild() {
    console.log(config)
  }
  return {
    children,
    form,
    createChild
  }
})
