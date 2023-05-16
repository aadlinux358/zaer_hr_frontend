export interface EmployeeBase {
  first_name: string;
  last_name: string;
  grandfather_name: string;
  gender: string;
  birth_date: string;
  current_salary: number;
  current_hire_date: string;
  is_active: boolean;
  birth_place: string;
  mother_first_name: string;
  mother_last_name: string;
  marital_status: string;
  phone_number: string;
  national_id: string;
  contract_type: string;
  national_service: string;
}

export interface EmployeeCreate extends EmployeeBase {
  unit_uid: string;
  designation_uid: string;
  nationality_uid: string;
  educational_level_uid: string;

}

export interface EmployeeReadOne extends EmployeeCreate {
  uid: string
  badge_number: number;
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface EmployeeReadMany {
  count: number;
  result: EmployeeReadOne[];
}

export interface EmployeeResponsePrintFormat extends EmployeeBase {
  division: string;
  department: string;
  section: string;
  unit: string;
  designation: string;
}

export interface EmployeeResponsePrintFormatMany {
  count: number;
  result: EmployeeResponsePrintFormat[];
}
