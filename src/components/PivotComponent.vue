<template>
  <div ref="root"></div>
</template>

<script setup lang="ts">
import {onMounted, ref, onBeforeUpdate} from 'vue';
import WebDataRocks from 'webdatarocks';
const root = ref(null);

const props = defineProps({
  afterchartdraw: Function,
  aftergriddraw: Function,
  beforegriddraw: Function,
  beforetoolbarcreated: Function,
  cellclick: Function,
  celldoubleclick: Function,
  componentFolder: String,
  customizeCell: Function,
  customizeContextMenu: Function,
  datachanged: Function,
  dataerror: Function,
  datafilecancelled: Function,
  dataloaded: Function,
  fieldslistclose: Function,
  fieldslistopen: Function,
  filterclose: Function,
  filteropen: Function,
  fullscreen: Function,
  global: Object,
  height: [String, Number],
  loadingdata: Function,
  loadinglocalization: Function,
  loadingolapstructure: Function,
  loadingreportfile: Function,
  localizationerror: Function,
  localizationloaded: Function,
  olapstructureerror: Function,
  olapstructureloaded: Function,
  openingreportfile: Function,
  querycomplete: Function,
  queryerror: Function,
  ready: Function,
  report: [String, Object],
  reportchange: Function,
  reportcomplete: Function,
  reportfilecancelled: Function,
  reportfileerror: Function,
  reportfileloaded: Function,
  runningquery: Function,
  toolbar: Boolean,
  update: Function,
  width: [Number, String]
})
onMounted(() => {
  const webdatarocks = new WebDataRocks({
    ...props,
    container: root.value
  });
})
onBeforeUpdate(() => {
  return false;
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '/node_modules/webdatarocks/webdatarocks.min.css';
</style>
