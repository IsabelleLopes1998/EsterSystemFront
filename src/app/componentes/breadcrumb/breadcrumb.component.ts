import { Component,Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: BreadcrumbItem[] = [];
 
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

export interface BreadcrumbItem {
  label: string;
  url: string;
}


