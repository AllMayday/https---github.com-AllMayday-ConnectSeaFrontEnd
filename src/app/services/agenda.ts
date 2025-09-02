import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agenda } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private apiUrl = 'https://localhost:58900/api/Agendas';

  constructor(private http: HttpClient) {}

  getAgendas(): Observable<Agenda[]> {
    return this.http.get<Agenda[]>(`${this.apiUrl}`);
  }
  getAgenda(id: number): Observable<Agenda> {
    return this.http.get<Agenda>(`${this.apiUrl}/${id}`);
  }
  createAgenda(agenda: Agenda): Observable<Agenda> {
    return this.http.post<Agenda>(this.apiUrl, agenda);
  }
  updateAgenda(agenda: Agenda): Observable<Agenda> {
    return this.http.put<Agenda>(`${this.apiUrl}/${agenda.id}`, agenda);
  }
  deleteAgenda(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  linkManifestoToEscalas(manifestoId: number, escalaIds: number[]): Observable<any> {
    const payload = { manifestoId, escalaIds };
    return this.http.post(`${this.apiUrl}/manifestosVincularVarios`, payload);
  }

  desvincularManifesto(idEscala: number): Observable<any> {
    // envia objeto no body com nome do parâmetro esperado pelo controller
    return this.http.post(`${this.apiUrl}/manifestoDesvincular`, { idEscala });
  }
}
