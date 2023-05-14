export interface EducationalLevelCreate {
  level: string;
}

export interface EducationalLevelReadOne extends EducationalLevelCreate {
  uid: string
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;
}

export interface EducationalLevelReadMany {
  count: number;
  result: EducationalLevelReadOne[];
}
