<template>
  <div v-if="childRows.length">
    <q-table bordered
             dense
             square
             :columns="childColumns"
             :rows="childRows"
             row-key="uid"
             flat
             @row-click="onSelect"
             separator="cell"
             :loading="loading">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="xs"
                 class="q-mx-xs"
                 color="primary"
                 icon="mode_edit"
                 @click="onEdit(props.row.uid)"></q-btn>
          <q-btn size="xs"
                 class="q-mx-xs"
                 color="primary"
                 icon="delete"
                 @click="onDelete(props.row.uid)"></q-btn>
        </q-td>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing
                         color="primary" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
export interface Props {
  childColumns: [],
  childRows: [],
  loading: boolean
}
const props = withDefaults(defineProps<Props>(), {
  childColumns: () => [],
  childRows: () => [],
})

function onSelect(evt, row) {
  console.log(row)
}
</script>
