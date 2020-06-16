import Game from "./Game";

export default class Room {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public onPlayGame(content: any)
    {

    }

    public onRoomExit()
    {
        // 正常结束，房间内直接展示匹配按钮
       /* if (this.game.roomView.scorePanel.visible) {
            this.game.roomView.outOption.visible = false;
            this.game.roomView.enter.visible = true;
        } else { // 由于有人退出而结束，直接回到匹配页
            this.game.refreshToMatch();
        }*/
    }

    //处理座位
    public processSeat(content:any)
    {
        
    }
}