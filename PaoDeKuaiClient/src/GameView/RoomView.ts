import { ui } from "../ui/layaMaxUI";
import Game from "../Game/Game";

export default class RoomView extends ui.roomUI {
    private game: Game = null;

    constructor(game: Game) {
        super();
        this.game = game;

        this.outYes.on(Laya.Event.CLICK, game.room, game.room.giveOutAction);
        this.outNo.on(Laya.Event.CLICK, game.room, game.room.passAction);
        this.enter.on(Laya.Event.CLICK, game, game.reMatch);

        this.scoreList.renderHandler = new Laya.Handler(this, this.scoreRender);
    }

    public scoreRender(cell: Laya.Box, index: number): void {
        //如果索引不再可索引范围，则终止该函数
        if (index >= this.game.room.scoreList.length) {
            return;
        }

        let txt = this.game.room.scoreList[index];
        let scoreItem: any = cell.getChildByName("scoreText");
        scoreItem.text = txt;
    }
}