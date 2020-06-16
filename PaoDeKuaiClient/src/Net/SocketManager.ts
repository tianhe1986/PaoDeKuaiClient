import MessageHandler from "../Game/MessageHandler";
import Message from "./Message";

export default class SocketManager {
    // websocket对象
    private socket: Laya.Socket = null;

    // 连接url，缓存用于以后重连用
    private url: string = "";

    // 序列id，用于处理回调
    private sequence: number = 1;

    // 回调callback记录
    private callbackPool: Object = {};

    // msg handler ins
    private msgHandler: MessageHandler = null;

    constructor(msgHandler: MessageHandler, url: string) {
        this.msgHandler = msgHandler;
        this.url = url;
        this.connect();
    }

    private connect(): void {
        if ("" == this.url) {
            return;
        }
        
        this.socket = new Laya.Socket();
        
        this.socket.connectByUrl(this.url);

        this.socket.on(Laya.Event.OPEN, this, this.onSocketOpen);
        this.socket.on(Laya.Event.CLOSE, this, this.onSocketClose);
        this.socket.on(Laya.Event.MESSAGE, this, this.onMessageReveived);
        this.socket.on(Laya.Event.ERROR, this, this.onConnectError);
    }

    private onSocketOpen(): void {

        // 发送字符串
        this.socket.send(JSON.stringify({'opcode': 10001}));
        this.socket.flush();
    }

    private onSocketClose(): void {
        //console.log("Socket closed");
    }

    private onMessageReveived(message: any): void {
        //console.log("Message from server:");
        if (typeof message == "string") {
            let data = JSON.parse(message);
            if (data.seq && this.callbackPool[data.seq]) {
                this.callbackPool[data.seq][0].call(this.callbackPool[data.seq][1], data);
                delete(this.callbackPool[data.seq]);
            } else {
                this.msgHandler.handle(data);
            }
        }

        this.socket.input.clear();
    }

    private onConnectError(e: Event): void {
        //console.log("error");
    }

    public sendData(data: Message, callback:Function|null, obj:any|null)
    {
        data.seq = this.sequence++;
        this.socket.send(JSON.stringify(data));

        if (callback && obj) {
            this.callbackPool[data.seq] = [callback, obj];
        }
    }
}
