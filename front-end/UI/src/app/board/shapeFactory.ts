import Konva from "konva";
import { Arrow } from "./arrow";
import { ShapeWithText } from "./shapeWithText";

export class shapeFactory{

  /**
   * buildNode
   */
  constructor(){

  }
  static buildNode(x:number, y:number,numOfMs: number) {
    var shape;
    var text1;
    var color = 'white';
    var Group;
    //if M
      //this.req.addMachine();
      console.log("add Ms");
      shape = new Konva.Circle({
        name: 'X'+numOfMs.toString(),
        x:x,
        y:y,
        radius:20,
        fill: color,
      });
      text1 = new Konva.Text({
          offset:{x:shape.getAttr('radius')/2,
                  y:shape.getAttr('radius')/2
          },
        x:shape.getAttr('x'),
        y:shape.getAttr('y'),
        fill:'black',
        fontFamily:'Consolas',
        fontSize:20,
        text:'X'+numOfMs.toString()
      });

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

    var SwithT = new ShapeWithText(Group,text1,BackArrows,FrontArrows,color,0);
    return SwithT;
  }

  public static buildEditableText(){
    var textNode:any = new Konva.Text({
      text:'0',
      fill:'white',
      fontFamily:'Consolas',
      fontSize:20,
    });
    var tr = new Konva.Transformer({
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      boundBoxFunc: function (oldBox, newBox) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });
    tr.attachTo(textNode);
    textNode.on('transform', function () {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
        x: 50,
        y: 80,
      });
    });

    textNode.on('dblclick dbltap', () => {
      // hide text node and transformer:
      textNode.hide();
      tr.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = textNode.absolutePosition();

      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: textNode.getStage().container().offsetLeft + textPosition.x,
        y: textNode.getStage().container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      var textarea:any = document.createElement('textarea');
      document.body.appendChild(textarea);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = textNode.lineHeight();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      var rotation = textNode.rotation();
      var transform = '';
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
      }

      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        px += 2 + Math.round(textNode.fontSize() / 20);
      }
      transform += 'translateY(-' + px + 'px)';

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = 'auto';
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px';

      textarea.focus();

      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        tr.show();
        tr.forceUpdate();
      }

      function setTextareaWidth(newWidth:any) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = textNode.placeholder.length * textNode.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        var isEdge = /Edge/.test(navigator.userAgent);
        if (isEdge) {
          newWidth += 1;
        }
        textarea.style.width = newWidth + 'px';
      }

      textarea.addEventListener('keydown', function (e:any) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener('keydown', function () {
        var scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + 'px';
      });

      function handleOutsideClick(e:any) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
      return textNode.text();
    });
    return textNode;
  }


  public static buildArrow(src:Konva.Group, dst:Konva.Group, text:Konva.Text, offset:number, curveup:number){

    var startoffset = 20; var endoffset = -20;
    if(src.x() - dst.x()> 0){startoffset = -20; endoffset = 20}
    var arrow = new Konva.Arrow({
      points:[
      src.x()+startoffset,
      src.y(),
      ((src.x()+dst.x())/2),
      ((src.y()+dst.y())/2)-(50*offset)*curveup,
      dst.x()+endoffset,
      dst.y(),

    ],
    stroke:'white',
    fill: 'black',
    tension:0.5,

    });

    text.setAttrs({
      x:((src.x()+dst.x())/2),
      y:((src.y()+dst.y())/2)-20-(50*offset)*curveup,
    });
    function Follow(){
      var startoffset = 20; var endoffset = -20;
      if(src.x() - dst.x()> 0){startoffset = -20; endoffset = 20}
      const pointsArr = [
        src.x()+startoffset,
        src.y(),
        ((src.x()+dst.x())/2),
        ((src.y()+dst.y())/2)-(50*offset)*curveup,
        dst.x()+endoffset,
        dst.y(),
      ]
      arrow.setAttrs({
        points:pointsArr,
      });
      text.setAttrs({
        x:((src.x()+dst.x())/2),
        y:((src.y()+dst.y())/2)-20-(50*offset)*curveup,
      });
    }
    src.on('dragmove',Follow);
    dst.on('dragmove',Follow);
    return arrow;
  }
  public static buildBranch(src:Konva.Group, dst: Konva.Group,offset:number, curveup:number){
    var text = this.buildEditableText();
    var arrow = this.buildArrow(src, dst,text,offset,curveup);
    var edge = new Arrow(src, dst,arrow,text);

    return edge;
  }
}
