export interface AuthUserCreate {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
}
export interface AuthUserReadOne extends AuthUserCreate {
  uid: string;
  last_login: string;
  date_created: string;
  date_modified: string;
  modified_by: string;
  created_by: string;
}

export interface AuthUserReadMany {
  count: number;
  result: AuthUserReadOne[]
}
