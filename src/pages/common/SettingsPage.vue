<template>
  <q-toggle v-model="uiStore.dense"
            checked-icon="check"
            color="primary"
            label="Dense mode"
            unchecked-icon="clear" />
</template>
<script setup lang="ts">
import {useStores} from 'src/composables/stores';
const {uiStore} = useStores();
</script>
