import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
 
  datosLogin: Login= {
    username: 'admin',
    password: 'admin'
  }
  datosLogin2:any;
  router = inject(Router)
  auth = inject(AuthService)

Login(user:HTMLInputElement , pass:HTMLInputElement){
  console.log("Login");
  this.datosLogin2={
    username: user.value,
    password:pass.value
  }
  this.auth.login(this.datosLogin2)
  .then(ok => {
    if (ok) {
      this.router.navigate(['/estado-cocheras']);
    } else
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Credencial incorrecta",
      footer: '<a href="#">Why do I have this issue?</a>'
    });
  }

  )


} 

}
