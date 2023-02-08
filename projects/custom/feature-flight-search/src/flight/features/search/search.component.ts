import { RouterLinkWithHref } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight } from '../../model/flight';
import { CardComponent } from '../../ui/card.component';
import { DynFlightService } from '@flight42/logic-flight';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [
    NgIf, NgFor, DatePipe,
    RouterLinkWithHref,
    FormsModule,
    CardComponent
  ],
  templateUrl: './search.component.html'
})
export default class SearchComponent {
  from = 'Paris';
  to = 'New York';
  urgent = false;
  selectedFlight?: Flight;
  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };
  #flightService = inject(DynFlightService);

  get flights() {
    return this.#flightService.get.flights;
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.#flightService.get.load(this.from, this.to, this.urgent);
  }

  select(flight: Flight): void {
    this.selectedFlight = this.selectedFlight === flight ? undefined : flight;
  }

  delay(): void {
    this.#flightService.get.delay();
  }
}
