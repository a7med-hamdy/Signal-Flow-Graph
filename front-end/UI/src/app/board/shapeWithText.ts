import Konva from 'konva'
export class ShapeWithText{
  text2!:Konva.Text;
  Group!:Konva.Group;
  animator!:Konva.Tween;
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
  updateProductsNumber(t:number){
    if(this.text2 != null){
      this.Products = t;
      this.text2.setAttrs({text:this.Products.toString()});
    }
  }
  /******************Animation Functions*************************************** */
  /**
   *
   * @param ms milliseconds
   * @returns
   */
  private sleep(ms:any){
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }
  async playFlashAnimation(){
    this.animator = new Konva.Tween({
      node: this.Group.find('.'+this.Group.name())[0],
      duration: 0.1,
      easing: Konva.Easings.BackEaseInOut,
      fill: 'rgb(255, 255, 255)',
    });
    var component = this
    for(var i = 0; i < 3;i++){
      this.animator.play()
      await this.sleep(100);
      this.animator.reverse();
      await this.sleep(100);
    }
  }
  playColorAnimation(color:string){
    this.animator = new Konva.Tween({
      node: this.Group.find('.'+this.Group.name())[0],
      duration: 0.3,
      easing: Konva.Easings.BackEaseInOut,
      fill: color,
    });
    this.animator.play();
  }
  playReverseColorAnimation(){
    this.playColorAnimation(this.Color);
  }
}
