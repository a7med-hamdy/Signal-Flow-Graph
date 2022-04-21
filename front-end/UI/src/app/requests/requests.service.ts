import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  Headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  url = "http://localhost:8080";

  constructor(private http: HttpClient){}

  /******************************************************************
   * Craeation & Deletion Signal Floe Graph requests                *
   ******************************************************************/
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

  /******************************************************************
   * Solution requests                                              *
   ******************************************************************/
  //checks if it's a valid Signal-Flow-Graph or not 
  validate(){
    return this.http.post<any>(`${this.url}/validate`, {})
  }

  //solves & stores the solution in backend
  solve(){
    return this.http.post<any>(`${this.url}/solve`, {})
  }

  get_forward_paths(){
    return this.http.get<any>(`${this.url}/solve/forward-paths`)
    .subscribe(response => { 
      //store & diplay the forward paths
      console.log(response); 
    });
  }

  get_loops(){
    return this.http.get<any>(`${this.url}/solve/loops`)
    .subscribe(response => { 
      //store & diplay the loops
      console.log(response); 
    });
  }

  get_non_touching_loops(){
    return this.http.get<any>(`${this.url}/solve/non-touching-loops`)
    .subscribe(response => { 
      //store & diplay the non-touching-loops
      console.log(response); 
    });
  }

  get_determinants(){
    return this.http.get<any>(`${this.url}/solve/determinants`)
    .subscribe(response => { 
      //store & diplay the determinants
      console.log(response); 
    });
  }

  get_overall_gain(){
    return this.http.get<any>(`${this.url}/solve/overall-gain`)
    .subscribe(response => { 
      //store & diplay the overall gain
      console.log(response); 
    });
  }
}
