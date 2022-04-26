import Konva from 'konva'
/**
 * arrow object that carries the konva shapes
 */
export class Arrow{
  arrow!:Konva.Arrow;
  text!:Konva.Text;
  Branch!:Konva.Group;
  Source!:Konva.Group;
  Destination!:Konva.Group;

  /**
   *
   * @param src source konva shape
   * @param dst destination konva shape
   * @param arrow the konva arrow pointing from src to dst
   * @param txt text written on top of the arrow
   */
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
/**************getters*************************** */

  /**
   *
   * @returns konva group combining text and arrow
   */
  getBranch(){return this.Branch;}
  /**
   *
   * @returns konva text
   */
  getText(){return this.text;}
  /**
   *
   * @returns konva arrow
   */
  getArrow(){return this.arrow;}
  /**
   *
   * @returns source konva group
   */
  getSource(){return this.Source;}
  /**
   *
   * @returns destination konva group
   */
  getDestination(){return this.Destination;}
}
