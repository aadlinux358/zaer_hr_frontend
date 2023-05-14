export interface NationalityCreate {
  name: string;
}

export interface NationalityReadOne extends NationalityCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface NationalityReadMany {
  count: number;
  result: NationalityReadOne[];
}
