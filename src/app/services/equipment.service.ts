
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private baseUrl = 'http://localhost:5117/api/Equipment';

  constructor(private http: HttpClient) {}

  getAllEquipment(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
  getEquipmentBySite(siteId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/site/${siteId}`);
  }
  
 
  
  addEquipment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }
  
  updateEquipment(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }
  
  
  deleteEquipment(name: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${name}`);
  }
  assignEquipmentToSite(equipmentId: number, siteId: number): Observable<any> {
    const url = `${this.baseUrl}/assign/${equipmentId}/site/${siteId}`;
    console.log('Request URL:', url); // Debug URL
    return this.http.put(url, null);
  }
  removeEquipmentFromSite(equipmentId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/remove/${equipmentId}`, null);
  }

  
}
