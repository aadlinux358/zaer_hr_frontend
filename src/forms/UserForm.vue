<template>
  <q-card class="q-dialog-plugin">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 text-capitalize">{{ $t(crudType) }} {{ $t('user') }}</div>
      <q-space />
      <q-btn icon="close"
             flat
             round
             dense
             v-close-popup />
    </q-card-section>
    <q-card-section class="q-mt-md">
      <div class="q-pa-md"
           style="max-width: 400px">
        <q-form :autofocus="true"
                v-on:submit.prevent
                @reset="onReset"
                ref="formRef"
                class="q-gutter-md">
          <q-input square
                   filled
                   v-model="form.first_name"
                   label="First name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type first name']" />
          <q-input square
                   filled
                   v-model="form.last_name"
                   label="Last name"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type last name']" />
          <q-input square
                   filled
                   v-model="form.email"
                   label="Email"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type email address']" />
          <q-input square
                   filled
                   v-model="form.username"
                   label="Username"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Please type username']" />
          <q-input square
                   filled
                   v-model="form.password"
                   type="password"
                   label="Password"
                   lazy-rules
                   :hint="crudType === CRUDType.UPDATE ? 'Optional' : ''"
                   :rules="[val => val && val.length > 0 || (crudType === CRUDType.UPDATE) || 'Please type password']" />
          <div>
            <q-checkbox v-model="form.is_superuser"
                        label="Is Superuser?" />
          </div>
          <div>
            <q-checkbox v-model="form.is_staff"
                        label="Is Staff?" />
          </div>
          <div>

            <q-checkbox v-model="form.is_active"
                        label="Is Active?" />
          </div>
          <FormActionButtons @on-update="onUpdate"
                             @on-cancel="onCancel"
                             @on-delete="onDelete"
                             @on-create="onCreate"
                             :isUpdate="payload ? true : false" />
        </q-form>

      </div>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
import {useForms} from 'src/composables/forms';
import {AuthUserCreate, AuthUserReadOne} from 'src/models/auth-user'
import FormActionButtons from 'src/components/FormActionButtons.vue';
import {CRUDType} from 'src/models/common';
const emits = defineEmits(['create', 'update', 'delete', 'reset', 'cancel'])
const props = defineProps<{
  payload: AuthUserReadOne | null;
}>()

const {
  crudType,
  form,
  formRef,
  onCreate,
  onUpdate,
  onDelete,
  onReset,
  onCancel
} = useForms<AuthUserCreate>(props, emits)

</script>
