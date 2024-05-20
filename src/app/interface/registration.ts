export interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  password: string | null;
  confirmPassword: string;
  role: string;
}
