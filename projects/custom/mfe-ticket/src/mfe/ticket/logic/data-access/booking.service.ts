import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../model/booking';


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  bookings: Booking[] = [];
  baseUrl = `https://demo.angulararchitects.io/api`;
  #http = inject(HttpClient);

  load(flightId?: number, passengerId?: number): void {
    this.find(flightId, passengerId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
      },
      error: (err) => console.error('Error loading bookings', err),
    });
  }

  find(flightId?: number, passengerId?: number): Observable<Booking[]> {
    const url = [this.baseUrl, 'booking'].join('/');

    const params = new HttpParams()
      .set('flightId', flightId ?? '')
      .set('passengerId', passengerId ?? '');
    const headers = new HttpHeaders().set('Accept', 'application/json');

    return this.#http.get<Booking[]>(url, { params, headers });
  }

  findById(bookingId: number): Observable<Booking> {
    const url = [this.baseUrl, 'booking'].join('/');
    const params = new HttpParams().set('id', bookingId);

    return this.#http.get<Booking>(url, { params });
  }

  save(booking: Booking): Observable<Booking> {
    const url = [this.baseUrl, 'booking'].join('/');

    return this.#http.post<Booking>(url, booking);
  }
}
