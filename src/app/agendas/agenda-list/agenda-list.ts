import { Component, OnInit } from '@angular/core';
import { AgendaService } from '../../services/agenda';
import { Agenda } from '../../interfaces';
import { DatePipe } from '@angular/common';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../../shared/filter-pipe';

@Component({
  selector: 'app-agenda-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterPipe],
  templateUrl: './agenda-list.html',
  styleUrls: ['./agenda-list.scss']
})
export class AgendaList implements OnInit {
  agendas: Agenda[] = [];
  filterText: string = '';
  sortField: string = '';
  sortAsc: boolean = true;
  constructor(private service: AgendaService) {}

  ngOnInit(): void {
    this.loadAgendas();
  }
  private loadAgendas(): void {
    this.service.getAgendas().subscribe({
      next: data => {
        console.log('Agendas from API:', data);
        this.agendas = data;
      },
      error: err => {
        console.error('Failed to load agendas', err);
      }
    });
  }

  get filteredAgendas(): Agenda[] {
    const txt = this.filterText?.toLowerCase().trim();
    let list = this.agendas.slice(); // cria cópia para não mutar o original

    // filtro simples em campos relevantes
    if (txt) {
        list = list.filter(a =>
          String(a.id).includes(txt) ||
           (a && a.navio?.nome.toLowerCase().includes(txt)) ||
          (a.porto && a.porto.toLowerCase().includes(txt))
        );
      }
  
      // aplicar sorting se houver campo
      if (this.sortField) {
        list.sort((a, b) => {
          const aVal = this.getValueByPath(a, this.sortField);
          const bVal = this.getValueByPath(b, this.sortField);
  
          // lidar com undefined/null
          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return this.sortAsc ? -1 : 1;
          if (bVal == null) return this.sortAsc ? 1 : -1;
  
          // comparar strings ou números
          const aStr = String(aVal).toLowerCase();
          const bStr = String(bVal).toLowerCase();
          if (aStr > bStr) return this.sortAsc ? 1 : -1;
          if (aStr < bStr) return this.sortAsc ? -1 : 1;
          return 0;
        });
      }
  
      return list;
    }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  }
  private getValueByPath(obj: any, path: string): any {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
  
  deleteAgenda(id: number) {
    if (confirm('Delete this agenda?')) {
      this.service.deleteAgenda(id).subscribe(() => {
        this.agendas = this.agendas.filter(a => a.id !== id);
      });
    }
  }
}
