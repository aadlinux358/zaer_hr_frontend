export interface TerminationCreate {
  employee_uid: string;
  termination_date: string
}

export interface TerminationReadOne extends TerminationCreate {
  uid: string;
  employee_uid: string;
  hire_date: string;
  termination_date: string;
  create_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface TerminationReadMany {
  count: number;
  result: TerminationReadOne[]
}
