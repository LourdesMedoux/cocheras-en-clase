import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cochera } from '../../interfaces/cochera';
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
  filas: Cochera[] = [];
  estacionamientos = inject(EstacionamientoService);
  auth = inject(AuthService);
  cocheras = inject(CocherasService);

  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    this.cocheras.cocheras().then((cocheras: Cochera[]) => {
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
  cobrarEstacionamiento(idCochera: number) {
    this.estacionamientos.buscarEstacionamientoActivo(idCochera).then(estacionamiento => {
      if (!estacionamiento || estacionamiento.length === 0) {
        Swal.fire({
          title: "Error",
          text: "No se encontró un estacionamiento activo para la cochera",
          icon: "error"
        });
        return;
      }

      console.log(estacionamiento)
  
      // Convertir horaIngreso a un objeto Date
      const horaIngreso = new Date(estacionamiento[0].horaIngreso);
      const tiempoTranscurridoMs = new Date().getTime() - horaIngreso.getTime();
      const horas = Math.floor(tiempoTranscurridoMs / (1000 * 60 * 60));
      const minutos = Math.floor((tiempoTranscurridoMs % (1000 * 60 * 60)) / (1000 * 60));
      const precio = (tiempoTranscurridoMs / 1000 / 60 / 60); // Precio por hora, formateado a dos decimales
  
      Swal.fire({
        title: "Cobrar estacionamiento",
        text: `Tiempo transcurrido: ${horas}hs ${minutos}mins - Precio: $${precio.toFixed(2)}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#00c98d",
        cancelButtonColor: "#d33",
        confirmButtonText: "Cobrar",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.estacionamientos.cobrarEstacionamiento(idCochera, estacionamiento[0].patente, precio).then(() => {
            Swal.fire("Estacionamiento cobrado", "El estacionamiento ha sido cobrado correctamente.", "success");
            this.traerCocheras();
          }).catch(error => {
            console.error("Error al cobrar el estacionamiento:", error);
            Swal.fire("Error", "Hubo un error al cobrar el estacionamiento.", "error");
          });
        }
      });
    }).catch(error => {
      console.error("Error al buscar el estacionamiento activo:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al buscar el estacionamiento.",
        icon: "error"
      });
    });
  }
}