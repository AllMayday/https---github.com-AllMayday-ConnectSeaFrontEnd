import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgendaService } from '../../services/agenda';
import { NavioService } from '../../services/navio';
import { ActivatedRoute, Router } from '@angular/router';
import { Agenda, Navio } from '../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda-form',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './agenda-form.html',
  styleUrl: './agenda-form.scss'
})
export class AgendaForm implements OnInit {
  form: FormGroup;
  id: number | null = null;
  navios: Navio[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AgendaService,
    private navioService: NavioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      porto: ['', Validators.required],
      navioId: [null, Validators.required],
      chegada: ['', Validators.required],
      partida: ['', Validators.required],
      etb: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'] || null;

    // load navios
    this.navioService.getNavios().subscribe({
      next: list => this.navios = list,
      error: err => console.error('Failed loading navios', err)
    });

    // if editing, load existing agenda and patch values
    if (this.id) {
      this.service.getAgenda(this.id).subscribe(a => {
        // make sure navioId is a number (API may return string)
        if (a.navioId != null) a.navioId = Number(a.navioId);
        this.form.patchValue(a);
      });
    }
  }

  save() {
    const agendaData = this.form.value as Agenda;
    if (this.id) {
      agendaData.id = this.id;
      this.service.updateAgenda(agendaData).subscribe(() => this.router.navigate(['/agendas']));
    } else {
      this.service.createAgenda(agendaData).subscribe(() => this.router.navigate(['/agendas']));
    }
  }
}
