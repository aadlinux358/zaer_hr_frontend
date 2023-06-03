<template>
  <q-item clickable
          :dense="smallIcon"
          tag="a"
          :to="{name: link}">
    <q-item-section v-if="icon"
                    avatar>
      <q-icon v-if="!smallIcon"
              :name="icon" />
      <q-icon v-if="smallIcon"
              :name="icon"
              size="xs" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-capitalize">{{ $t(title) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
  smallIcon?: boolean
}
withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  smallIcon: false,
});
</script>
