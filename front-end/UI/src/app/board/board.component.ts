import { Component, OnInit } from '@angular/core';
import  Konva from 'konva';
import { WebSocketAPI } from '../WebSocketAPI';
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
  pointers:any[] = [];
  shapes:any[] = [];
  stage!:Konva.Stage;
  layer!:Konva.Layer;
  numOfMs = 0;
  Choosing = false
  simulating = false
  afterSim = false
  wareHouseQueues:any[] = []
  webSocketAPI!: WebSocketAPI;
  message: any;
  name: string = '';
  constructor(private req:RequestsService) { }

  ngOnInit() {
    this.webSocketAPI = new WebSocketAPI(this);
    //connect to backend at start
    this.connect();
    //create the stage on start
    this.stage = new Konva.Stage({
      container: 'container',
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layer = new Konva.Layer();//create layer on start
    this.stage.add(this.layer);//add the layer to the stage on start
    ///this.add();
  }
/***************************************************************************************************************** */
  //methods for websocket
  connect(){
    this.webSocketAPI._connect();
  }

  disconnect(){
    this.webSocketAPI._disconnect();
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message: any){
    console.log(this.simulating)
    if(this.simulating){
      var JSONmessage = JSON.parse(message);
      console.log(JSONmessage.name);
      this.updateBoard(JSONmessage);
      var sum = 0;
      for(var i = 0; i < this.wareHouseQueues.length;i++){
        sum += this.wareHouseQueues[i].getProductsNumber();
        console.log(sum)
      }
      if(sum == 10){
        this.simulating = false;
        this.afterSim = true;
        sum = 0;
        console.log(JSON.stringify([JSON.stringify(this.shapes),JSON.stringify(this.pointers)]))
      //  this.req.save(JSON.stringify([JSON.stringify(this.shapes),JSON.stringify(this.pointers)]))

      }
    }
  }
  //end of websocket
/*************************************************************************************************************** */

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
   * loads boardfrom backend
   */
  /*loadBoard(){
    this.req.load().subscribe(data =>{
      if(data == null){
        this.simulating = false;
        console.log(this.simulating)
        console.log(data)
        return;
      }
      this.simulating = true
      this.shapes = []
      this.pointers = []
      this.wareHouseQueues = []
      this.layer.destroyChildren()
      console.log(data)
      data[0] = JSON.parse(data[0])
      data[1] = JSON.parse(data[1])
      for(var i = 0 ; i < data[0].length;i++){
        if(data[0][i].text2 != null){
          var s = new ShapeWithText(Konva.Node.create(JSON.parse(data[0][i].Group)),
                                    Konva.Node.create(JSON.parse(data[0][i].text2)),
                                    data[0][i].InArrows,data[0][i].OutArrows,data[0][i].Color,data[0][i].Products)
          this.shapes.push(s);
          this.layer.add(s.getShapeWithText());
          s.updateProductsNumber(0);
        }
        else{
          var s = new ShapeWithText(Konva.Node.create(JSON.parse(data[0][i].Group)),
                                    null,
                                    data[0][i].InArrows,data[0][i].OutArrows,data[0][i].Color,data[0][i].Products)
          this.shapes.push(s);
          s.updateProductsNumber(0);
          this.layer.add(s.getShapeWithText());
        }
      }

      for(var i = 0; i < data[1].length;i++){
        var src = Konva.Node.create(JSON.parse(data[1][i].Source))
        var dst = Konva.Node.create(JSON.parse(data[1][i].Destination))
        var arrow = new Arrow(this.getShapeWithTextFromArrayByName(src.name()).getShapeWithText(),
                    this.getShapeWithTextFromArrayByName(dst.name()).getShapeWithText())
        this.pointers.push(arrow);
        this.layer.add(arrow.getArrow());
      }
    });
    return 0;
  }*/
  /**
   * starts the simulation
   */
  startSimulation(){
    this.req.validate().subscribe(data =>{
      if(data == true){
        this.simulating = true;
     //   this.req.play().subscribe();
      }
      else{
        this.simulating = false;
      }
    })

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
    this.shapes = [];
    this.pointers = [];
    this.wareHouseQueues = [];
    this.layer.destroyChildren();
    this.numOfMs = 0;
    this.simulating = false;
    this.afterSim = false;
    this.Choosing = false;
    //this.add();
  }
  /** Adds either M or Q to the board
   *
   *
   */
  add(){
    var pos:any;
    this.stage.on("mouseenter",()=>{this.stage.container().style.cursor = "crosshair"})
    this.stage.on("click", ()=>{
      pos = this.stage.getPointerPosition();
      this.stage.container().style.cursor = "default";
      this.stage.off("mouseenter");
      this.stage.off("click");
      var sWithT:any = shapeFactory.buildNode(pos.x,pos.y,this.numOfMs);
      console.log(sWithT)
      var a = JSON.parse(JSON.stringify(sWithT))
      this.shapes.push(sWithT);
      this.layer.add(sWithT.getShapeWithText());
      this.numOfMs++
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
          var x = component.getShapeWithTextFromArray(source);
          x.playColorAnimation("red");
        }
        //gets its destination group
        if(clicks == 2){
          console.log("2ndClick")
          destination = e.target.getParent();
          var y = component.getShapeWithTextFromArray(destination);
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
          var curveoffset = x.getFollowersOut().length;
          var curveHorizontal = 1;
          if(x.IsPointingIn(y.getShapeWithText())){
            curveHorizontal = -1;
            var curveoffset = x.getFollowersIn().length;
          }
          var arrow = shapeFactory.buildBranch(source,destination,curveoffset, curveHorizontal); //create new arrow component
          //create new arrow component
          x.addFollowerOut(arrow);
          y.addFollowerIn(arrow);
          x.playReverseColorAnimation();
          y.playFlashAnimation();
          component.pointers.push(arrow);    //add the arrow to the shapes's arrays
          component.layer.add(arrow.getBranch());  //add arrow to the layer to display
          console.log(JSON.parse(JSON.stringify(component.pointers)))
        }
        catch{
          component.Choosing=false
          component.stage.off('click');
          component.stage.off("mouseenter");
          component.stage.container().style.cursor = "default";
          x.playReverseColorAnimation();
          y.playFlashAnimation();
          return
        }
        }

        component.Choosing=false
        component.stage.off('click');
        component.stage.off("mouseenter");
        component.stage.container().style.cursor = "default";
      }
    });

  }

  async updateBoard(message:any){
    if(message.name.includes('M')){
      var Machine = this.getShapeWithTextFromArrayByName(message.name);
      if(message.change.includes('flash')){
        await Machine.playFlashAnimation();
        Machine.playReverseColorAnimation();

      }
      else{
        Machine.playColorAnimation(message.change);
      }
    }
    else{
      var Queue = this.getShapeWithTextFromArrayByName(message.name);
      if(message.change == 'empty'){
        this.wareHouseQueues.push(Queue);
      }
      else{
        Queue.updateProductsNumber(message.change);
      }
    }

  }
}
