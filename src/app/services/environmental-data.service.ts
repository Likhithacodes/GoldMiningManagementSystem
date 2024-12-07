import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentalDataService {
  private baseUrl = 'http://localhost:5117/api/EnvironmentalData';

  constructor(private http: HttpClient) {}

  getAllEnvironmentalData(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getEnvironmentalDataById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getEnvironmentalDataBySiteId(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }

  addEnvironmentalData(environmentalData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, environmentalData);
  }

  updateEnvironmentalData(id: number, environmentalData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, environmentalData);
  }

  deleteEnvironmentalData(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
