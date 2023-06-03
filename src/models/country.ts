export interface CountryCreate {
  name: string;
}

export interface CountryReadOne extends CountryCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface CountryReadMany {
  count: number;
  result: CountryReadOne[];
}
