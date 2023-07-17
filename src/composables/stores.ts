import {onMounted} from 'vue';
import {useQuasar} from 'quasar';
import {useUiStore} from 'src/stores/ui-store';
import {useDivisionStore} from 'src/stores/division-store';
import {useDepartmentStore} from 'src/stores/department-store';
import {useSectionStore} from 'src/stores/section-store';
import {useUnitStore} from 'src/stores/unit-store';
import {useDesignationStore} from 'src/stores/designation-store';
import {useEducationalLevelStore} from 'src/stores/educational-level-store';
import {useNationalityStore} from 'src/stores/nationality-store';
import {useEmployeeStore} from 'src/stores/employee-store';
import {useAuthStore} from 'src/stores/auth-store';
import {useUserStore} from 'src/stores/user-store';
import {useChildStore} from 'src/stores/employee-child-store';
import {useContactStore} from 'src/stores/employee-contact-person-store';
import {useAddressStore} from 'src/stores/employee-address-store';
import {useTerminationStore} from 'src/stores/termination-store';
import {useCountryStore} from 'src/stores/country-store'
export function useStores() {
  const $q = useQuasar();
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const uiStore = useUiStore();
  const divisionStore = useDivisionStore();
  const departmentStore = useDepartmentStore();
  const sectionStore = useSectionStore();
  const unitStore = useUnitStore();
  const designationStore = useDesignationStore();
  const eduStore = useEducationalLevelStore()
  const countryStore = useCountryStore();
  const nationalityStore = useNationalityStore()
  const empStore = useEmployeeStore();
  const childStore = useChildStore();
  const contactStore = useContactStore();
  const addressStore = useAddressStore();
  const terminationStore = useTerminationStore();

  async function hydrateStore() {
    $q.loading.show();
    if (userStore.users.size === 0) {
      await userStore.getManyDB();
    }
    if (divisionStore.divisions.size === 0) {
      await divisionStore.getManyDB();
    }
    if (departmentStore.departments.size === 0) {
      await departmentStore.getManyDB();
    }
    if (sectionStore.sections.size == 0) {
      await sectionStore.getManyDB();
    }
    if (unitStore.units.size === 0) {
      await unitStore.getManyDB();
    }
    if (designationStore.designations.size === 0) {
      await designationStore.getManyDB();
    }
    if (countryStore.countries.size === 0) {
      await countryStore.getManyDB();
    }
    if (nationalityStore.nationalities.size === 0) {
      await nationalityStore.getManyDB();
    }
    if (eduStore.educationalLevels.size == 0) {
      await eduStore.getManyDB();
    }
    if (empStore.employees.size === 0) {
      await empStore.getManyDB();
    }
    if (childStore.children.size === 0) {
      await childStore.getManyDB();
    }
    if (addressStore.addresses.size === 0) {
      await addressStore.getManyDB();
    }
    if (contactStore.contacts.size === 0) {
      await contactStore.getManyDB();
    }
    if (terminationStore.terminations.size === 0) {
      await terminationStore.getManyDB();
    }
    $q.loading.hide();
  }
  onMounted(async () => {
    await hydrateStore();
  });
  return {
    hydrateStore,
    authStore,
    userStore,
    uiStore,
    divisionStore,
    departmentStore,
    sectionStore,
    unitStore,
    designationStore,
    eduStore,
    countryStore,
    nationalityStore,
    empStore,
    childStore,
    contactStore,
    addressStore,
    terminationStore,
  }
}
