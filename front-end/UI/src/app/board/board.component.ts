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
  TableHeaders:any = ["Paths", "Loops", "non touching Loops", "Paths determinants","Deterimnant","Overall Gain"];
  hideResults = true; Choosing = false; hasSource = false;  hasSink = false;// control booleans
  sourceNode!:any;  sinkNode!:any;//source and sink nodes
  pointers:any[] = [];//arrow array
  shapes:any[] = [];//nodes array
  paths:any[] = [];//resulting paths array
  loops:any[] = [];//resulting loops array
  noneTouchingLoops:any[] = [];//resulting none touching loops array
  pathsDeterminants:any[] = [];//resulting path deterimnants
  determinant:any;//resulting system determinant
  answer:any;//resulting overall gain
  stage!:Konva.Stage;//stage
  layer!:Konva.Layer;//layer
  numOfMs = 0;//number of nodes used for numbering them
  displayError: boolean = true;
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
    window.addEventListener('update',()=>{//listen to update events to update gains automatically
      //console.log('updating');
      this.updateGains();
    });
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
   * starts the solving
   */
  startSolving(){
    this.hideResults = false;
    this.req.validate().subscribe(data=>{
      //console.log(data);
      if(data == true){
        this.displayError = true;
        this.req.solve().subscribe(data =>{//request to solve
          this.req.get_forward_paths().subscribe(data =>{//request paths array
            this.paths = data;
            //console.log(data);
          })
          this.req.get_loops().subscribe(data =>{//request loops array
            this.loops = data;
            //console.log(data);
          });
          this.req.get_non_touching_loops().subscribe(data =>{//request none touching loops array
            this.noneTouchingLoops = data;
            //console.log(data);
          });

          this.req.get_paths_determinants().subscribe(data => {//request paths determinants array
            this.pathsDeterminants = data;
            //console.log(data);
          });
          this.req.get_determinant().subscribe(data => {//request overall determinante
            this.determinant = data;
            //console.log(data);

          });
          this.req.get_overall_gain().subscribe(data => {//request oveerall gain

            if(data.answer == "Infinity")
              this.answer = "∞";
            else
              this.answer = data.answer;
            //console.log(data);
          });

        });
      }
      else{
        this.displayError = false;
      }
    })

  }

  /**
   * update the gains on the arrows after editing them
   */
  updateGains(){
    for(var i = 0; i < this.pointers.length;i++){
      var edge = this.pointers[i];
        this.req.setEdgeWeight(edge.getSource().name(), edge.getDestination().name(),
                              edge.getText().name(),edge.getText().text());
        //console.log("changed edge weight from"+edge.getText().name() + " to " + edge.getText().text());
        edge.getText().name(edge.getText().text());
    }
  }

  /**
   * clears all the board
   */
  clearAll(){
    this.req.clear();
    this.shapes = []; this.pointers = [];  this.paths = [];   this.pathsDeterminants = [];
    this.loops = [];  this.noneTouchingLoops = []; this.determinant = 0;  this.answer = 0;
    this.layer.destroyChildren();
    this.numOfMs = 0;
    this.Choosing = false;    this.hasSource = false;   this.hasSink = false;   this.hideResults = true;
    this.displayError = true;  this.sourceNode = null;   this.sinkNode = null;
  }

  /**
   *
   * @param name source | sink | node
   * @param color yellow | orange | white
   */
  add(name:string, color:string){
    var pos:any;
    this.Choosing = true;
    this.stage.on("mouseenter",()=>{this.stage.container().style.cursor = "crosshair"})//change cursor event
    this.stage.on("click", ()=>{//on click event
      pos = this.stage.getPointerPosition();//get cursor position on board
      this.stage.container().style.cursor = "default";//return to default cursor
      this.stage.off("mouseenter");//turn off events
      this.stage.off("click");//turn off events
      var sWithT:any = shapeFactory.buildNode(pos.x,pos.y,this.numOfMs,color);//build a shape and add it to the cursor position

      this.shapes.push(sWithT);//push in the shapes array
      this.layer.add(sWithT.getShapeWithText());//add it in the layer
      this.numOfMs++;//increment node count
      this.req.addNode(sWithT.getShapeWithText().name());//request to add node
      if(name == "source"){
        this.sourceNode = sWithT;
        this.hasSource = true;
        this.req.setInputNode(sWithT.getShapeWithText().name());//if source set it to be
      }
      if(name == "sink"){
        this.sinkNode = sWithT;
        this.hasSink = true;
        this.req.setOutputNode(sWithT.getShapeWithText().name());//if sink set it to be
      }
      this.Choosing = false;
    });

  }


  /**
   * adds arrows between two shapes
   */
  addArrow(){
    //console.log("add Arrows!");
    var source:any;//source shape
    var destination:any;//destination shape
    var clicks = 0;//number of clicks
    this.Choosing = true;
    var component = this;
    this.stage.on("mouseenter",()=>{this.stage.container().style.cursor = "crosshair"});//change cursor event
    this.stage.on("click",function(e){//click event
      clicks++;//increment clicks counter
      //console.log(e.target)
      if(e.target instanceof Konva.Shape){ //if the clicked shape is a konva shape
        //gets its source group
        if (clicks == 1){
          //console.log("1stClick")
          source = e.target.getParent();
        }
        //gets its destination group
        if(clicks == 2){
          //console.log("2ndClick")
          destination = e.target.getParent();
        }
      }
      if(clicks >= 2){//two clicks
        //console.log("Two clicks")
        if(source != null && destination != null){
          //console.log("adding arrows!")
          try{
          //get the source and destination shapes
          var x = component.getShapeWithTextFromArray(source);
          var y = component.getShapeWithTextFromArray(destination);
          //calculate curve offset
          var curveoffset =(source==destination) ? 1: Math.max(x.getFollowersOut().length, y.getFollowersIn().length);
          //it curves upwards by default
          var curveHorizontal = 1;
          if(x.IsPointingIn(y.getShapeWithText()) || x == component.sinkNode){//if it is a feed back not 100% accurate
            curveHorizontal = -1;//curve downward
            curveoffset =(source==destination) ? Math.max(x.getFollowersOut().length, y.getFollowersIn().length):
             Math.max(y.getFollowersOut().length, x.getFollowersIn().length)+1;
          }

          component.req.addEdgeWithWeight(x.getShapeWithText().name(),y.getShapeWithText().name(), 1).subscribe(data =>{
            //console.log(data);
            if(data){
              var arrow = shapeFactory.buildBranch(source,destination,curveoffset, curveHorizontal); //build new arrow component
              x.addFollowerOut(arrow);
              y.addFollowerIn(arrow);
              component.pointers.push(arrow);    //add the arrow to the shapes's arrays
              component.layer.add(arrow.getBranch());  //add arrow to the layer to display
            }
          });;//request to add arrow
        }
        catch{//if any error occured abort
          component.Choosing=false;
          component.stage.off('click');
          component.stage.off("mouseenter");
          component.stage.container().style.cursor = "default";
          return;
        }
        }
        //turn off all listeners
        component.Choosing=false
        component.stage.off('click');
        component.stage.off("mouseenter");
        component.stage.container().style.cursor = "default";
      }
    });

  }

}
