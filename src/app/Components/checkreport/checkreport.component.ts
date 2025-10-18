import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, switchMap, map } from 'rxjs';
import Swal from 'sweetalert2';

declare var bootstrap: any;

import { ReportService } from '../../Services/appServices/checkReportServices/report.service';
import { EquipoService } from '../../Services/appServices/equipoServices/equipo';
import { User } from '../../Services/appServices/userServices/user';

@Component({
  selector: 'app-checkreport',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkreport.component.html',
  styleUrls: ['./checkreport.component.css']
})
export class CheckreportComponent implements OnInit {
  private refresh$ = new BehaviorSubject<void>(undefined);
  reports$!: Observable<any[]>;

  equipos: any[] = [];
  filterText = '';

  private modalRef: any;

  estado = '';
  observaciones = '';
  equipoId!: number;
  userId!: number;

  private isBrowser = false;

  constructor(
    private reportService: ReportService,
    private equipoService: EquipoService,
    private userService: User,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    this.userId = this.userService.getLoggedUserId() ?? 0;

    this.reports$ = this.refresh$.pipe(
      switchMap(() =>
        this.reportService.getReports().pipe(
          map(reports => this.filterReports(reports))
        )
      )
    );

    this.equipoService.getTeams().subscribe(data => (this.equipos = data));

    import('bootstrap').then(b => ((window as any).bootstrap = b));

    this.loadReports();
  }

  filterReports(reports: any[]): any[] {
    const search = this.filterText.trim().toLowerCase();
    if (!search) return reports;

    return reports.filter(r =>
      r.Equipo?.nombres?.toLowerCase().includes(search) ||
      r.User?.nombres?.toLowerCase().includes(search) ||
      r.estado?.toLowerCase().includes(search) ||
      r.observaciones?.toLowerCase().includes(search)
    );
  }

  loadReports() {
    this.refresh$.next();
  }

  openModal() {
    if (!this.isBrowser) return;
    const modalEl = document.getElementById('addReportModal');
    if (modalEl && (window as any).bootstrap) {
      this.modalRef = new (window as any).bootstrap.Modal(modalEl);
      this.modalRef.show();
    }
  }

  closeModal() {
    if (this.modalRef) this.modalRef.hide();
  }

  saveReport() {
    if (!this.equipoId || !this.estado) {
      Swal.fire('Error', 'Por favor completa todos los campos obligatorios.', 'warning');
      return;
    }

    const newReport = {
      equipoId: this.equipoId,
      userId: this.userId,
      estado: this.estado,
      observaciones: this.observaciones
    };

    this.reportService.addReport(newReport).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Chequeo guardado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
        this.loadReports();
        this.clearModal();
        this.closeModal();
      },
      error: () => Swal.fire('Error', 'No se pudo guardar el reporte.', 'error')
    });
  }

  clearModal(){
    this.equipoId = 0;
    this.estado = '';
    this.observaciones = '';
  }
}
