import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manifesto } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class ManifestoService {
  private apiUrl = 'https://localhost:58900/api/Manifestos';

  constructor(private http: HttpClient) {}

  getManifestos(): Observable<Manifesto[]> {
    return this.http.get<Manifesto[]>(`${this.apiUrl}`);
  }
  getManifesto(id: number): Observable<Manifesto> {
    return this.http.get<Manifesto>(`${this.apiUrl}/${id}`);
  }
  createManifesto(manifesto: Manifesto): Observable<Manifesto> {
    return this.http.post<Manifesto>(this.apiUrl, manifesto);
  }
  updateManifesto(manifesto: Manifesto): Observable<Manifesto> {
    return this.http.put<Manifesto>(`${this.apiUrl}/${manifesto.id}`, manifesto);
  }
  deleteManifesto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
