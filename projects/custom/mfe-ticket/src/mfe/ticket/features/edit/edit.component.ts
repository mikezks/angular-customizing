import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { BookingService } from './../../logic/data-access/booking.service';


@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html'
})
export class EditComponent {
  editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    passengerId: [0],
    flightId: [0],
    bookingDate: [''],
    flightClass: [0],
    seat: ['']
  });
  #route = inject(ActivatedRoute);
  #bookingService = inject(BookingService);

  ngOnInit(): void {
    this.#route.paramMap.pipe(
      map(params => +(params.get('id') || -1)),
      filter(id => id > -1),
      switchMap(id => this.#bookingService.findById(id))
    ).subscribe(
      booking => this.editForm.patchValue({ ...booking })
    );
  }

  save(): void {
    this.#bookingService.save(this.editForm.getRawValue())
      .subscribe();
  }
}
