import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Agenda, Manifesto } from '../../interfaces';
import { ManifestoService } from '../../services/manifesto';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgendaService } from '../../services/agenda';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators/catchError';
import { of } from 'rxjs';

@Component({
  selector: 'app-manifesto-list',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './manifesto-list.html',
  styleUrl: './manifesto-list.scss'
})
export class ManifestoList implements OnInit {
  manifestos: Manifesto[] = [];
  filterText: string = '';
  showLinkModal = false;
  currentManifesto: Manifesto | null = null;
  allEscalas: Agenda[] = []; 
  selectedEscalas: Set<number> = new Set<number>();
  justLinkedSet: Set<number> = new Set<number>(); 
  linkErrorMessage = '';
  linkSuccessMessage = '';
  linkingInProgress = false;
  unlinkingInProgress: Set<number> = new Set<number>();

  sortField: string = '';
  sortAsc: boolean = true;

  constructor(
    private manifestoService: ManifestoService,
    private agendaService: AgendaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadManifestos();
  }

  private loadManifestos(): void {
    this.manifestoService.getManifestos().subscribe({
      next: (data) => this.manifestos = data ?? [],
      error: (err) => {
        console.error('Erro ao carregar manifestos', err);

      }
    });
  }

  // Getter que aplica filtro e ordenação
  get filteredManifestos(): Manifesto[] {
    const txt = this.filterText?.toLowerCase().trim();
    let list = this.manifestos.slice(); 

   
    if (txt) {
      list = list.filter(m =>
        String(m.id).includes(txt) ||
        (m.numero && m.numero.toLowerCase().includes(txt)) ||
        (m.tipo && m.tipo.toLowerCase().includes(txt)) ||
        (m.navio?.nome && m.navio.nome.toLowerCase().includes(txt)) ||
        (m.portoOrigem && m.portoOrigem.toLowerCase().includes(txt)) ||
        (m.portoDestino && m.portoDestino.toLowerCase().includes(txt))
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

  // Alterna campo e direção de ordenação
  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
  }

  // utilitário para pegar propriedades aninhadas por caminho 'navio.nome'
  private getValueByPath(obj: any, path: string): any {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // ------------------------------------------------

openLinkModal(manifesto: Manifesto) {
    this.currentManifesto = manifesto;
    this.selectedEscalas.clear();
    this.justLinkedSet.clear();
    this.linkErrorMessage = '';
    this.linkSuccessMessage = '';
    this.linkingInProgress = false;

    // carregar todas as escalas (agendas)
    this.agendaService.getAgendas().subscribe({
      next: (data) => {
        this.allEscalas = data ?? [];
        this.showLinkModal = true;
      },
      error: (err) => {
        console.error('Erro ao carregar escalas', err);
        this.linkErrorMessage = 'Não foi possível carregar as escalas. Tente novamente.';
        this.showLinkModal = true;
      }
    });
  }

  closeLinkModal() {
    this.showLinkModal = false;
    this.currentManifesto = null;
  }

  // Marca/desmarca escala no conjunto de seleção
  toggleSelectEscala(escala: Agenda, checked: boolean) {
    if (checked) this.selectedEscalas.add(escala.id);
    else this.selectedEscalas.delete(escala.id);
  }

  // verifica se escala já está vinculada ao manifesto (previne duplicate)
  isAlreadyLinked(escala: Agenda): boolean {
    if (!this.currentManifesto) return false;
    // Checa por manifestoId direto ou array de manifestos (conforme seu model)
    if (escala.manifestoId != null && escala.manifestoId === this.currentManifesto.id) return true;
    if (Array.isArray(escala.manifestos) && escala.manifestos.some(m => m.id === this.currentManifesto!.id)) return true;
    return false;
  }

  // depois de vincular, marcamos a escala como "acabei de vincular"
  isJustLinked(escalaId: number): boolean {
    return this.justLinkedSet.has(escalaId);
  }

  // chama o serviço para vincular as escalas selecionadas
  confirmLink() {
    if (!this.currentManifesto) return;
    const manifestoId = this.currentManifesto.id;
    const escalaIds = Array.from(this.selectedEscalas);

    if (escalaIds.length === 0) return;

    this.linkingInProgress = true;
    this.linkErrorMessage = '';
    this.linkSuccessMessage = '';

    this.agendaService.linkManifestoToEscalas(manifestoId, escalaIds)
      .pipe(catchError(err => {
        this.linkingInProgress = false;
        this.linkErrorMessage = 'Erro ao vincular escalas. Veja o console para detalhes.';
        console.error('Link error', err);
        return of({ __error: err });
      })) 
      .subscribe((res: any) => {
        this.linkingInProgress = false;

        // servidor sinalizou erro (catchError retornou um objeto especial)
        if (res && res.__error) {
          const err = res.__error;
          if (err instanceof HttpErrorResponse) {
            if (err.status === 409) {
              // duplicidade detectada no servidor
              this.linkErrorMessage = err.error?.message ?? 'Vinculação já existe (duplicidade).';
            } else if (err.status === 400) {
              this.linkErrorMessage = err.error?.message ?? 'Requisição inválida.';
            } else {
              this.linkErrorMessage = err.error?.message ?? 'Erro ao vincular. Veja o console.';
            }
          } else {
            this.linkErrorMessage = 'Erro desconhecido ao vincular.';
          }
          console.error('Link error', err);
          return;
        }

        // sucesso: atualizar estado local para refletir vinculação imediata
        // dependendo da resposta o backend pode retornar os objetos atualizados; se não,
        // a gente atualiza localmente as escalas marcadas.
        this.linkSuccessMessage = 'Manifesto vinculado com sucesso às escalas selecionadas.';

        // marcar as escalas como vinculadas localmente
        escalaIds.forEach(id => {
          const escala = this.allEscalas.find(e => e.id === id);
          if (escala) {
            // set manifestoId (se o seu model tem manifestoId)
            escala.manifestoId = manifestoId;
            // também atualiza escalas do manifesto localmente (se existir)
            if (!this.currentManifesto!.escalas) this.currentManifesto!.escalas = [];
            // evita duplicatas lateralmente
            if (!this.currentManifesto!.escalas.some(s => s.id === escala.id)) {
              this.currentManifesto!.escalas.push(escala);
            }
            // visual highlight
            this.justLinkedSet.add(escala.id);
          }
        });

        // limpar seleção (podemos manter se preferir)
        this.selectedEscalas.clear();

        // atualizar lista de manifestos global (se necessário)
        const idx = this.manifestos.findIndex(m => m.id === manifestoId);
        if (idx >= 0) {
          this.manifestos[idx] = { ...this.currentManifesto! };
        }

        // opcional: fechar modal automaticamente após 1.5s
        setTimeout(() => {
          this.linkSuccessMessage = '';
          this.justLinkedSet.clear();
          this.closeLinkModal();
        }, 1500);
      });
  }


  desvincularEscala(idEscala: number) {
  if (!this.currentManifesto) return;

  this.unlinkingInProgress.add(idEscala);
  this.linkErrorMessage = '';
  this.linkSuccessMessage = '';

  this.agendaService.desvincularManifesto(idEscala)
    .pipe(
      catchError(err => {
        this.unlinkingInProgress.delete(idEscala);
        this.linkErrorMessage = 'Erro ao desvincular. Veja o console para detalhes.';
        console.error('Desvincular error', err);
        return of({ __error: err });
      })
    )
    .subscribe((res: any) => {
      this.unlinkingInProgress.delete(idEscala);

      if (res && res.__error) {
        const err = res.__error;
        if (err instanceof HttpErrorResponse) {
          this.linkErrorMessage = err.error?.message ?? 'Erro ao desvincular.';
        } else {
          this.linkErrorMessage = 'Erro desconhecido ao desvincular.';
        }
        console.error('Desvincular error', err);
        return;
      }

      // sucesso
      this.linkSuccessMessage = 'Escala desvinculada com sucesso.';

      // recarrega as escalas do servidor para refletir disponibilidade
      this.agendaService.getAgendas().subscribe({
        next: (data) => {
          this.allEscalas = data ?? [];

          // também atualiza o manifesto atual localmente (remove escala dos arrays locais)
          if (this.currentManifesto && Array.isArray(this.currentManifesto.escalas)) {
            this.currentManifesto.escalas = this.currentManifesto.escalas.filter(s => s.id !== idEscala);
          }

          // atualiza manifestos no grid principal se necessário
          const idx = this.manifestos.findIndex(m => m.id === this.currentManifesto!.id);
          if (idx >= 0) {
            this.manifestos[idx] = { ...this.currentManifesto! };
          }
        },
        error: (err) => {
          console.error('Erro ao recarregar escalas', err);
        }
      });
    });
}


  // ------------------------------------------------

  deleteManifesto(id: number): void {
    if (!confirm('Delete this manifesto?')) return;
    this.manifestoService.deleteManifesto(id).subscribe({
      next: () => {
        this.manifestos = this.manifestos.filter(m => m.id !== id);
      },
      error: (err) => {
        console.error('Erro ao deletar manifesto', err);
        alert('Erro ao deletar manifesto. Veja o console para detalhes.');
      }
    });
  }
}
