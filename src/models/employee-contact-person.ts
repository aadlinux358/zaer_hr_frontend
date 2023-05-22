export interface ContactPersonCreate {
  employee_uid: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  relationship_to_employee: string | null;
}

export interface ContactPersonReadOne extends ContactPersonCreate {
  uid: string | null;
  created_by: string | null;
  modified_by: string | null;
  date_created: string | null;
  ddate_modified: string | null;
}

export interface ContactPersonReadMany {
  count: number;
  result: ContactPersonReadOne[];
}

export const ContactPersonObj: ContactPersonReadOne = {
  employee_uid: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  relationship_to_employee: '',
  uid: '',
  created_by: '',
  modified_by: '',
  date_created: '',
  ddate_modified: '',
}
