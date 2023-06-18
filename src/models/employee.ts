export interface EmployeeBase {
  first_name: string | null;
  last_name: string | null;
  grandfather_name: string | null;
  gender: string | null;
  birth_date: string | null;
  current_salary: number | null;
  current_hire_date: string | null;
  is_active: boolean | null;
  is_terminated: boolean | null;
  birth_place: string | null;
  origin_of_birth: string | null;
  mother_first_name: string | null;
  mother_last_name: string | null;
  mother_grandfather_name: string | null;
  marital_status: string | null;
  phone_number: string | null;
  national_id: string | null;
  contract_type: string | null;
  national_service: string | null;
  apprenticeship_from_date: string | null;
  apprenticeship_to_date: string | null;
}

export interface EmployeeCreate extends EmployeeBase {
  section_uid: string | null;
  designation_uid: string | null;
  country_uid: string | null;
  nationality_uid: string | null;
  educational_level_uid: string | null;

}

export interface EmployeeReadOne extends EmployeeCreate {
  uid: string | null;
  badge_number: number | null;
  created_by: string | null;
  modified_by: string | null;
  date_created: string | null;
  date_modified: string | null;
}

export interface EmployeeReadMany {
  count: number;
  result: EmployeeReadOne[];
}

export interface EmployeeResponsePrintFormat extends EmployeeBase {
  division: string | null;
  department: string | null;
  section: string | null;
  unit: string | null;
  designation: string | null;
}

export interface EmployeeResponsePrintFormatMany {
  count: number;
  result: EmployeeResponsePrintFormat[];
}

export const EmployeeObj: EmployeeReadOne = {
  uid: '',
  badge_number: 0,
  created_by: '',
  modified_by: '',
  date_created: '',
  date_modified: '',
  first_name: '',
  last_name: '',
  grandfather_name: '',
  gender: '',
  birth_date: '',
  origin_of_birth: '',
  current_salary: 0,
  current_hire_date: '',
  is_active: false,
  is_terminated: false,
  birth_place: '',
  mother_first_name: '',
  mother_last_name: '',
  mother_grandfather_name: '',
  marital_status: '',
  phone_number: '',
  national_id: '',
  contract_type: '',
  national_service: '',
  section_uid: '',
  designation_uid: '',
  country_uid: '',
  nationality_uid: '',
  educational_level_uid: '',
  apprenticeship_from_date: '',
  apprenticeship_to_date: '',
}
