import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useQuasar} from 'quasar';

export const useUiStore = defineStore('ui', () => {

  const $q = useQuasar();
  const leftDrawerOpen = ref(false);
  const darkMode = ref(true);

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  const toggleDark = () => {
    darkMode.value = !darkMode.value;
    $q.dark.set(darkMode.value);
  };


  return {
    leftDrawerOpen,
    toggleLeftDrawer,
    toggleDark,
    darkMode,
  };
});
