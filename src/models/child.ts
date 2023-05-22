export interface ChildCreate {
  parent_uid: string | null;
  first_name: string | null;
  gender: string | null;
  birth_date: string | null;
}

export interface ChieldReadOne extends ChildCreate {
  uid: string | null;
  created_by: string | null;
  modified_by: string | null;
  date_created: string | null;
  ddate_modified: string | null;
}

export interface ChildReadMany {
  count: number;
  result: ChieldReadOne[];
}

export const ChildObj = {
  uid: '',
  created_by: '',
  modified_by: '',
  date_created: '',
  ddate_modified: '',
  parent_uid: '',
  first_name: '',
  gender: '',
  birth_date: '',
}
