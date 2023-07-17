import {ref} from 'vue';
import {format, date} from 'quasar';
import {EmployeeReadOneFull} from 'src/models/employee';
import {useStores} from './stores';
import {ChildReadOne} from 'src/models/child';
import {AddressReadOne} from 'src/models/employee-address'
import {ContactPersonReadOne} from 'src/models/employee-contact-person'
import {DesignationReadOne} from 'src/models/designation';
import {DivisionReadOne} from 'src/models/division';
import {DepartmentReadOne} from 'src/models/department';
import {UnitReadOne} from 'src/models/unit';
import {SectionReadOne} from 'src/models/section';
import {TerminationReadOne} from 'src/models/termination';

export function useTableColumns() {
  const {capitalize} = format;
  const {
    divisionStore,
    departmentStore,
    unitStore,
    empStore,
  } = useStores();

  const divisionColumns = [
    {
      name: 'name',
      required: true,
      label: 'Division Name',
      align: 'left',
      field: (row: DivisionReadOne) => row.name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'date_created',
      required: true,
      label: 'Date Created',
      align: 'left',
      field: (row: DivisionReadOne) => row.date_created,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
      sortable: true
    },
    {
      name: 'uid',
      required: true,
      label: 'Division UUID',
      align: 'left',
      field: (row: DivisionReadOne) => row.uid,
    },
  ]
  const departmentColumns = [
    {
      name: 'name',
      required: true,
      label: 'Department Name',
      align: 'left',
      field: (row: DepartmentReadOne) => row.name,
      sortable: true,
      format: (val: string) => capitalize(val),
    },
    {
      name: 'division_uid',
      required: true,
      label: 'Division',
      align: 'left',
      field: (row: DepartmentReadOne) => {
        const division = divisionStore.divisions.get(row.division_uid)
        return division?.name
      },
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'date_created',
      required: true,
      label: 'Date Created',
      align: 'left',
      field: (row: DepartmentReadOne) => row.date_created,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
      sortable: true
    },
    {
      name: 'uid',
      required: true,
      label: 'Department UUID',
      align: 'left',
      field: (row: DepartmentReadOne) => row.uid,
    },
  ]
  const unitColumns = [
    {
      name: 'name',
      required: true,
      label: 'Unit Name',
      align: 'left',
      field: (row: UnitReadOne) => row.name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'department',
      required: true,
      label: 'Department Name',
      align: 'left',
      field: (row: UnitReadOne) => {
        const dep = departmentStore.departments.get(row.department_uid);
        return capitalize(dep?.name);
      },
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'division',
      required: true,
      label: 'Division Name',
      align: 'left',
      field: (row: UnitReadOne) => {
        const dep = departmentStore.departments.get(row.department_uid);
        const div = divisionStore.divisions.get(dep?.division_uid);
        return capitalize(div?.name);
      },
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'date_created',
      required: true,
      label: 'Date Created',
      align: 'left',
      field: (row: UnitReadOne) => row.date_created,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
      sortable: true
    },
    {
      name: 'uid',
      required: true,
      label: 'Unit UUID',
      align: 'left',
      field: (row: UnitReadOne) => row.uid,
    },
  ]
  const sectionColumns = [
    {
      name: 'name',
      required: true,
      label: 'Section Name',
      align: 'left',
      field: (row: SectionReadOne) => row.name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'unit_uid',
      required: true,
      label: 'Unit Name',
      align: 'left',
      field: (row: SectionReadOne) => {
        const unit = unitStore.units.get(row.unit_uid)
        return capitalize(unit.name)
      },
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'department',
      required: true,
      label: 'Department Name',
      align: 'left',
      field: (row: SectionReadOne) => {
        const unit = unitStore.units.get(row.unit_uid)
        const dep = departmentStore.departments.get(unit.department_uid);
        return capitalize(dep?.name);
      },
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'division',
      required: true,
      label: 'Division Name',
      align: 'left',
      field: (row: SectionReadOne) => {
        const unit = unitStore.units.get(row.unit_uid)
        const dep = departmentStore.departments.get(unit.department_uid);
        const div = divisionStore.divisions.get(dep?.division_uid);
        return capitalize(div?.name);
      },
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'date_created',
      required: true,
      label: 'Date Created',
      align: 'left',
      field: (row: SectionReadOne) => row.date_created,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
      sortable: true
    },
    {
      name: 'uid',
      required: true,
      label: 'Section UUID',
      align: 'left',
      field: (row: SectionReadOne) => row.uid,
    },
  ]
  const designationColumns = [
    {
      name: 'title',
      required: true,
      label: 'Designation Title',
      align: 'left',
      field: (row: DesignationReadOne) => row.title,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'date_created',
      required: true,
      label: 'Date Created',
      align: 'left',
      field: (row: DesignationReadOne) => row.date_created,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY HH:mm A'),
      sortable: true
    },
    {
      name: 'uid',
      required: true,
      label: 'Designation UUID',
      align: 'left',
      field: (row: DesignationReadOne) => row.uid,
    },
  ]
  const empColumns = ref([
    {
      name: 'badge_number',
      required: true,
      label: 'Badge Number',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.badge_number,
      sortable: true
    },
    {
      name: 'first_name',
      required: true,
      label: 'First Name',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.first_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'last_name',
      required: true,
      label: 'Last Name',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.last_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'grandfather_name',
      required: true,
      label: 'Grandfather Name',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.grandfather_name,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'gender',
      required: true,
      label: 'Gender',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.gender,
      format: (val: string) => capitalize(val),
      sortable: true
    },
    {
      name: 'current_hire_date',
      required: true,
      label: 'Hire Date',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.current_hire_date,
      format: (val: string) => date.formatDate(val, 'DD-MMM-YYYY'),
      sortable: true
    },
    {
      name: 'division',
      required: true,
      label: 'Division',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.division,
      format: (val: string) => val ? capitalize(val) : '',
      sortable: true
    },
    {
      name: 'department',
      required: true,
      label: 'Department',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.department,
      format: (val: string) => val ? capitalize(val) : '',
      sortable: true
    },
    {
      name: 'unit',
      required: true,
      label: 'Unit',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.unit,
      format: (val: string) => val ? capitalize(val) : '',
      sortable: true
    },
    {
      name: 'section',
      required: true,
      label: 'Section',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.section,
      format: (val: string) => val ? capitalize(val) : '',
      sortable: true
    },
    {
      name: 'designation',
      required: true,
      label: 'Designation',
      align: 'left',
      field: (row: EmployeeReadOneFull) => row.designation,
      format: (val: string) => val ? capitalize(val) : '',
      sortable: true
    },
  ])
  const childColumns = ref([
    {
      name: 'first_name',
      required: true,
      label: 'First Name',
      field: (row: ChildReadOne) => row.first_name ? capitalize(row.first_name) : '',
      align: 'left',
    },
    {
      name: 'gender',
      required: true,
      label: 'Gender',
      field: (row: ChildReadOne) => row.gender ? capitalize(row.gender) : '',
      align: 'left',
    },
    {
      name: 'birth_date',
      required: true,
      label: 'Birth Date',
      field: (row: ChildReadOne) => row.birth_date,
      align: 'left',
    },
  ])
  const addressColumns = ref([
    {
      name: 'city',
      required: true,
      label: 'City',
      field: (row: AddressReadOne) => row.city ? capitalize(row.city) : '',
      align: 'left',
    },
    {
      name: 'district',
      required: true,
      label: 'District',
      field: (row: AddressReadOne) => row.district ? capitalize(row.district) : '',
      align: 'left',
    },
    {
      name: 'street',
      required: false,
      label: 'Street',
      field: (row: AddressReadOne) => row.street ? capitalize(row.street) : '',
      align: 'left',
    },
    {
      name: 'house_number',
      required: false,
      label: 'House Number',
      field: (row: AddressReadOne) => row.house_number || '',
      align: 'left',
    }
  ])
  const contactPersonColumns = ref([
    {
      name: 'first_name',
      required: true,
      label: 'First Name',
      field: (row: ContactPersonReadOne) => row.first_name ? capitalize(row.first_name) : '',
      align: 'left',
    },
    {
      name: 'last_name',
      required: true,
      label: 'Last Name',
      field: (row: ContactPersonReadOne) => row.last_name ? capitalize(row.last_name) : '',
      align: 'left',
    },
    {
      name: 'phone_number',
      required: true,
      label: 'Phone Number',
      field: (row: ContactPersonReadOne) => row.phone_number,
      align: 'left',
    },
    {
      name: 'relationship_to_employee',
      required: true,
      label: 'Relationship',
      field: (row: ContactPersonReadOne) => row.relationship_to_employee ? capitalize(row.relationship_to_employee) : '',
      align: 'left',
    },
  ])
  const terminationColumns = ref([
    {
      name: 'badge_number',
      required: false,
      label: 'Badge Number',
      field: (row: TerminationReadOne) => {
        const emp = empStore.employees.get(row.employee_uid)
        return emp?.badge_number ? emp.badge_number : ''
      },
      align: 'left',
    },
    {
      name: 'first_name',
      required: false,
      label: 'First Name',
      field: (row: TerminationReadOne) => {
        const emp = empStore.employees.get(row.employee_uid)
        return emp?.first_name ? capitalize(emp.first_name) : ''
      },
      align: 'left',
    },
    {
      name: 'last_name',
      required: false,
      label: 'Last Name',
      field: (row: TerminationReadOne) => {
        const emp = empStore.employees.get(row.employee_uid)
        return emp?.last_name ? capitalize(emp.last_name) : ''
      },
      align: 'left',
    },
    {
      name: 'grandfather_name',
      required: false,
      label: 'Grandfather Name',
      field: (row: TerminationReadOne) => {
        const emp = empStore.employees.get(row.employee_uid)
        return emp?.grandfather_name ? capitalize(emp.grandfather_name) : ''
      },
      align: 'left',
    },
    {
      name: 'employee_uid',
      required: true,
      label: 'Employee UUID',
      field: (row: TerminationReadOne) => row.employee_uid,
      align: 'left',
    },
    {
      name: 'hire_date',
      required: true,
      label: 'Hire Date',
      field: (row: TerminationReadOne) => row.hire_date,
      align: 'left',
    },
    {
      name: 'termination_date',
      required: true,
      label: 'Termination Date',
      field: (row: TerminationReadOne) => row.termination_date,
      align: 'left',
    },
  ])
  return {
    divisionColumns,
    departmentColumns,
    unitColumns,
    sectionColumns,
    designationColumns,
    empColumns,
    childColumns,
    addressColumns,
    contactPersonColumns,
    terminationColumns,
  }
}
