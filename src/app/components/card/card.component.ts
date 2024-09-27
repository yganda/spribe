import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, map, Observable, OperatorFunction } from 'rxjs';
import { Country } from '../../shared/enum/country';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

const currentDay = new Date();

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardComponent),
      multi: true
    }
  ]
})
export class CardComponent implements ControlValueAccessor {
  @Input() cardId: number = 0;
  @Input() disabled = false;
  @Output()
  cardToRemove: EventEmitter<number> = new EventEmitter<number>();
  readonly today: NgbDate = new NgbDate(currentDay.getFullYear(), currentDay.getMonth()+1, currentDay.getDate());

  @Input() card = new FormGroup({
    country: new FormControl(''),
    userName: new FormControl(''),
    birthday: new FormControl(''),
  });

  search: OperatorFunction<string, Country[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			map((term) =>
				term === '' ? [] : Object.values(Country).filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
			),
		);

  onChange = (_: any) => {};
  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.card.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.card.setValue(value, { emitEvent: true });
  }

  removeCard(): void {
    this.cardToRemove.emit(this.cardId);
  }

}

