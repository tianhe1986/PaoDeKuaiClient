/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import View=Laya.View;
import Dialog=Laya.Dialog;
import Scene=Laya.Scene;
var REG: Function = Laya.ClassUtils.regClass;
export module ui {
    export class enterUI extends Laya.View {
		public enter:Laya.Button;
		public isMatching:laya.display.Text;
        public static  uiView:any ={"type":"View","props":{"width":1280,"height":720,"centerY":0,"centerX":0},"compId":2,"child":[{"type":"Sprite","props":{"y":0,"x":0},"compId":6,"child":[{"type":"Rect","props":{"width":1280,"lineWidth":0,"height":720,"fillColor":"#6699cc"},"compId":5}]},{"type":"Button","props":{"y":270,"x":533,"width":191,"var":"enter","skin":"comp/button.png","labelSize":36,"label":"开始匹配","height":90},"compId":4},{"type":"Text","props":{"y":294,"x":544.5,"var":"isMatching","text":"正在匹配","fontSize":42,"runtime":"laya.display.Text"},"compId":7}],"loadList":["comp/button.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(enterUI.uiView);
        }
    }
    REG("ui.enterUI",enterUI);
}