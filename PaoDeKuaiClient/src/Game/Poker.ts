import Room from "./Room";

export default class Poker extends Laya.Image {
    protected room: Room = null;

    //index序号
    protected _index: number;

    //点数
    public point: number;

    public isSelected: boolean = false;

    //图片
    public img: string = "card/bg.png";

    constructor() {
        super();
        this.width = 105;
        this.height = 150;
    }

    public setRoom(room: Room): void {
        this.room = room;
    }

    public reInit() {
        this.off(Laya.Event.CLICK, this, this.switchStatus);
        this.img = "card/bg.png";
        this.isSelected = false;
    }

    public switchStatus() {
        if (this.room.canSelect) {
            this.isSelected = !this.isSelected;
            if (this.isSelected) {
                this.y = -20;
            } else {
                this.y = 0;
            }
            this.room.checkOutPokers();
        }
    }

    public set index(value: number) {
        this._index = value;
        this.img = "card/" + value + ".jpg";
        if (value < 53) {
            if (value % 4 == 0) {
                this.point = value / 4 + 2;
            } else {
                this.point = Math.floor(value / 4) + 3;
            }
        } else {
            this.point = Math.floor(value / 4) + 2 + value % 4;
        }
    }

    public get index() {
        return this._index;
    }
}