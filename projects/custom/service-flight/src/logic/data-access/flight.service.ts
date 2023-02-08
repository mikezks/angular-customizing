import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Flight } from "../../model/flight";

@Injectable({
  providedIn: 'root'
})
export default class FlightService {
  flights: Flight[] = [];
  baseUrl = `https://demo.angulararchitects.io/api`;

  #getInitialFlights: () => Flight[] = () => [
    {
      id: 999,
      from: 'New York',
      to: 'LA',
      date: new Date().toISOString(),
      delayed: false
    }
  ];

  load(from: string, to: string, urgent: boolean): void {
    this.find(from, to, urgent).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (err) => console.error('Error loading flights', err),
    });
  }

  find(
    from: string,
    to: string,
    urgent: boolean = false
  ): Observable<Flight[]> {
    return of(this.#getInitialFlights());
  }

  findById(id: number): Observable<Flight> {
    return of(this.#getInitialFlights()[0])
  }

  save(flight: Flight): Observable<Flight> {
    return of(this.#getInitialFlights()[0])
  }

  delay(): void {
  }
}
