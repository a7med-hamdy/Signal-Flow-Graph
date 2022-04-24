import { Component, OnInit } from '@angular/core';
import  Konva from 'konva';
import { ShapeWithText } from './shapeWithText'
import { Arrow } from './arrow';
import { RequestsService } from '../requests/requests.service';
import { shapeFactory } from './shapeFactory';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  TableHeaders:any = ["Paths", "Loops", "none touching Loops", "Answer"];
  hideResults = true; Choosing = false; hasSource = false;  hasSink = false;
  sourceNode!:any;  sinkNode!:any;
  pointers:any[] = [];
  shapes:any[] = [];
  paths:any[] = [];
  loops:any[] = [];
  noneTouchingLoops:any[] = [];
  answer:any[] = [];
  stage!:Konva.Stage;
  layer!:Konva.Layer;
  numOfMs = 0;
  results:any[] = [];
  message: any;
  name: string = '';
  constructor(private req:RequestsService) { }

  ngOnInit() {
    //create the stage on start
    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layer = new Konva.Layer();//create layer on start
    this.stage.add(this.layer);//add the layer to the stage on start
  }

  /***********************Graph Arrays manipulations******************** */

  /**
   * filter shapes array according to given element
   *
   * @param criteria group to be filtered with
   * @returns filtered array
   */
  getShapeWithTextFromArray(criteria:any){
    var x = this.shapes.filter(function(element){
      return element.getShapeWithText() == criteria;
    });
    return x[0];
  }
  /**
   * filter shapes array according to given name
   *
   * @param name name of the shape element
   * @returns filtered array
   */
  getShapeWithTextFromArrayByName(name:string){
    var x = this.shapes.filter(function(element){
      return element.getShapeWithText().name() == name;
    });
    return x[0];
  }

  /**********************************************BOARD FUNCTIONS************************************************** */
  /**
   * starts the simulation
   */
  startSolving(){
    this.hideResults = false;
    this.req.validate().subscribe(data =>{    });
    this.req.get_forward_paths().subscribe(data =>{
      this.paths.push(data);
      this.results.push(this.paths);
    })
    this.req.get_loops().subscribe(data =>{
      this.loops.push(data);
      this.results.push(this.loops);
    });
    this.req.get_non_touching_loops().subscribe(data =>{
      this.noneTouchingLoops.push(data);
      this.results.push(this.noneTouchingLoops);
    });
    this.req.get_overall_gain().subscribe(data => {
      this.answer.push(data);
      this.results.push(this.answer);
    });
  }
  updateGains(){
    var arr = [];
    for(var i = 0; i < this.pointers.length;i++){
        arr.push([this.pointers[i].getSource().name(), this.pointers[i].getDestination().name(), this.pointers[i].getText().text()]);
    }
    console.log(arr);
    //update your gains here using the array;
  }
  /**
   * clears all the board
   */
  clearAll(){
    this.req.clear();
    this.shapes = []; this.pointers = []; this.results = [];  this.paths = [];
    this.loops = [];  this.noneTouchingLoops = [];  this.answer = [];
    this.layer.destroyChildren();
    this.numOfMs = 0;
    this.Choosing = false;    this.hasSource = false;   this.hasSink = false;   this.hideResults = true;
    this.sourceNode = null;   this.sinkNode = null;
  }
  /** Adds node to the board
   *
   *
   */
  add(name:string, color:string){
    var pos:any;
    this.stage.on("mouseenter",()=>{this.stage.container().style.cursor = "crosshair"})
    this.stage.on("click", ()=>{
      pos = this.stage.getPointerPosition();
      this.stage.container().style.cursor = "default";
      this.stage.off("mouseenter");
      this.stage.off("click");
      var sWithT:any = shapeFactory.buildNode(pos.x,pos.y,this.numOfMs,color);
      if(name == "source")
        this.sourceNode = sWithT;
      if(name == "sink")
        this.sinkNode = sWithT;
      this.shapes.push(sWithT);
      this.layer.add(sWithT.getShapeWithText());
      this.numOfMs++;
      this.req.addNode(sWithT.getShapeWithText().name());
    });

  }


  /**
   * adds arrows between two shapes
   */
  addArrow(){
    console.log("add Arrows!");
    var arrow;
    var source:any;
    var destination:any;
    var clicks = 0;
    this.Choosing = true
    var component = this;
    this.stage.on("mouseenter",()=>{this.stage.container().style.cursor = "crosshair"})
    this.stage.on("click",function(e){
      clicks++;
      console.log(e.target)
      //if the clicked shape is a konva shape
      if(e.target instanceof Konva.Shape){
        console.log("Hi")
        //gets its source group
        if (clicks == 1){
          console.log("1stClick")
          source = e.target.getParent();
        }
        //gets its destination group
        if(clicks == 2){
          console.log("2ndClick")
          destination = e.target.getParent();
        }
      }
      if(clicks >= 2){
        console.log("Two clicks")
        if(source != null && destination != null && source != destination){
          console.log("adding arrows!")
          try{
          //get the source and destination shapes
          var x = component.getShapeWithTextFromArray(source);
          var y = component.getShapeWithTextFromArray(destination);
          var curveoffset = Math.max(x.getFollowersOut().length, y.getFollowersIn().length);
          var curveHorizontal = 1;
          if(x.IsPointingIn(y.getShapeWithText())){
            curveHorizontal = -1;
            curveoffset = Math.max(x.getFollowersOut().length, y.getFollowersIn().length);
          }
          var arrow = shapeFactory.buildBranch(source,destination,curveoffset, curveHorizontal); //create new arrow component
          //create new arrow component
          x.addFollowerOut(arrow);
          y.addFollowerIn(arrow);

          component.pointers.push(arrow);    //add the arrow to the shapes's arrays
          component.layer.add(arrow.getBranch());  //add arrow to the layer to display
          component.req.addEdgeWithWeight(x.getShapeWithText().name(),y.getShapeWithText().name(), Number(arrow.getText().text()));
        }
        catch{
          component.Choosing=false
          component.stage.off('click');
          component.stage.off("mouseenter");
          component.stage.container().style.cursor = "default";
          return;
        }
        }
        component.Choosing=false
        component.stage.off('click');
        component.stage.off("mouseenter");
        component.stage.container().style.cursor = "default";
      }
    });

  }

}
