import MatchView from "../GameView/MatchView";
import RoomView from "../GameView/RoomView";
import Room from "./Room";
import PoolManager from "./PoolManager";
import CardLogic from "./CardLogic";
import SocketManager from "../Net/SocketManager";
import MessageHandler from "./MessageHandler";
import Message from "../Net/Message";
import MsgCode from "../Constants/MsgCode";

export default class Game {
    // 玩家id，有可能碰撞，但现在先不管
    public gameId: number;

    // 匹配页
    public matchView: MatchView = null;

    // 房间页
    public roomView: RoomView = null;

    // 房间管理
    public room: Room = null;

    // 对象管理
    public poolManager: PoolManager = null;

    // 扑克逻辑处理
    public cardLogic: CardLogic = null;

    // socket管理
    public socketManager: SocketManager = null;

    // 消息处理
    public msgHandler: MessageHandler = null;

    constructor() {
        this.gameId = Math.floor(Math.random() * 1000000000) + 1;
    }

    public begin(): void {
        this.poolManager = new PoolManager();

        this.msgHandler = new MessageHandler(this);

        let url = "ws://localhost:8181";

        this.socketManager = new SocketManager(this.msgHandler, url);

        this.refreshToMatch();
    }

    // 重新回到匹配页
    public refreshToMatch() {
        // 简单粗暴的把原来的全清了，重新来过
        if (this.matchView) {
            this.matchView.removeSelf();
            this.matchView.destroy();
            this.matchView = null;
        }

        if (this.roomView) {
            this.roomView.removeSelf();
            this.roomView.destroy();
            this.roomView = null;
        }

        if (this.room) {
            delete this.room;
            this.room = null;
        }

        if (this.cardLogic) {
            delete this.cardLogic;
            this.cardLogic = null;
        }

        this.room = new Room(this);
        this.cardLogic = new CardLogic();

        this.matchView = new MatchView(this);
        this.roomView = new RoomView(this);
        Laya.stage.addChild(this.matchView);
    }

    //开始匹配
    public beginMatch() {
        let message = new Message();
        message.command = MsgCode.MATCH_PLAYER;
        message.content = { "name": this.gameId };
        this.socketManager.sendData(message, this.msgHandler.matchCallback, this.msgHandler);
        this.matchView.isMatching.visible = true;
        this.matchView.enter.visible = false;
    }

    // 重新匹配
    public reMatch() {
        this.refreshToMatch();
        this.beginMatch();
    }
}