import { Component, OnInit } from '@angular/core';
import  Konva from 'konva';
import { WebSocketAPI } from '../WebSocketAPI';
import { ShapeWithText } from './shapeWithText'
import { Arrow } from './arrow';
import { RequestsService } from '../requests/requests.service';
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
  numOfQs = 0;
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
    this.add('Q');
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
        this.req.save(JSON.stringify([JSON.stringify(this.shapes),JSON.stringify(this.pointers)]))

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
  loadBoard(){
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
  }
  /**
   * starts the simulation
   */
  startSimulation(){
    this.req.validate().subscribe(data =>{
      if(data == true){
        this.simulating = true;
        this.req.play().subscribe();
      }
      else{
        this.simulating = false;
      }
    })

  }
  replaySimulation(){
    try {
      this.loadBoard();
      this.req.replay().subscribe(data =>{
        //this.simulating = true;
      });

    } catch (error) {
      this.simulating = false;

    }
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
    this.numOfQs = 0;
    this.numOfMs = 0;
    this.simulating = false;
    this.afterSim = false;
    this.Choosing = false;
    this.add('Q');
  }
  /** Adds either M or Q to the board
   *
   * @param string M | Q
   */
  add(string:string){
    var shape;
    var text1;
    var text2;
    var color = 'grey';
    var Group;
    //if M
    if(string == 'M'){
      this.req.addMachine();
      console.log("add Ms");
      shape = new Konva.Circle({
        name: 'M'+this.numOfMs.toString(),
        x:0,
        y:0,
        radius:50,
        fill: color,
      });
      text1 = new Konva.Text({
          offset:{x:shape.getAttr('radius')/8,
                  y:shape.getAttr('radius')/8
          },
        x:shape.getAttr('x'),
        y:shape.getAttr('y'),
        fill:'black',
        fontFamily:'Consolas',
        fontSize:20,
        text:'M'+this.numOfMs.toString()
      });
      this.numOfMs++

    }
    //if Q
    else{
      if(this.numOfQs!=0)
        this.req.addQueue();
      console.log("addQs");
      shape = new Konva.Rect({
        name:'Q'+this.numOfQs.toString(),
        x:300,
        y:300,
        width:100,
        height:50,
        fill:color,
      });
      shape.setAttrs({
        offset:{x:shape.getAttr('width')/2,
                y:shape.getAttr('height')/2
        }
      })
      text1 = new Konva.Text({
          offset:{x:shape.getAttr('offsetX')/4,
                  y:shape.getAttr('offsetY')/4
          },
        x:shape.getAttr('x'),
        y:shape.getAttr('y'),
        fill:'black',
        fontFamily:'Consolas',
        fontSize:20,
        text:'Q'+this.numOfQs.toString()
      });
      text2 = new Konva.Text({
      name:'text2',
        offset:{x:shape.getAttr('offsetX')*1.5,
                y:shape.getAttr('offsetY')*1.5
        },
      x:shape.getAttr('x'),
      y:shape.getAttr('y'),
      fill:'black',
      fontFamily:'Consolas',
      fontSize:20,
      text: '0'
    });

    this.numOfQs++
    }
    Group = new Konva.Group({
      name:shape.name(),
      draggable: true,
      x:shape.x(),
      y:shape.y(),
      offsetX: shape.x(),
      offsetY:shape.y()
    });
    Group.add(shape)
    Group.add(text1)
    var FrontArrows: any[] = [];
    var BackArrows: any[] = [];

    var SwithT = new ShapeWithText(Group,text2,BackArrows,FrontArrows,color,0);
    console.log(SwithT)
    var a = JSON.parse(JSON.stringify(SwithT))
    this.shapes.push(SwithT);
    this.layer.add(SwithT.getShapeWithText())
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
          //get the source and destination shapes
          var x = component.getShapeWithTextFromArray(source);
          var y = component.getShapeWithTextFromArray(destination);

          if(source.name().includes('M')){
            var followers = x.getFollowersOut();
            var f = followers.filter(function(element:any){
              return element.getDestination().name().includes('Q');
            });
            if(f.length != 0){
              component.Choosing=false
              component.stage.off('click');
              return
            }
          }
          component.req.addArrow(source.name(),destination.name()).subscribe(data =>{ // send request
            if(data == false){return;}
            else{
              arrow = new Arrow(source,destination); //create new arrow component
              x.addFollowerOut(arrow);
              y.addFollowerIn(arrow);
              x.playFlashAnimation();
              component.pointers.push(arrow);    //add the arrow to the shapes's arrays
              component.layer.add(arrow.getArrow());  //add arrow to the layer to display
              console.log(JSON.parse(JSON.stringify(component.pointers)))
            }
          });
        }
        component.Choosing=false
        component.stage.off('click');
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
