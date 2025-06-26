import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Pool {
  id: number;
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class PoolService {
  private readonly BASE_URL = 'http://localhost:8081/api/pools';

  constructor(private http: HttpClient) {}

  getAllPools() {
    return this.http.get<Pool[]>(this.BASE_URL);
  }
} 