import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Holiday {
  date: string;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http: HttpClient) { }

  getHolidays(year: number): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`https://brasilapi.com.br/api/feriados/v1/${year}`);
  }
}
