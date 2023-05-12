export interface UnitCreate {
  name: string;
  section_uid: string;
}

export interface UnitReadOne extends UnitCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface UnitReadMany {
  count: number;
  result: UnitReadOne[];
}
