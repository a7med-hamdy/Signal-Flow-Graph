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
 * Craeation board requests                       *
 **************************************************/
  // > Queue < creation request
  addQueue(){
    return this.http.post<any>(`${this.url}/+Q`, {}).subscribe(data =>{
      console.log(data);
    });
    /* this.req.addQueue().subscribe(done => {
      if(done){
        console.log("Queue added!!")
      }
      else{
        console.log("Error!! Queue wasn't added.")
      }
    }) */
  }

  // > Machine < creation request
  addMachine(){
    return this.http.post<any>(`${this.url}/+M`, {}).subscribe(data =>{
      console.log(data);
    });
    /* this.req.addMachine().subscribe(done => {
      if(done){
        console.log("Machine added!!")
      }
      else{
        console.log("Error!! Machine wasn't added.")
      }
    }) */
  }

  // > Arrow < creation request
  addArrow(from: string, to: string){
    let info = `/${from}/${to}`
    return this.http.post<any>(`${this.url}/+shm${info}`, {});
    /* this.req.addArrow(from, to).subscribe(done => {
      if(done){
        console.log("Arrow added!!")
      }
      else{
        console.log("Error!! Arrow wasn't added.")
      }
    }) */
  }

/**************************************************
 * Getting & Deleting requests                    *
 **************************************************/
  //Getting the graph request (to draw it)
  getGraph(id: number){
    return this.http.get<any>(`${this.url}/getGraph/${id}`)
    /* this.req.getGraph(id).subscribe(done => {
      if(done){
        console.log("Graph received!!")
      }
      else{
        console.log("Error!! Graph wasn't received.")
      }
    }) */
  }

  // clear the whole graph request
  clear(){
    return this.http.delete<any>(`${this.url}/clear`).subscribe(data =>{
      console.log(data);
    });
    /* this.req.clear().subscribe(done => {
      if(done){
        console.log("Graph deleted!!")
      }
      else{
        console.log("Error!! Graph wasn't deleted.")
      }
    }) */
  }

/**************************************************
 * Simulation requests                            *
 **************************************************/
  validate(){
    return this.http.post<any>(`${this.url}/validate`, {})
  }
  // start simulation request
  play(){
    return this.http.post<any>(`${this.url}/play`, {})
    /* this.req.play().subscribe(done => {
      if(done){
        console.log("Simulation started!!")
      }
      else{
        console.log("Error!! Simulation wasn't started.")
      }
    }) */
  }

  // stop simulation request
  save(shapes:string){
    let params = new HttpParams();
    params = params.append('shape', shapes);
    return this.http.post<any>(`${this.url}/save`, params).subscribe()
    /* this.req.stop().subscribe(done => {
      if(done){
        console.log("Simulation stopped!!")
      }
      else{
        console.log("Error!! Simulation wasn't stopped.")
      }
    }) */
  }
  load(){
    return this.http.post<any>(`${this.url}/load`,{})
  }
  // replay a specified simulation request
  replay(){
    return this.http.post<any>(`${this.url}/replay`, {})
    /* this.req.replay(id).subscribe(done => {
      if(done){
        console.log(`Simulation ${id} replayed!!`)
      }
      else{
        console.log(`Error!! Simulation ${id} wasn't replayed.`)
      }
    }) */
  }
}
