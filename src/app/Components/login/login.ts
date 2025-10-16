import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { User } from '../../Services/appServices/userServices/user';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
formulario: FormGroup;
  userServices = inject(User);
  router = inject(Router);

  constructor(
    private formBuilder: FormBuilder,

  ) {
    this.formulario = new FormGroup({
      usuarion: new FormControl(),
      contraseña: new FormControl()
    });
  }

  ngOnInit(): void {
    localStorage.setItem('utoken', '');
  }

  async onSubmit() {
    try {
      const response = await this.userServices.login(this.formulario.value);
      if (!response.error) {
        localStorage.setItem('utoken', response.token);
        if (this.getDecodedAccessToken(localStorage.getItem('utoken')!).rol === 'SUPERADMIN') {
          this.router.navigate(['/superadmin']);
        }
      }
    } catch {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario o contraseña incorecto',
        text: 'Verifique los campos.'
      })
    }
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }
}
