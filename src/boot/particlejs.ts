import {boot} from 'quasar/wrappers'
import Particles from 'vue3-particles';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({app}) => {
  app.use(Particles);
})
