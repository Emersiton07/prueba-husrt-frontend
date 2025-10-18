import { Component, OnInit } from '@angular/core';
import { EquipoService } from '../../Services/appServices/equipoServices/equipo';
import { SedeService } from '../../Services/appServices/sedesServices/sede.service';
import { ServiciosService } from '../../Services/appServices/serviciosServices/servicios.service';
import { TipoEquipoService } from '../../Services/appServices/tipoEquipoServices/tipo-equipo.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-equipos-nuevo',
  imports: [
    CommonModule,
    FormsModule,   // <-- asegúrate de que esté aquí
  ],
  templateUrl: './equipos-nuevo.component.html',
  styleUrl: './equipos-nuevo.component.css'
})
export class EquiposNuevoComponent implements OnInit {
  team: any = {
    nombres: '',
    marca: '',
    modelo: '',
    serie: '',
    placa: '',
    registroInvima: '',
    riesgo: 'NA',
    ubicacion: '',
    ubicacionEspecifica: '',
    periodicidadM: 1,
    periodicidadC: 1,
    calibracion: 0,
    calificacion: 0,
    validacion:0,
    tipoEquipoIdFk: null,
    servicioIdFk: null,
    sedeIdFk: null
  };

  teamTypes: any[] = [];
  services: any[] = [];
  branches: any[] = [];

  constructor(
    private teamService: EquipoService,
    private teamTypeService: TipoEquipoService,
    private servicesService: ServiciosService,
    private branchService: SedeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teamTypeService.getTiposEquipo().subscribe(res => this.teamTypes = res);
    this.servicesService.getServicios().subscribe(res => this.services = res);
    this.branchService.getSedes().subscribe(res => this.branches = res);
  }

  goHome() {
    this.router.navigate(['/superadmin']); // Cambia '/' por la ruta de tu home si es diferente
  }

  saveTeam() {
  this.teamService.addTeam(this.team).subscribe({
    next: (res) => {
      Swal.fire({
        icon: 'success',
        title: 'Equipo creado correctamente',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        this.resetForm();       // limpiar formulario
        this.router.navigate(['/superadmin']); // redirigir al home
      });
    },
    error: (err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear el equipo',
        text: err.message || 'Ocurrió un error',
      });
    }
  });
}

  resetForm() {
    this.team = {
      nombres: '',
      marca: '',
      modelo: '',
      serie: '',
      placa: '',
      registroInvima: '',
      riesgo: 'NA',
      ubicacion: '',
      ubicacionEspecifica: '',
      periodicidadM: 1,
      periodicidadC: 1,
      calibracion: false,
      tipoEquipoIdFk: null,
      servicioIdFk: null,
      sedeIdFk: null
    };
  }
}