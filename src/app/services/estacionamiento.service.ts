import { inject, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';


@Injectable({
  providedIn: 'root'
})
export class EstacionamientoService {

  auth = inject(AuthService);
  cobrarEstacionamiento: any;
 
  estacionamiento():Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization : "Bearer " + (this.auth.getToken() ?? ''),
        "content-type": "application/Json"
      }
    }).then(r=> r.json());

   }
   buscarEstacionamientoActivo(cocheraId: number  ){
    return this.estacionamiento().then(estacionamientos => {
      let buscando= null
      for (let estacionamiento of estacionamientos) {
        if(estacionamiento.idCochera=== cocheraId &&
          estacionamiento.horaEgreso=== null){
            buscando= estacionamiento;
          }

      }
      return buscando;
    });
  }
    estacionarAuto(patenteAuto:string, idCochera:number){
      console.log('mandando abrir cochera con datos',patenteAuto,idCochera)
    return fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        Authorization : "Bearer " + (this.auth.getToken() ?? ''),
        "content-type": "application/Json"
      },
      body:JSON.stringify({
        patente: patenteAuto, 
        idCochera: idCochera

      })
    }).then(r=> r.json());
  }



   

}







