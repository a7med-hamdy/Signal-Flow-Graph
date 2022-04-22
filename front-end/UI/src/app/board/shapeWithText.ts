import Konva from 'konva'
export class ShapeWithText{
  text2!:Konva.Text;
  Group!:Konva.Group;
  Products!:number;
  Color!:string;
  InArrows: any[] = [];
  OutArrows: any[] = [];

  /**
   *
   * @param Group shape Rectangle or Circle
   * @param text2  Text to be put on the Rectangle
   * @param InArrows Arrows pointing towards the shape
   * @param OutArrows Arrows pointing out of theshape
   * @param Color Original Color of the shape
   */
  constructor(Group:Konva.Group,
              text2:any =null,
              InArrows:any[],
              OutArrows:any[],
              Color:string,
              Products:number)
    {
    this.Group =Group;
    this.text2 = text2;
    this.InArrows = InArrows;
    this.OutArrows = OutArrows;
    this.Color = Color;
    this.Products = Products;

  }

  getShapeWithText(){return this.Group;}
  getProductsNumber(){return this.Products;}
  getFollowersOut(){return this.OutArrows;}
  getFollowersIn(){return this.InArrows;}

  IsPointingIn(criteria:any){
    var shape = this.InArrows.filter(function(element){
      return element.getSource() == criteria;
    });

    if(shape.length == 0){
      return false;
    }
    return true;
  }

  IsPointingOut(criteria:any){
    var shape = this.OutArrows.filter(function(element){
      return element.getDestination() == criteria;
    });
    if(shape != null){
      return true;
    }
    return false;
  }
  addFollowerIn(arrow:any){
    this.InArrows.push(arrow);
  }
  addFollowerOut(arrow:any){
    this.OutArrows.push(arrow);
  }
}
