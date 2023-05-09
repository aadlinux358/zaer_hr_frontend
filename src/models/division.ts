export interface DivisionCreate {
  name: string;
}

export interface DivisionReadOne extends DivisionCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface DivisionReadMany {
  count: number;
  result: DivisionReadOne[];
}
