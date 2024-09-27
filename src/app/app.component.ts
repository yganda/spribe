import {Component, OnDestroy} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { countryValidator, userNameValidator } from './shared/validators';
import { ApiService } from './shared/services/api.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements  OnDestroy {
  public cards = new FormArray<FormGroup<{
    country: FormControl<string | null>;
    userName: FormControl<string | null>;
    birthday: FormControl<string | null>;
  }>>([]);

  public inProgressOfSubmit = false;

  private timerSubscription: Subscription | null = null;
  remainingTime: number = 0;
  totalDuration: number = 5;

  constructor(
    private apiService: ApiService
  ) {
  }

  submitAllForms(): void {
    this.cards.disable();
    this.inProgressOfSubmit = true;
    this.startTimer();
    console.log('submit forms');
  }

  cancelSubmit(): void {
    this.cards.enable();
    this.inProgressOfSubmit = false;
    this.cancelTimer();
    console.log('subnit is canceled');
  }

  addCard(): void {
    const newCard = new FormGroup({
      country: new FormControl('', [Validators.required, countryValidator()]),
      userName: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [userNameValidator(this.apiService)],
        updateOn: 'change'
      }),
      birthday: new FormControl(''),
    });
    this.cards.push(newCard);
  }

  removeCard(index: number): void {
    this.cards.removeAt(index);
  }

  getErrorsCount(): number {
    return this.cards.controls.filter(control => control.invalid).length;
  }

  startTimer() {
    this.remainingTime = this.totalDuration;

    const countdown$ = timer(0, 1000)
      .subscribe(val => {
        this.remainingTime = this.totalDuration - val;
        if (this.remainingTime === 0) {
          this.apiService.submitForm(this.cards.value).subscribe(() => {
            this.cancelSubmit();
            this.cards.reset();
          })
        }
      });

    this.timerSubscription = countdown$;
  }

  cancelTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
      console.log('Timer canceled');
    }
  }

  ngOnDestroy() {
    this.cancelTimer();
  }
}

