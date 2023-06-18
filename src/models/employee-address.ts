export interface AddressCreate {
  employee_uid: string | null;
  city: string | null;
  district: string | null;
  street?: string
  house_number?: number
}

export interface AddressReadOne extends AddressCreate {
  uid: string | null;
  created_by: string | null;
  modified_by: string | null;
  date_created: string | null;
  ddate_modified: string | null;
}

export interface AddressReadMany {
  count: number;
  result: AddressReadOne[];
}

export const AddressObj: AddressReadOne = {
  uid: '',
  created_by: '',
  modified_by: '',
  date_created: '',
  ddate_modified: '',
  employee_uid: '',
  city: '',
  district: '',
}
