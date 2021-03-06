import Konva from 'konva'
export class ShapeWithText{
  text2!:Konva.Text;
  Group!:Konva.Group;
  Color!:string;
  InArrows: any[] = [];
  OutArrows: any[] = [];

  /**
   *
   * @param Group node group
   * @param text2  Text to be put on the circle
   * @param InArrows Arrows pointing towards the shape
   * @param OutArrows Arrows pointing out of theshape
   * @param Color Original Color of the shape
   */
  constructor(Group:Konva.Group,
              text2:any =null,
              InArrows:any[],
              OutArrows:any[],
              Color:string,)
    {
    this.Group =Group;
    this.text2 = text2;
    this.InArrows = InArrows;
    this.OutArrows = OutArrows;
    this.Color = Color;

  }
/**
 *
 * @returns konva group
 */
  getShapeWithText(){return this.Group;}
  /**
   *
   * @returns array of out arrows
   */
  getFollowersOut(){return this.OutArrows;}
  /**
   *
   * @returns array of in arrows
   */
  getFollowersIn(){return this.InArrows;}

  /**
   * checks if a given shape is pointing towards this shape
   * @param criteria shape to be compared to
   * @returns true if so | false ow
   */
  IsPointingIn(criteria:any){
    var shape = this.InArrows.filter(function(element){
      return element.getSource() == criteria;
    });

    if(shape.length == 0){
      return false;
    }
    return true;
  }
/**
   * checks if a given shape is being pointed towards by this shape
 * @param criteria shape to be compared to
 * @returns true if so | false ow
 */
  IsPointingOut(criteria:any){
    var shape = this.OutArrows.filter(function(element){
      return element.getDestination() == criteria;
    });
    if(shape != null){
      return true;
    }
    return false;
  }
  /**
   *
   * @param arrow add arrow to in arrows
   */
  addFollowerIn(arrow:any){
    this.InArrows.push(arrow);
  }
  /**
   *
   * @param arrow add arrow to out arrows
   */
  addFollowerOut(arrow:any){
    this.OutArrows.push(arrow);
  }
}
