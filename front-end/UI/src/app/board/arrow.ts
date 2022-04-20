import { ThrowStmt } from '@angular/compiler';
import Konva from 'konva'
export class Arrow{
  arrow!:Konva.Arrow;
  text!:Konva.Text;
  Branch!:Konva.Group;
  Source!:Konva.Group;
  Destination!:Konva.Group;

  constructor(src:Konva.Group,
              dst:Konva.Group,
              arrow:Konva.Arrow,
              txt:Konva.Text){
    this.Source = src;
    this.Destination = dst;
    this.text = txt;
    this.arrow = arrow;
    this.Branch = new Konva.Group({
        name:this.text.name(),
        x:this.text.x(),
        y:this.text.y(),
        offsetX: this.text.x(),
        offsetY:this.text.y()
    });
    this.Branch.add(txt);
    this.Branch.add(arrow);
  }
  getBranch(){return this.Branch;}
  getText(){return this.text;}
  getArrow(){return this.arrow;}
  getSource(){return this.Source;}
  getDestination(){return this.Destination;}
}
