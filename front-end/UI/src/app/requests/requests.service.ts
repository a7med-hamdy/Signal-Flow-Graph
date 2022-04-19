import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  Headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  url = "http://localhost:8080";

  constructor(private http: HttpClient){}

  /**************************************************
   * Craeation & Deletion Graph requests            *
   **************************************************/
  // > Node < creation request
  add_node(name: string){
    return this.http.post<any>(`${this.url}/+node/${name}`, {}).subscribe(data =>{
      console.log(data);
    });
  }

  // > Edge < creation request
  add_edge(from: string, to: string, weight: number){
    let info = `/${from}/${to}/${weight}`
    return this.http.post<any>(`${this.url}/+edge${info}`, {});
  }

  // clear the whole graph request
  clear(){
    return this.http.delete<any>(`${this.url}/clear`).subscribe(data =>{
      console.log(data);
    });
  }

  /**************************************************
   * Solution requests                              *
   **************************************************/
  validate(){
    return this.http.post<any>(`${this.url}/validate`, {})
  }
  // start simulation request
  solve(){
    return this.http.post<any>(`${this.url}/solve`, {})
  }

  /* 
  // stop simulation request
  save(shapes:string){
    let params = new HttpParams();
    params = params.append('shape', shapes);
    return this.http.post<any>(`${this.url}/save`, params).subscribe()
  }
  load(){
    return this.http.post<any>(`${this.url}/load`,{})
  }
  // replay a specified simulation request
  replay(){
    return this.http.post<any>(`${this.url}/replay`, {})
  }
  */
}
