import {computed, ref, Ref} from 'vue';
import {defineStore} from 'pinia';

import {authApi} from 'boot/axios';
import {AuthUserCreate, AuthUserReadOne, AuthUserReadMany} from 'src/models/auth-user';
import {useApiCrud} from 'src/composables/api';

const ENDPOINT = '/users'

export const useUserStore = defineStore('user', () => {
  const users: Ref<Map<string, AuthUserReadOne>> = ref(new Map());

  const userList = computed(() => {
    return Array.from(users.value, entry => entry[1])
  })

  const {
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  } = useApiCrud<AuthUserCreate, AuthUserReadOne, AuthUserReadMany>(
    ENDPOINT, users.value, 'user', authApi
  )

  return {
    users,
    userList,
    loading,
    getManyDB,
    createDB,
    updateDB,
    deleteDB,
    downloadFile
  };
});
