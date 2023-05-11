export interface DepartmentCreate {
  name: string;
  division_uid: string;
}

export interface DepartmentReadOne extends DepartmentCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface DepartmentReadMany {
  count: number;
  result: DepartmentReadOne[];
}
