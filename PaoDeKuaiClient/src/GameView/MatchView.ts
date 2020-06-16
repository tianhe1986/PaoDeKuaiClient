import { ui } from "../ui/layaMaxUI";
import Game from "../Game/Game";

export default class MatchView extends ui.enterUI {
    constructor(game: Game) {
        super();
        this.enter.on(Laya.Event.CLICK, game, game.beginMatch);
        this.isMatching.visible = false;
		this.enter.visible = true;
    }
}