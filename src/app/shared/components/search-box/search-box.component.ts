import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'shared-search-box',
  templateUrl: './search-box.component.html',
  styles: [
  ]
})
export class SearchBoxComponent implements OnInit, OnDestroy{

  private debouncer:  Subject<string> = new Subject<string>();
  private debouncerSubs?: Subscription;

  @Input()
  public initialValue: string = '';

  @Input()
  public placeholder: string = '';
  
  @Output()
  public onValue = new EventEmitter<string>();

  @Output()
  public onDebounce = new EventEmitter<string>();

  //Se ejecuta cuando se inicia el componente search-box
  ngOnInit(): void {
    this.debouncerSubs = this.debouncer
    //no se realiza el subscribe hasta que el debounceTime se ejecute por completo
    .pipe(
      debounceTime(1000)
    )
    .subscribe(val => {
      this.onDebounce.emit(val);
    })
  }

  //Se destruye la subscripcion al cerrar cada componente
  ngOnDestroy(): void {
    this.debouncerSubs?.unsubscribe();
  }

  emitValue(val: string):void {
    this.onValue.emit(val)
  }

  onKeyPress(searchTerm: string ) {
    this.debouncer.next(searchTerm);
  }

}
