import {ref} from 'vue';
import {format, date} from 'quasar';
import {EmployeeReadOne as R} from 'src/models/employee';
import {useStores} from './stores';

export function useEmpColumns() {
  const {capitalize} = format;
  const {
    divisionStore,
    departmentStore,
    sectionStore,
    unitStore,
    designationStore} = useStores();
  function getUnit(unitUid: string) {
    return unitStore.units.get(unitUid)
  }

  function getSection(unitUid: string) {
    const unit = unitStore.units.get(unitUid);
    return sectionStore.sections.get(unit?.section_uid);
  }

  function getDepartment(unitUid: string) {
    const unit = unitStore.units.get(unitUid);
    const sec = sectionStore.sections.get(unit?.section_uid);
    return departmentStore.departments.get(sec?.department_uid);
  }
  function getDivision(unitUid: string) {
    const unit = unitStore.units.get(unitUid);
    const sec = sectionStore.sections.get(unit?.section_uid);
    const dep = departmentStore.departments.get(sec?.department_uid);
    return divisionStore.divisions.get(dep?.division_uid);
  }

  function getDesignation(designationUid: string) {
    return designationStore.designations.get(designationUid);
  }
  const columns = ref([
    {
      name: 'badge_number',
      required: true,
      label: 'Badge Number',
      align: 'left',
      field: (row: R) => row.badge_number,
      sortable: true
    },
    {
      name: 'first_name',
      required: true,
      label: 'First Name',
      align: 'left',
      field: (row: R) => row.first_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'last_name',
      required: true,
      label: 'Last Name',
      align: 'left',
      field: (row: R) => row.last_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'grandfather_name',
      required: true,
      label: 'Grandfather Name',
      align: 'left',
      field: (row: R) => row.grandfather_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'gender',
      required: true,
      label: 'Gender',
      align: 'left',
      field: (row: R) => row.gender,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'current_hire_date',
      required: true,
      label: 'Hire Date',
      align: 'left',
      field: (row: R) => row.current_hire_date,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY'),
      sortable: true
    },
    {
      name: 'division',
      required: true,
      label: 'Division',
      align: 'left',
      field: (row: R) => {
        const division = getDivision(row.unit_uid);
        return capitalize(division.name);
      }
    },
    {
      name: 'department',
      required: true,
      label: 'Department',
      align: 'left',
      field: (row: R) => {
        const department = getDepartment(row.unit_uid);
        return capitalize(department.name);
      },
    },
    {
      name: 'section',
      required: true,
      label: 'Section',
      align: 'left',
      field: (row: R) => {
        const section = getSection(row.unit_uid);
        return capitalize(section.name);
      }
    },
    {
      name: 'unit',
      required: true,
      label: 'Unit',
      align: 'left',
      field: (row: R) => {
        const unit = getUnit(row.unit_uid);
        return capitalize(unit.name)
      }
    },
    {
      name: 'designation',
      required: true,
      label: 'Designation',
      align: 'left',
      field: (row: R) => {
        const designation = getDesignation(row.designation_uid);
        return capitalize(designation.title)
      }
    },
  ])
  return {
    columns
  }
}
