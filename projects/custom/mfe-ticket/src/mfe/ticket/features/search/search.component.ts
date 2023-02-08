import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { LetModule } from '@ngrx/component';
import { asyncScheduler, BehaviorSubject, filter, iif, map, observeOn, skip, startWith, switchMap, tap } from 'rxjs';
import { Booking } from '../../logic/model/booking';
import { BookingService } from './../../logic/data-access/booking.service';


export interface BookingFilter {
  bookingId?: number;
  flightId?: number;
  passengerId?: number
}


@Component({
  selector: 'app-ticket-search',
  standalone: true,
  imports: [
    NgIf, NgFor, DatePipe,
    RouterLinkWithHref,
    FormsModule,
    LetModule
  ],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  bookingId?: number;
  flightId? = 1162;
  passengerId?: number;
  #ticketSearch$ = new BehaviorSubject<BookingFilter>({
    bookingId: undefined,
    flightId: undefined,
    passengerId: undefined
  });
  #bookingService = inject(BookingService);
  #route = inject(ActivatedRoute);
  ticketList$ = this.#ticketSearch$.pipe(
    skip(1),
    switchMap(filter => iif(
      () => filter.bookingId != null,
      this.#bookingService.findById(filter.bookingId!).pipe(
        map(booking => [booking])
      ),
      this.#bookingService.find(filter.flightId, filter.passengerId),
    )),
    startWith([])
  );
  selectedTicket?: Booking;

  ngOnInit(): void {
    this.#route.paramMap.pipe(
      filter(params => !!params.keys.length),
      tap(params => {
        this.flightId = undefined;
        this.bookingId = +(params.get('bookingId') ?? NaN) || this.bookingId!;
        this.flightId = +(params.get('flightId') ?? NaN) || this.flightId!;
        this.passengerId = +(params.get('passengerId') ?? NaN) || this.passengerId!;
      }),
      observeOn(asyncScheduler),
      tap(() => this.search())
    ).subscribe();
  }

  search(): void {
    this.#ticketSearch$.next({
      bookingId: this.bookingId,
      flightId: this.flightId,
      passengerId: this.passengerId
    });
  }

  toggleSelection(ticket: Booking) {
    this.selectedTicket = this.selectedTicket === ticket ? undefined : ticket;
  }
}
