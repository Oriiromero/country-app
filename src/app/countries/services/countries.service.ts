import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, map, of } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cash-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';
 
  public cacheStore: CacheStore = {
    byCapital: {term: '', countries: []},
    byCountries: {term: '', countries: []},
    byRegion: {region: '', countries: []}
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private getCountriesReq(url: string): Observable<Country[]>{
    return this.http.get<Country[]>(url).pipe(
      catchError((error) => of([])), //En caso de error devuelve un array vacio (en forma de un nuevo observable)
    );
  }

  private saveToLocalStorage(){
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if(!localStorage.getItem('cacheStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!)
  }

  //Buscar por codigo alpha
  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${code}`;

      return this.http.get<Country[]>(url)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(()=> of(null))
      )
  }

  //Buscar por capital
  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;

    return this.getCountriesReq(url)
    .pipe(
      tap( (countries) => this.cacheStore.byCapital = {term, countries}),
      tap( ()=> this.saveToLocalStorage() )
    );
  }

  //Buscar por pais
  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;

    return this.getCountriesReq(url).pipe(
      tap( (countries) => this.cacheStore.byCountries = {term, countries}),
      tap( ()=> this.saveToLocalStorage() )
    );;
  }

  //Buscar por region
  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;

    return this.getCountriesReq(url).pipe(
      tap( (countries) => this.cacheStore.byRegion = {region, countries}),
      tap( ()=> this.saveToLocalStorage() )
    );;
  }
}
