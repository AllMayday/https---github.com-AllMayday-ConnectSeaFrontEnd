import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from '../../shared/filter-pipe';
import { Navio } from '../../interfaces';
import { NavioService } from '../../services/navio';

@Component({
  selector: 'app-navio-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,FilterPipe],
  templateUrl: './navio-list.html',
  styleUrl: './navio-list.scss'
})
export class NavioList implements OnInit {
  navios: Navio[] = [];
  filterText: string = '';
  sortField: string = '';
  sortAsc: boolean = true;

  constructor(private service: NavioService) {}

  ngOnInit(): void {
    this.loadNavios();
  }

  private loadNavios(): void {
    this.service.getNavios().subscribe({
      next: data => {
        console.log('Navios from API:', data);
        this.navios = data || [];
      },
      error: err => {
        console.error('Failed to load navios', err);
      }
    });
  }

  get filteredNavios(): Navio[] {
    const txt = this.filterText?.toLowerCase().trim();
    let list = this.navios.slice(); // cópia

    if (txt) {
      list = list.filter(n =>
        String(n.id).includes(txt) ||
        (n.nome && n.nome.toLowerCase().includes(txt)) ||
        (n.numeroIMO && n.numeroIMO.toLowerCase().includes(txt)) ||
        (n.bandeira && n.bandeira.toLowerCase().includes(txt))
      );
    }

    if (this.sortField) {
      list.sort((a, b) => {
        const aVal = this.getValueByPath(a, this.sortField);
        const bVal = this.getValueByPath(b, this.sortField);

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return this.sortAsc ? -1 : 1;
        if (bVal == null) return this.sortAsc ? 1 : -1;

        // se for número compara numericamente
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return this.sortAsc ? aNum - bNum : bNum - aNum;
        }

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

  deleteNavio(id: number) {
    if (confirm('Delete this navio?')) {
      this.service.deleteNavio(id).subscribe({
        next: () => {
          this.navios = this.navios.filter(n => n.id !== id);
        },
        error: err => {
          console.error('Failed to delete navio', err);
          alert('Failed to delete navio.');
        }
      });
    }
  }
}
