import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registration } from 'src/app/interface/registration';
import { Observable } from 'rxjs';
import { Job } from 'src/app/interface/job';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private HttpClient:HttpClient) { }

  postRegistrationData(data: Registration): Observable<Registration[]> {
    return this.HttpClient.post<Registration[]>('http://localhost:3000/registrationData', data)
  };
  postCreatedJobData(data: Job): Observable<Job[]> {
    return this.HttpClient.post<Job[]>('http://localhost:3000/createdJobData', data)
  };


  getRegistrationData():Observable<Registration[]> {
    return this.HttpClient.get<Registration[]>('http://localhost:3000/registrationData')
  };
  getCreatedJobData(): Observable<Job[]> {
    return this.HttpClient.get<Job[]>('http://localhost:3000/createdJobData')
  };


  deleteCreatedJobData(data: string): Observable<Job[]> {
    return this.HttpClient.delete<Job[]>(`http://localhost:3000/createdJobData/${data}`)
  };


  patchCreatedJobData(data: string, newStatus: any): Observable<Job[]> {
    return this.HttpClient.patch<Job[]>(`http://localhost:3000/createdJobData/${data}`, newStatus)
  };
}
