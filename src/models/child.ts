export interface ChildCreate {
  parent_uid: string;
  first_name: string;
  gender: string;
  birth_date: string;
}

export interface ChieldReadOne extends ChildCreate {
  uid: string;
  created_by: string;
  modified_by: string;
  date_created: string;
  ddate_modified: string;
}

export interface ChildReadMany {
  count: number;
  result: ChieldReadOne[];
}
