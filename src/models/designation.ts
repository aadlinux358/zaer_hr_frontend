export interface DesignationCreate {
  title: string;
}

export interface DesignationReadOne extends DesignationCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface DesignationReadMany {
  count: number;
  result: DesignationReadOne[];
}
