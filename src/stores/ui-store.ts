import {ref} from 'vue';
import {defineStore} from 'pinia';
import {useI18n} from 'vue-i18n';
import {useQuasar} from 'quasar';
import {AppLanguage} from 'src/models/common'


export const useUiStore = defineStore('ui', () => {

  const $q = useQuasar();
  const leftDrawerOpen = ref(false);
  const darkMode = ref(true);
  const selectedLanguage = ref('ENG')
  const {locale} = useI18n({useScope: 'global'})

  function toggleLeftDrawer() {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }

  const toggleDark = () => {
    darkMode.value = !darkMode.value;
    $q.dark.set(darkMode.value);
  };

  function setLanguage(lang: AppLanguage) {
    switch (lang) {
      case AppLanguage.ENG: {
        selectedLanguage.value = 'ENG';
        locale.value = 'en-US';
        break;
      }
      case AppLanguage.ITA: {
        selectedLanguage.value = 'ITA';
        locale.value = 'it-IT';
        break;
      }
      case AppLanguage.TIG: {
        selectedLanguage.value = 'TIG';
        locale.value = 'ti-ER'
        break;
      }
      default: {
        locale.value = 'en-US'
        break;
      }
    }
  }

  return {
    leftDrawerOpen,
    toggleLeftDrawer,
    toggleDark,
    darkMode,
    setLanguage,
    selectedLanguage
  };
});
