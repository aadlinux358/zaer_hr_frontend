export interface EmployeeBase {
  first_name: string | null;
  last_name: string | null;
  grandfather_name: string | null;
  gender: string | null;
  birth_date: string | null;
  current_salary: number | null;
  current_hire_date: string | null;
  is_active: boolean | null;
  birth_place: string | null;
  mother_first_name: string | null;
  mother_last_name: string | null;
  marital_status: string | null;
  phone_number: string | null;
  national_id: string | null;
  contract_type: string | null;
  national_service: string | null;
}

export interface EmployeeCreate extends EmployeeBase {
  unit_uid: string | null;
  designation_uid: string | null;
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
  uid: null,
  badge_number: null,
  created_by: null,
  modified_by: null,
  date_created: null,
  date_modified: null,
  first_name: null,
  last_name: null,
  grandfather_name: null,
  gender: null,
  birth_date: null,
  current_salary: null,
  current_hire_date: null,
  is_active: null,
  birth_place: null,
  mother_first_name: null,
  mother_last_name: null,
  marital_status: null,
  phone_number: null,
  national_id: null,
  contract_type: null,
  national_service: null,
  unit_uid: null,
  designation_uid: null,
  nationality_uid: null,
  educational_level_uid: null,
}
