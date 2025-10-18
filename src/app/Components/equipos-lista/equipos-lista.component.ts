import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EquipoService } from '../../Services/appServices/equipoServices/equipo';
import { SedeService } from '../../Services/appServices/sedesServices/sede.service';
import { ServiciosService } from '../../Services/appServices/serviciosServices/servicios.service';
import { TipoEquipoService } from '../../Services/appServices/tipoEquipoServices/tipo-equipo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, map, BehaviorSubject, switchMap } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-equipos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipos-lista.component.html',
  styleUrls: ['./equipos-lista.component.css']
})
export class EquiposListaComponent implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);
  teams$!: Observable<any[]>;
  filterText: string = '';
  selectedTeam: any = {};
  teamTypes: any[] = [];
  services: any[] = [];
  branches: any[] = [];
  private modalRef: any;
  private isBrowser = false;

  constructor(
    private teamService: EquipoService,
    private branchService: SedeService,
    private servicesService: ServiciosService,
    private teamTypeService: TipoEquipoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  router = inject(Router);

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.teams$ = this.refresh$.pipe(
      switchMap(() =>
        this.teamService.getTeams().pipe(
          map(teams => this.filterTeams(teams))
        )
      )
    );
    this.teamTypeService.getTiposEquipo().subscribe(res => this.teamTypes = res);
    this.servicesService.getServicios().subscribe(res => this.services = res);
    this.branchService.getSedes().subscribe(res => this.branches = res);

    import('bootstrap').then(b => (window as any).bootstrap = b);


    this.loadTeams();
  }

  filterTeams(teams: any[]): any[] {
    if (!this.filterText.trim()) return teams;
    const filterLower = this.filterText.trim().toLowerCase();
    return teams.filter(team =>
      team.nombres?.toLowerCase().includes(filterLower) ||
      team.marca?.toLowerCase().includes(filterLower) ||
      team.modelo?.toLowerCase().includes(filterLower) ||
      team.serie?.toLowerCase().includes(filterLower)
    );
  }

  showAlertMessage(
    title: string,
    icon: 'success' | 'error' | 'warning' | 'info',
    confirm?: boolean
  ): Promise<boolean> {
    if (confirm) {
      return Swal.fire({
        title,
        icon,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then(result => result.isConfirmed);
    } else {
      return Swal.fire({
        title,
        icon,
        showConfirmButton: false,
        timer: 1500
      }).then(() => true);
    }
  }

  openModal(team: any) {
    this.selectedTeam = { ...team };
    if (!this.isBrowser) return;

    const modalEl = document.getElementById('editTeamModal');
    if (modalEl && (window as any).bootstrap) {
      this.modalRef = new (window as any).bootstrap.Modal(modalEl);
      this.modalRef.show();
    }
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  saveChanges() {
    this.teamService.editTeam(this.selectedTeam.id, this.selectedTeam).subscribe({
      next: async () => {
        await this.showAlertMessage('¡Equipo actualizado correctamente!', 'success');
        this.loadTeams();
        this.closeModal();
      },
      error: () => this.showAlertMessage('Error al actualizar el equipo', 'error')
    });
  }

  loadTeams() {
    this.refresh$.next();
  }

  async toggleTeamActive(team: any) {
    const action = team.activo ? 'deshabilitar' : 'habilitar';
    const confirmed = await this.showAlertMessage(
      `¿Seguro que deseas ${action} este equipo?`,
      'warning',
      true
    );

    if (confirmed) {
      const updatedTeam = { ...team, activo: !team.activo };
      this.teamService.editTeam(team.id, updatedTeam).subscribe({
        next: () => {
          this.loadTeams();
          this.showAlertMessage(`Equipo ${action} correctamente`, 'success');
        },
        error: () => this.showAlertMessage('No se pudo actualizar el equipo', 'error')
      });
    }
  }
}
