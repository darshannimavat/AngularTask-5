export interface Job {
  id?: string;
  companyName: string;
  jobName: string;
  experienceLevel: string;
  jobType: string;
  jobStyle: string;
  jobDescription: string;
  logoUrl: string | null | ArrayBuffer;
  date: number;
  status: string;
  email: string;
  applied: any[],
  bookmark: any[],
}
