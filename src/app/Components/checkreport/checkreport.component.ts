import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../Services/appServices/checkReportServices/report.service';
import { EquipoService } from '../../Services/appServices/equipoServices/equipo';
import { User } from '../../Services/appServices/userServices/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkreport',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkreport.component.html',
  styleUrls: ['./checkreport.component.css']
})
export class CheckreportComponent implements OnInit {
  equipos: any[] = [];
  reports: any[] = [];
  filteredReports: any[] = [];
  filterText = '';

  // Modal
  isModalVisible = false;

  // Nuevo reporte
  estado = '';
  observaciones = '';
  equipoId!: number;
  userId!: number;

  loading = true;

  constructor(
    private reportService: ReportService,
    private equipoService: EquipoService,
    private userService: User
  ) {}

  ngOnInit() {
    this.userId = this.userService.getLoggedUserId() ?? 0;
    this.loadReports();
    this.loadEquipos();
  }

  loadReports() {
    this.reportService.getReports().subscribe(data => {
      console.log(data);
      this.reports = data;
      this.filteredReports = [...this.reports];
      this.loading = false;
    });
  }

  loadEquipos() {
    this.equipoService.getTeams().subscribe(data => {this.equipos = data; });
  }

  filterReports() {
    const search = this.filterText.toLowerCase();
    this.filteredReports = this.reports.filter(r =>
      r.Equipo?.nombres?.toLowerCase().includes(search) ||
      r.User?.nombres?.toLowerCase().includes(search) ||
      r.estado?.toLowerCase().includes(search) ||
      r.observaciones?.toLowerCase().includes(search)
    );
  }


  openModal() {
    this.isModalVisible = true;
    this.estado = '';
    this.observaciones = '';
    this.equipoId = 0;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  saveReport() {
    if (!this.equipoId || !this.estado) return;

    const newReport = {
      equipoId: this.equipoId,
      userId: this.userId,
      estado: this.estado,
      observaciones: this.observaciones
    };

    this.reportService.addReport(newReport).subscribe(() => {
      this.loadReports();
      this.closeModal();
    });
  }
}
