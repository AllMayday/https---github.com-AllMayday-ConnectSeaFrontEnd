import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Navio } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class NavioService {
  private apiUrl = 'https://localhost:58900/api/Navios';

  constructor(private http: HttpClient) {}

  getNavios(): Observable<Navio[]> {
    return this.http.get<Navio[]>(`${this.apiUrl}`);
  }
  getNavio(id: number): Observable<Navio> {
    return this.http.get<Navio>(`${this.apiUrl}/${id}`);
  }
  createNavio(navio: Navio): Observable<Navio> {
    return this.http.post<Navio>(this.apiUrl, navio);
  }
  updateNavio(navio: Navio): Observable<Navio> {
    return this.http.put<Navio>(`${this.apiUrl}/${navio.id}`, navio);
  }
  deleteNavio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}