import { Component, inject, OnInit } from '@angular/core';
import { EquipoService } from '../../Services/appServices/equipoServices/equipo';
import { SedeService } from '../../Services/appServices/sedesServices/sede.service';
import { ServiciosService } from '../../Services/appServices/serviciosServices/servicios.service';
import { TipoEquipoService } from '../../Services/appServices/tipoEquipoServices/tipo-equipo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-equipos-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipos-lista.component.html',
  styleUrls: ['./equipos-lista.component.css']
})
export class EquiposListaComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  filterText: string = "";
  isModalVisible = false;
  selectedTeam: any = {};
  teamTypes: any[] = [];
  services: any[] = [];
  branches: any[] = [];

  alertMessage: string = "";
  alertType: 'success' | 'error' = 'success';
  showAlert: boolean = false;

  constructor(
    private teamService: EquipoService,
    private branchService: SedeService,
    private servicesService: ServiciosService,
    private teamTypeService: TipoEquipoService,
  ) { }

  router = inject(Router);

  ngOnInit(): void {
    this.loadTeams();
    this.teamTypeService.getTiposEquipo().subscribe(res => this.teamTypes = res);
    this.servicesService.getServicios().subscribe(res => this.services = res);
    this.branchService.getSedes().subscribe(res => this.branches = res);
  }


  showAlertMessage(message: string, type: 'success' | 'error' = 'success') {
    Swal.fire({
      icon: type === 'success' ? 'success' : 'error',
      title: message, showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).then(() => {
      this.loadTeams();
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (res) => {
        this.teams = res;
        this.filteredTeams = [...this.teams];
      },
      error: (err) => console.error(err)
    });
  }

  filterTeams() {
    if (!this.filterText || this.filterText.trim() === '') {
      this.filteredTeams = [...this.teams];
      return;
    }

    const filterLower = this.filterText.trim().toLowerCase();

    this.filteredTeams = this.teams.filter(team =>
      (team.nombres?.toLowerCase().includes(filterLower)) ||
      (team.marca?.toLowerCase().includes(filterLower)) ||
      (team.modelo?.toLowerCase().includes(filterLower)) ||
      (team.serie?.toLowerCase().includes(filterLower))
    );
  }

  openModal(team: any) {
    this.selectedTeam = { ...team };
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  saveChanges(event: Event) {
    event.preventDefault();

    this.teamService.editTeam(this.selectedTeam.id, this.selectedTeam).subscribe({
      next: (res) => {
        const index = this.teams.findIndex(t => t.id === res.id);
        if (index !== -1) this.teams[index] = res;
        this.filterTeams();
        this.showAlertMessage('¡Equipo actualizado correctamente!', 'success');
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.showAlertMessage('Error al actualizar el equipo', 'error');
      }
    });
  }

  toggleTeamActive(team: any) {
    const action = team.activo ? 'deshabilitar' : 'habilitar';

    Swal.fire({
      title: `¿Seguro que deseas ${action} este equipo?`,
      text: `El equipo será ${action === 'habilitar' ? 'activado nuevamente' : 'desactivado temporalmente'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTeam = { ...team, activo: !team.activo };

        this.teamService.editTeam(team.id, updatedTeam).subscribe({
          next: (res) => {
            const index = this.teams.findIndex(t => t.id === team.id);
            if (index !== -1) this.teams[index] = res;
            this.showAlertMessage(`Equipo ${team.activo ? 'deshabilitado' : 'habilitado'} correctamente`, "success");
            this.loadTeams();
          },
          error: (err) => {
            console.error(err);
            this.showAlertMessage('Error al actualizar el equipo', 'error');
          }
        });
      }
    });
  }


}
