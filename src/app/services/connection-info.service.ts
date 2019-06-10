import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionInfoService {
  public scanList = [];
  constructor() { }
}
