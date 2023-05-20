import {ref} from 'vue';
import {format, date} from 'quasar';
import {EmployeeReadOne} from 'src/models/employee';
import {useStores} from './stores';

export function useEmpColumns() {

  const {capitalize} = format;
  const {empStore} = useStores();
  const columns = ref([
    {
      name: 'badge_number',
      required: true,
      label: 'Badge Number',
      align: 'left',
      field: (row: EmployeeReadOne) => row.badge_number,
      sortable: true
    },
    {
      name: 'first_name',
      required: true,
      label: 'First Name',
      align: 'left',
      field: (row: EmployeeReadOne) => row.first_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'last_name',
      required: true,
      label: 'Last Name',
      align: 'left',
      field: (row: EmployeeReadOne) => row.last_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'grandfather_name',
      required: true,
      label: 'Grandfather Name',
      align: 'left',
      field: (row: EmployeeReadOne) => row.grandfather_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'gender',
      required: true,
      label: 'Gender',
      align: 'left',
      field: (row: EmployeeReadOne) => row.gender,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'current_hire_date',
      required: true,
      label: 'Hire Date',
      align: 'left',
      field: (row: EmployeeReadOne) => row.current_hire_date,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY'),
      sortable: true
    },
    {
      name: 'division',
      required: true,
      label: 'Division',
      align: 'left',
      field: (row: EmployeeReadOne) => {
        const division = empStore.getDivision(row.unit_uid);
        return capitalize(division.name);
      }
    },
    {
      name: 'department',
      required: true,
      label: 'Department',
      align: 'left',
      field: (row: EmployeeReadOne) => {
        const department = empStore.getDepartment(row.unit_uid);
        return capitalize(department.name);
      },
    },
    {
      name: 'section',
      required: true,
      label: 'Section',
      align: 'left',
      field: (row: EmployeeReadOne) => {
        const section = empStore.getSection(row.unit_uid);
        return capitalize(section.name);
      }
    },
    {
      name: 'unit',
      required: true,
      label: 'Unit',
      align: 'left',
      field: (row: EmployeeReadOne) => {
        const unit = empStore.getUnit(row.unit_uid);
        return capitalize(unit.name)
      }
    },
    {
      name: 'designation',
      required: true,
      label: 'Designation',
      align: 'left',
      field: (row: EmployeeReadOne) => {
        const designation = empStore.getDesignation(row.designation_uid);
        return capitalize(designation.title)
      }
    },
    {
      name: 'actions',
      required: true,
      label: 'Action',
      align: 'left',
    }
  ])
  return {
    columns
  }
}
