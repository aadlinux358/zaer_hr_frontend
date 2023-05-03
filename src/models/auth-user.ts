export interface AuthUser {
  uid?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_superuser: boolean;
  is_staff: boolean;
  last_login: string;
  date_created: string;
  date_modified: string;
  modified_by: string;
  created_by: string;
}
