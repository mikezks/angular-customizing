import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export default function validatePassengerStatus(): ValidatorFn {
  const validStatus = [
    'X', 'Y', '😉'
  ];

  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && !validStatus.includes(control.value)) {
      return {
        passengerStatus: {
          actualStatus: control.value,
          validStatus
        }
      };
    }

    return null;
  }
}


