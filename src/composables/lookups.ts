import {ref, computed} from 'vue';

export function useLookups() {

  const _genders = ref([
    {
      label: 'Male',
      value: 'm',
      color: 'blue',
      size: 'lg'
    },
    {
      label: 'Female',
      value: 'f',
      color: 'pink',
      size: 'lg'
    },
  ]);
  const _maritalStatus = ref([
    'single', 'married', 'divorced', 'widowed'
  ]);
  const _nationalService = ref([
    'released', 'exempted', 'serving'
  ])
  const _contractType = ref([
    'full time', 'part time'
  ])

  const gender = computed(() => _genders.value);
  const maritalStatus = computed(() => _maritalStatus.value)
  const nationalService = computed(() => _nationalService.value)
  const contractType = computed(() => _contractType.value)

  return {
    gender,
    maritalStatus,
    nationalService,
    contractType
  }
}
