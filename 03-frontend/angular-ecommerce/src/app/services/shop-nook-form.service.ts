import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../utilities/country';
import { map } from 'rxjs/operators';
import { State } from '../utilities/state';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShopNookFormService {

  private countriesApiUrl = environment.shopnookApiUrl + '/countries';
  private statesApiUrl = environment.shopnookApiUrl + '/states';


  constructor(private httpClient: HttpClient) { }

  getCountriesList(): Observable<Country[]> {

    return this.httpClient.get<GetCountriesListResponse>(this.countriesApiUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStatesList(countryCode: string): Observable<State[]> {

    // searching url
    const searchStatesApiUrl = `${this.statesApiUrl}/search/findStatesByCountryCode?code=${countryCode}`;

    return this.httpClient.get<GetStatesListResponse>(searchStatesApiUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  fetchCreditCardMonths(firstMonth: number): Observable<number[]> {

    let data: number[] = [];
    
    // creating an array for "Months" by starting at the current month and arriving until the previous one

    for (let cardMonths = firstMonth; cardMonths <= 12; cardMonths++) {
      data.push(cardMonths);
    }

    return of(data);
  }

  fetchCreditCardYears(): Observable<number[]> {

    let data: number[] = [];

    // creating an array for "years" by starting at the current year and arriving until next 15 ones

    
    const firstYear: number = new Date().getFullYear();
    const lastYear: number = firstYear + 15;

    for (let cardYear = firstYear; cardYear <= lastYear; cardYear++) {
      data.push(cardYear);
    }

    return of(data);
  }
}

interface GetCountriesListResponse
{
  _embedded: {
    countries: Country[];
  }
}

interface GetStatesListResponse {
  _embedded: {
    states: State[];
  }
}
