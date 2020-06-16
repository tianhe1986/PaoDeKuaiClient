import Game from "./Game";
import Message from "../Net/Message";
import MsgCode from "../Constants/MsgCode";

export default class MessageHandler {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    public handle(data: any) {
        if (data.code == undefined || data.code == 0) {
            //根据不同的command进行处理
            switch (data.command) {
                case MsgCode.PLAY_GAME: //游戏中消息
                    this.game.room.onPlayGame(data.content);
                    break;
                case MsgCode.ROOM_EXIT: // 房间解散了
                    this.game.room.onRoomExit();
                    break;
                default:
                    break;
            }

        } else { //错误处理

        }
    }

    public matchCallback(message: Message) {
        //处理座位信息
        this.game.room.processSeat(message.content);
        //展示房间
        this.game.matchView.removeSelf();
        Laya.stage.addChild(this.game.roomView);
    }
}