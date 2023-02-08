import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '@flight42/logic-flight';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-flight-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [new Date().toISOString()],
    delayed: [false]
  });
  #route = inject(ActivatedRoute);
  #flightService = inject(FlightService);

  ngOnInit(): void {
    this.#route.paramMap.pipe(
      map(params => +(params.get('id') || -1)),
      filter(id => id > -1),
      switchMap(id => this.#flightService.findById(id))
    ).subscribe(
      flight => this.editForm.patchValue({ ...flight })
    );
  }

  save(): void {
    this.#flightService.save(this.editForm.getRawValue())
      .subscribe();
  }
}
