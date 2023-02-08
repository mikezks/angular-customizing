import { AbstractControl, ValidatorFn } from "@angular/forms";
import { getCustomizingService } from "../customizing/customizing.service";
import { getDynModule } from "../discovery/discovery.service";

export function noopValidatorFactory<T extends (...args: any[]) => ValidatorFn>(): T {
  return (undefined) as unknown as T;
}

export function dynValidator<T extends (...args: any[]) => ValidatorFn>(
  defaultFn: T,
  dynamicFactory: () => T = noopValidatorFactory,
  filterFn: () => boolean
): T {
  return ((...args: any[]) => (control: AbstractControl) =>
    ((filterFn() && dynamicFactory?.()) || defaultFn)?.(...args)(control)
  ) as T;
}

export function dynModFedValidator<T extends (...args: any[]) => ValidatorFn>(
  defaultFn: T,
  runtimeFnKey?: string
): T {
  return dynValidator(
    defaultFn,
    runtimeFnKey ? () => getDynModule<T>(runtimeFnKey) : undefined,
    () => runtimeFnKey ? getCustomizingService().getState('functions', runtimeFnKey).active : false
  );
}
