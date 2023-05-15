import {onMounted} from 'vue';
import {useQuasar} from 'quasar';
import {useDivisionStore} from 'src/stores/division-store';
import {useDepartmentStore} from 'src/stores/department-store';
import {useSectionStore} from 'src/stores/section-store';
import {useUnitStore} from 'src/stores/unit-store';
import {useDesignationStore} from 'src/stores/designation-store';
import {useEducationalLevelStore} from 'src/stores/educational-level-store';
import {useNationalityStore} from 'src/stores/nationality-store';
import {useEmployeeStore} from 'src/stores/employee-store';

export function useStores() {
  const $q = useQuasar();
  const divisionStore = useDivisionStore();
  const departmentStore = useDepartmentStore();
  const sectionStore = useSectionStore();
  const unitStore = useUnitStore();
  const designationStore = useDesignationStore();
  const eduStore = useEducationalLevelStore()
  const nationalityStore = useNationalityStore()
  const empStore = useEmployeeStore();

  onMounted(async () => {
    $q.loading.show();
    if (divisionStore.state.divisions.size === 0) {
      await divisionStore.getManyDBDivisions();
    }
    if (departmentStore.state.departments.size === 0) {
      await departmentStore.getManyDBDepartments();
    }
    if (sectionStore.state.sections.size == 0) {
      await sectionStore.getManyDBSections();
    }
    if (unitStore.state.units.size === 0) {
      await unitStore.getManyDBUnits();
    }
    if (designationStore.state.designations.size === 0) {
      await designationStore.getManyDBDesignations();
    }
    if (nationalityStore.state.nationalities.size === 0) {
      await nationalityStore.getManyDBNationalities();
    }
    if (eduStore.state.educationalLevels.size == 0) {
      await eduStore.getManyDBEducationalLevels();
    }
    if (empStore.state.employees.size === 0) {
      await empStore.getManyDBEmployees();
    }
    $q.loading.hide();
  });
  return {
    divisionStore,
    departmentStore,
    sectionStore,
    unitStore,
    designationStore,
    eduStore,
    nationalityStore,
    empStore
  }
}
