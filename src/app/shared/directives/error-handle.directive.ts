import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appErrorHandle]',
})
export class ErrorHandleDirective implements OnInit {
  errorId: string = '';

  validityChangeSubscription!: Subscription;

  constructor(
    private elRef: ElementRef,
    private control: NgControl,
  ) { }

  @HostListener('blur', ["$event"])
  handleBlurEvent() {
    if (this.control?.value == null || this.control.value == '') {
      if (this.control?.errors) this.showError();
      else this.removeError();
    }
  }

  ngOnInit(): void {
    if (this.control?.statusChanges) {
      this.validityChangeSubscription = this.control.statusChanges.subscribe(
        (status) => {
          if (status == 'INVALID') {
            this.showError();
          } else {
            this.removeError();
          }
        }
      )
    }
  }

  private showError() {
    this.removeError();
    this.errorId = `${new Date().getTime()}-error-msg`;
    const error = `<div style="color:red; font-size: 12px;" id="${this.errorId}">Please provide a correct ${this.control?.name}</div>`;
    this.elRef.nativeElement.parentElement.insertAdjacentHTML('beforeend', error);
  }

  private removeError(): void {
    const errorElement = document.getElementById(this.errorId);
    if (errorElement) errorElement.remove();
  }

  ngOnDestroy(): void {
    this.validityChangeSubscription.unsubscribe();
  }
}
