export interface User {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  id_role: string;
  id_area: string;
  id_company: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Status {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Priority {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Type {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  id_type: string;
  id_supervisor: string | null;
  id_technical: string | null;
  id_area: string;
  title: string;
  description: string;
  id_status: string;
  id_priority: string;
  location: string;
  opening_date: string;
  close_date: string | null;
  solution: string | null;
  root_cause: string | null;
  anexos: string[];
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  id_incident: string;
  root_cause: string;
  report: string;
  id_priority: string;
  opening_date: string;
  close_date: string;
  anexos: string[];
  veracidad: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}
