import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-superadmin',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './superadmin.html',
  styleUrls: ['./superadmin.css']
})
export class Superadmin implements OnInit {

  ngOnInit(): void {
    
  }

}
