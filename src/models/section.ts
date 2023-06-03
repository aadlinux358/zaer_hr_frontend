export interface SectionCreate {
  name: string;
  unit_uid: string;
}

export interface SectionReadOne extends SectionCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface SectionReadMany {
  count: number;
  result: SectionReadOne[];
}
