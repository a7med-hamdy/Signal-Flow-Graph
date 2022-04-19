import Konva from 'konva'
export class Arrow{
  arrow!:Konva.Arrow;
  Source!:Konva.Group;
  Destination!:Konva.Group;
  constructor(src:Konva.Group, dst:Konva.Group){
    this.Source = src;
    this.Destination = dst;
    this.arrow = new Konva.Arrow({
      points:[
      this.Source.x()+50,
      this.Source.y(),
      this.Destination.x()-50,
      this.Destination.y()
    ],
    fill:'black',
    stroke:'black'

    });
    var component = this;
    function Follow(){
      const pointsArr = [
        component.Source.x()+50,
        component.Source.y(),
        component.Destination.x()-50,
        component.Destination.y(),
      ]
      component.arrow.setAttrs({
        points:pointsArr,
      });
    }
    this.Source.on('dragmove',Follow);
    this.Destination.on('dragmove',Follow);
  }
  getArrow(){return this.arrow;}
  getSource(){return this.Source;}
  getDestination(){return this.Destination;}
}
