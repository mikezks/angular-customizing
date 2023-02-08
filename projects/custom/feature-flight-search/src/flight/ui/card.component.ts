import { RouterLinkWithHref } from '@angular/router';
import { DatePipe, NgStyle } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Flight } from '../model/flight';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    NgStyle, DatePipe,
    RouterLinkWithHref
  ],
  template: `
    <div
      class="card"
      [ngStyle]="{ 'background-color': selected ? 'rgb(204, 197, 185)' : 'white' }"
    >
      <div class="card-header">
        <h2 class="card-title">{{ item?.from }} - {{ item?.to }}</h2>
      </div>

      <div class="card-body">
        <p>Flight-No.: #{{ item?.id }}</p>
        <p>Flight-No.: #{{ item?.date | date : "dd.MM.yyyy HH:mm" }}</p>
        <p>
          <button
            (click)="toggleSelection()"
            class="btn btn-info btn-sm"
            style="min-width: 85px; margin-right: 5px">
            {{ selected ? "Remove" : "Select" }}
          </button>
          <a
            [routerLink]="['../edit', item?.id]"
            class="btn btn-success btn-sm"
            style="min-width: 85px; margin-right: 5px"
          >
            Edit
          </a>
          <a
            [routerLink]="['../../ticket/search', { flightId: item?.id }]"
            class="btn btn-warning btn-sm"
            style="min-width: 85px"
          >
            Bookings
          </a>
        </p>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() item?: Flight;

  private _selected = false;
  get selected() {
    return this._selected;
  }
  @Input() set selected(s: boolean) {
    this._selected = s;
  }

  @Output() selectedChange = new EventEmitter<boolean>();

  toggleSelection(): void {
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
  }
}
