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
    export class roomUI extends Laya.View {
		public leftSeat:Laya.Box;
		public rightSeat:Laya.Box;
		public mySeat:Laya.Box;
		public leftOutCard:Laya.Box;
		public rightOutCard:Laya.Box;
		public myOutCard:Laya.Box;
		public leftPass:laya.display.Text;
		public rightPass:laya.display.Text;
		public myPass:laya.display.Text;
		public outYes:Laya.Button;
		public outNo:Laya.Button;
		public enter:Laya.Button;
		public scorePanel:Laya.Box;
		public scoreList:Laya.List;
        public static  uiView:any ={"type":"View","props":{"width":1280,"height":720,"centerY":0,"centerX":0},"compId":2,"child":[{"type":"Sprite","props":{"y":0,"x":0},"compId":3,"child":[{"type":"Rect","props":{"width":1280,"lineWidth":0,"height":720,"fillColor":"#6699cc"},"compId":4}]},{"type":"Box","props":{"y":28,"x":28,"visible":false,"var":"leftSeat","top":28,"left":28},"compId":20,"child":[{"type":"Image","props":{"width":100,"top":74,"skin":"comp/image.png","name":"avatar","left":22,"height":100},"compId":11},{"type":"Text","props":{"y":181.75,"width":150,"text":"你是个肥肥","name":"nickname","fontSize":24,"align":"center","runtime":"laya.display.Text"},"compId":12},{"type":"Text","props":{"y":62,"x":122,"text":"12","name":"cardNum","fontSize":24,"align":"center","runtime":"laya.display.Text"},"compId":16},{"type":"Box","props":{"y":-1.25,"x":72,"name":"action"},"compId":18,"child":[{"type":"Line","props":{"y":0,"x":0,"toY":35,"toX":0,"lineWidth":1,"lineColor":"#ff0000"},"compId":17},{"type":"Lines","props":{"y":-30,"x":4,"points":"-19,55,-4,68,8,53","lineWidth":1,"lineColor":"#ff0000"},"compId":19}]}]},{"type":"Box","props":{"y":28,"x":1102,"visible":false,"var":"rightSeat","top":28,"right":28},"compId":21,"child":[{"type":"Image","props":{"width":100,"top":74,"skin":"comp/image.png","name":"avatar","left":22,"height":100},"compId":22},{"type":"Text","props":{"y":181.75,"width":150,"text":"你是个肥肥","name":"nickname","fontSize":24,"align":"center","runtime":"laya.display.Text"},"compId":23},{"type":"Text","props":{"y":62,"x":-13.34765625,"text":"12","name":"cardNum","fontSize":24,"align":"center","runtime":"laya.display.Text"},"compId":24},{"type":"Box","props":{"y":-1.25,"x":72,"name":"action"},"compId":25,"child":[{"type":"Line","props":{"y":0,"x":0,"toY":35,"toX":0,"lineWidth":1,"lineColor":"#ff0000"},"compId":26},{"type":"Lines","props":{"y":-30,"x":4,"points":"-19,55,-4,68,8,53","lineWidth":1,"lineColor":"#ff0000"},"compId":27}]}]},{"type":"Box","props":{"y":466,"x":91,"visible":false,"var":"mySeat","left":91,"bottom":48},"compId":28,"child":[{"type":"Image","props":{"width":100,"top":74,"skin":"avatar/1.png","name":"avatar","left":22,"height":100},"compId":29},{"type":"Text","props":{"y":181.75,"width":150,"text":"你是个肥肥","name":"nickname","fontSize":24,"align":"center","runtime":"laya.display.Text"},"compId":30},{"type":"Text","props":{"y":62,"x":122,"text":"12","name":"cardNum","fontSize":24,"align":"center","runtime":"laya.display.Text"},"compId":31},{"type":"Box","props":{"y":-1.25,"x":72,"name":"action"},"compId":32,"child":[{"type":"Line","props":{"y":0,"x":0,"toY":35,"toX":0,"lineWidth":1,"lineColor":"#ff0000"},"compId":33},{"type":"Lines","props":{"y":-30,"x":4,"points":"-19,55,-4,68,8,53","lineWidth":1,"lineColor":"#ff0000"},"compId":34}]}]},{"type":"Box","props":{"width":105,"var":"leftOutCard","top":50,"left":217,"height":417},"compId":9},{"type":"Box","props":{"width":105,"var":"rightOutCard","top":50,"right":217,"height":417},"compId":10},{"type":"Box","props":{"x":290,"width":700,"var":"myOutCard","height":150,"centerX":0,"bottom":50},"compId":7},{"type":"Text","props":{"y":130.875,"x":242.9921875,"var":"leftPass","text":"打得","fontSize":26,"color":"#1b1717","bold":true,"align":"center","runtime":"laya.display.Text"},"compId":35},{"type":"Text","props":{"y":130.875,"x":983.9921875,"var":"rightPass","text":"打得","fontSize":26,"color":"#1b1717","bold":true,"align":"center","runtime":"laya.display.Text"},"compId":36},{"type":"Text","props":{"y":582,"x":577,"var":"myPass","text":"打得","fontSize":26,"color":"#1b1717","bold":true,"align":"center","runtime":"laya.display.Text"},"compId":38},{"type":"Button","props":{"y":386,"x":454,"width":90,"var":"outYes","skin":"comp/button.png","labelSize":22,"label":"出牌","height":45},"compId":39},{"type":"Button","props":{"y":386,"x":595,"width":90,"var":"outNo","skin":"comp/button.png","labelSize":22,"label":"不出","height":45},"compId":40},{"type":"Button","props":{"width":190,"visible":false,"var":"enter","skin":"comp/button.png","labelSize":28,"label":"重新匹配","height":75,"centerY":0,"centerX":0},"compId":42},{"type":"Box","props":{"y":79,"x":379,"visible":false,"var":"scorePanel"},"compId":46,"child":[{"type":"Rect","props":{"y":0,"x":0,"width":427,"lineWidth":1,"height":283,"fillColor":"#d1e3d5"},"compId":47},{"type":"List","props":{"y":58,"x":29,"width":379,"var":"scoreList","repeatY":3,"repeatX":1,"renderType":"render","height":190},"compId":45,"child":[{"type":"Box","props":{"renderType":"render"},"compId":44,"child":[{"type":"Text","props":{"y":-0.875,"x":-0.984375,"width":372,"text":"你竟然赢了","name":"scoreText","height":28,"fontSize":20,"color":"#000000","bold":false,"runtime":"laya.display.Text"},"compId":43}]}]},{"type":"Text","props":{"y":16,"x":157,"text":"计分板","fontSize":30,"color":"#342828","bold":true,"align":"center","runtime":"laya.display.Text"},"compId":48}]}],"loadList":["comp/image.png","avatar/1.png","comp/button.png"],"loadList3D":[]};
        constructor(){ super()}
        createChildren():void {
            super.createChildren();
            this.createView(roomUI.uiView);
        }
    }
    REG("ui.roomUI",roomUI);
}