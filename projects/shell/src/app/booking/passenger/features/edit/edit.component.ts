import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { dynModFedValidator } from '@flight42/shared-customizing';
import { filter, map, switchMap } from 'rxjs';
import { validatePassengerStatus } from '../../util/validation/passenger-status.validator';
import { PassengerService } from './../../logic/data-access/passenger.service';

@Component({
  selector: 'app-passenger-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html'
})
export class EditComponent {
  editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: [''],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      dynModFedValidator(
        validatePassengerStatus,
        'fn-validate-passenger-status'
      )(['A', 'B', 'C'])
    ]]
  });
  #route = inject(ActivatedRoute);
  #passengerService = inject(PassengerService);

  ngOnInit(): void {
    this.#route.paramMap.pipe(
      map(params => +(params.get('id') || -1)),
      filter(id => id > -1),
      switchMap(id => this.#passengerService.findById(id))
    ).subscribe(
      passenger => this.editForm.patchValue({ ...passenger })
    );
  }

  save(): void {
    this.#passengerService.save(this.editForm.getRawValue())
      .subscribe();
  }
}
