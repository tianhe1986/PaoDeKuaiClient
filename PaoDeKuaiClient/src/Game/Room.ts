import Game from "./Game";

export default class Room {
    private game: Game;

    //房间号
    public roomId: number;

    //自己信息
    public myInfo = { "seat": 0, "name": "", "pass": 0 }; //座位，昵称，是否跳过

    //左右座位信息
    public leftInfo = { "seat": 0, name: "" };
    public rightInfo = { "seat": 0, name: "" };

    constructor(game: Game) {
        this.game = game;
    }

    public onPlayGame(content: any)  {

    }

    public onRoomExit()  {
        // 正常结束，房间内直接展示匹配按钮
        /* if (this.game.roomView.scorePanel.visible) {
             this.game.roomView.outOption.visible = false;
             this.game.roomView.enter.visible = true;
         } else { // 由于有人退出而结束，直接回到匹配页
             this.game.refreshToMatch();
         }*/
    }

    //处理座位
    public processSeat(content: any)  {
        let players = content.players;
        this.roomId = content.roomId;
        for (let i = 0; i < players.length; i++)  {
            if (this.game.gameId == players[i])  {
                this.myInfo.name = (i + 1) + '号位：' + players[i];
                this.myInfo.seat = i + 1;
                if (i == 2)  {
                    this.rightInfo.name = '1号位：' + players[0];
                    this.rightInfo.seat = 1;
                    this.leftInfo.name = '2号位：' + players[1];
                    this.leftInfo.seat = 2;
                } else if (i == 0)  {
                    this.rightInfo.name = '2号位：' + players[1];
                    this.rightInfo.seat = 2;
                    this.leftInfo.name = '3号位：' + players[2];
                    this.leftInfo.seat = 3;
                } else  {
                    this.rightInfo.name = '3号位：' + players[2];
                    this.rightInfo.seat = 3;
                    this.leftInfo.name = '1号位：' + players[0];
                    this.leftInfo.seat = 1;
                }
            }
        }
        (this.game.roomView.mySeat.getChildByName("nickname") as Laya.Text).text = this.myInfo.name;
        (this.game.roomView.mySeat.getChildByName("avatar") as Laya.Image).skin = "avatar/" + this.myInfo.seat + ".png";
        this.game.roomView.mySeat.visible = true;

        (this.game.roomView.leftSeat.getChildByName("nickname") as Laya.Text).text = this.leftInfo.name;
        (this.game.roomView.leftSeat.getChildByName("avatar") as Laya.Image).skin = "avatar/" + this.leftInfo.seat + ".png";
        this.game.roomView.leftSeat.visible = true;

        (this.game.roomView.rightSeat.getChildByName("nickname") as Laya.Text).text = this.rightInfo.name;
        (this.game.roomView.rightSeat.getChildByName("avatar") as Laya.Image).skin = "avatar/" + this.rightInfo.seat + ".png";
        this.game.roomView.rightSeat.visible = true;
    }
}