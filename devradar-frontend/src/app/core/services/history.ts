import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HistoryPage {
  data: HistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface HistoryItem {
  id: number;
  city: string;
  temperature: number;
  condition: string;
  searchedAt: string;
}

@Injectable({ providedIn: 'root' })
export class History {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHistory(page = 1, limit = 10): Observable<HistoryPage> {
    return this.http.get<HistoryPage>(`${this.baseUrl}/history`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }
}