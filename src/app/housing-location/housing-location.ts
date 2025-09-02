import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationInterface } from '../housing-location';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-housing-location',
  imports: [CommonModule, RouterModule],
  templateUrl: './housing-location.html',
  styleUrls: ['./housing-location.scss']
})
export class HousingLocationComponent {
  @Input() housingLocation!: HousingLocationInterface;
}
