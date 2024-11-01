import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { COCHERAS } from '../../interfaces/cochera';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { EstacionamientoService } from '../../services/estacionamiento.service';
import { CocherasService } from '../../services/cocheras.service';
import { Estacionamiento } from '../../interfaces/estacionamiento';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrls: ['./estado-cocheras.component.scss']
})
export class EstadoCocherasComponent implements OnInit {
cobrarEstacionamiento(arg0: number) {
throw new Error('Method not implemented.');
}
agregarFila() {
throw new Error('Method not implemented.');
}
  titulo = 'ESTADO DE COCHERAS';
  header = {
    nro: 'Nro',
    disponibilidad: 'Disponibilidad',
    ingreso: 'Ingreso',
    acciones: 'Acciones'
  };
  filas: COCHERAS[] = [];
  estacionamientos = inject(EstacionamientoService);
  auth = inject(AuthService);
  cocheras = inject(CocherasService);

  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    this.cocheras.cocheras().then((cocheras: COCHERAS[]) => {
      this.filas = [];
      cocheras.forEach(cochera => {
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        });
      });
    });
  }

  
  eliminarFila(cocheraId: number, event: Event) {
    event.stopPropagation();
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        fetch(`http://localhost:4000/cocheras/${cocheraId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.auth.getToken() ?? ""}`
          }
        }).then(() => this.traerCocheras());
      }
    });
  }

  cambiarDisponibilidadCocheras(cocheraId: number, deshabilitada: boolean, event: Event) {
    event.stopPropagation();
    const url = `http://localhost:4000/cocheras/${cocheraId}/${deshabilitada ? 'enable' : 'disable'}`;
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.auth.getToken() ?? ''}`
      }
    }).then(() => this.traerCocheras());
  }

  abrirModalNuevoEstacionamiento(idCochera: number) {
    Swal.fire({
      title: "Ingrese la patente del vehiculo",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => !value ? "Ingrese una patente válida" : null
    }).then(res => {
      if (res.isConfirmed && res.value) {
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
          this.traerCocheras();
        }).catch((error: any) => {
          console.error("Error al abrir el estacionamiento:", error);
        });
      }
    });
  }
}