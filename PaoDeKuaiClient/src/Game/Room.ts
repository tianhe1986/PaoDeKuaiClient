import Game from "./Game";
import Poker from "./Poker";
import CardSet from "./CardSet";
import CardType from "../Constants/CardType";
import Message from "../Net/Message";
import MsgCode from "../Constants/MsgCode";

export default class Room {
    private game: Game;

    //房间号
    public roomId: number;

    //自己信息
    public myInfo = { "seat": 0, "name": "", "pass": 0 }; //座位，昵称，是否跳过

    //左右座位信息
    public leftInfo = { "seat": 0, name: "" };
    public rightInfo = { "seat": 0, name: "" };

    // 自己手牌
    public myPokers: Array<Poker> = [];

    // 左右手牌数
    public leftPokerNum: number = 0;
    public rightPokerNum: number = 0;

    // 当前打出展示的牌
    public myOutPokers: Array<Poker> = [];
    public leftOutPokers: Array<Poker> = [];
    public rightOutPokers: Array<Poker> = [];

    // 当前出牌座位
    public nowSeat: number;

    // 当前桌面上最大牌
    public nowCardSet: CardSet;

    // 当前自己选中的牌型
    public myReadyCardSet: CardSet;

    // 是否可操作选中牌，仅自己出牌阶段才可操作
    public canSelect: boolean = false;

    // 分数列表，由于没有其他用，直接用字符串展示
    public scoreList: Array<string> = [];

    constructor(game: Game) {
        this.game = game;

        this.myReadyCardSet = new CardSet();
        this.nowCardSet = new CardSet();
        this.leftPokerNum = this.rightPokerNum = 0;
    }

    public onPlayGame(content: any) {
        let state = content.state;
        switch (state) {
            case 0: //发牌了
                let tempCards = content.cards.sort(function (a, b) { return b - a });
                this.refreshMyPokers(tempCards);
                this.showAllPokers();
                break;
            case 1: //游戏中，出牌信息
                this.nextOutProcess(content);
                break;
            case 2: //游戏结束，结算
                this.gameOver(content);
                break;
            default:
                break;
        }
    }

    //游戏结束处理
    public gameOver(content) {
        //设置数据
        let scores = content.scores;
        let groups = [this.myInfo, this.leftInfo, this.rightInfo];
        let txt = '';
        this.scoreList = [];
        groups.forEach((info, index, array) => {
            //console.log(info.seat, scores[info.seat]);
            txt = info.seat + '号位 : ' + <string>scores[info.seat];
            this.scoreList.push(txt);
        });

        this.game.roomView.scoreList.array = this.scoreList;
        this.game.roomView.scorePanel.visible = true;
    }

    // 退出房间处理
    public onRoomExit() {
        // 正常结束，房间内直接展示匹配按钮
        if (this.game.roomView.scorePanel.visible) {
            this.game.roomView.outYes.visible = false;
            this.game.roomView.outNo.visible = false;
            this.game.roomView.enter.visible = true;
        } else { // 由于有人退出而结束，直接回到匹配页
            this.game.refreshToMatch();
        }
    }

    //处理座位
    public processSeat(content: any) {
        let players = content.players;
        this.roomId = content.roomId;
        for (let i = 0; i < players.length; i++) {
            if (this.game.gameId == players[i]) {
                this.myInfo.name = (i + 1) + '号位：' + players[i];
                this.myInfo.seat = i + 1;
                if (i == 2) {
                    this.rightInfo.name = '1号位：' + players[0];
                    this.rightInfo.seat = 1;
                    this.leftInfo.name = '2号位：' + players[1];
                    this.leftInfo.seat = 2;
                } else if (i == 0) {
                    this.rightInfo.name = '2号位：' + players[1];
                    this.rightInfo.seat = 2;
                    this.leftInfo.name = '3号位：' + players[2];
                    this.leftInfo.seat = 3;
                } else {
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

    //出牌信息处理
    public nextOutProcess(content: any): void {
        //当前出牌的座位
        let seat = content.curPlayerIndex;
        this.nowSeat = seat;

        this.showCouldAction(seat);

        //上一轮出牌座位
        let lastSeat = seat - 1;
        if (lastSeat == 0) {
            lastSeat = 3;
        }

        //当前出牌类型
        let cardType = content.curCard.type;
        switch (cardType) {
            case CardType.INIT: //新一轮开始
                //清空当前轮出牌
                this.roundPokerClear();
                break;
            case CardType.PASSED: //不要
                //清空当前出牌者的牌
                this.removeOutPokers(seat);
                //上轮出牌座位展示不要
                this.showPass(lastSeat);
                break;
            default:
                //清空当前出牌者的牌
                this.removeOutPokers(seat);
                //展示新牌
                this.showOutPokers(lastSeat, content.curCard);
                break;
        }

        //如果是我，展示出牌与不出牌框
        let game = this.game;
        if (seat == this.myInfo.seat) {
            this.canSelect = true;
            game.roomView.outYes.visible = false;
            game.roomView.outNo.visible = (cardType != CardType.INIT);
        } else {
            this.canSelect = false;
            game.roomView.outYes.visible = false;
            game.roomView.outNo.visible = false;
        }
    }

    // 出牌检查
    public checkOutPokers() {
        let game = this.game;
        //将选中的牌放入准备牌中
        this.myReadyCardSet.cards = [];
        this.myPokers.forEach((poker, index, array) => {
            if (poker.isSelected) {
                this.myReadyCardSet.cards.push(poker.index);
            }
        });
        //计算牌型
        this.myReadyCardSet.type = game.cardLogic.calcuPokerType(this.myReadyCardSet.cards);

        //计算牌头
        this.myReadyCardSet.header = game.cardLogic.calcPokerHeader(this.myReadyCardSet.cards, this.myReadyCardSet.type);

        //是否可出
        if (game.cardLogic.canOut(this.nowCardSet, this.myReadyCardSet, this.myPokers.length)) {
            game.roomView.outYes.visible = true;
        } else {
            game.roomView.outYes.visible = false;
        }
    }

    // 出牌操作
    public giveOutAction() {
        // 不是自己出牌阶段，忽略
        if (this.nowSeat != this.myInfo.seat) {
            return;
        }

        let game = this.game;

        if (game.cardLogic.canOut(this.nowCardSet, this.myReadyCardSet, this.myPokers.length)) {
            let data = new Message();
            data.command = MsgCode.PLAYER_PLAYCARD;
            data.content = { roomId: this.roomId, index: this.myInfo.seat, curCards: { type: this.myReadyCardSet.type, header: this.myReadyCardSet.header, cards: this.myReadyCardSet.cards } };
            game.socketManager.sendData(data, this.giveOutBack, this);
        }
    }

    // 出牌成功回调
    public giveOutBack(data: Message) {
        let game = this.game;
        if (data.code == 0) {
            //已选择的牌从手牌中移除
            let newPokers = new Array<Poker>();
            this.myPokers.forEach((poker, index, array) => {
                if (poker.isSelected) {
                    poker.removeSelf();
                    game.poolManager.recoverPoker(poker);
                } else {
                    newPokers.push(poker);
                }
            });
            this.myPokers = newPokers;

            let i = 0;
            this.myPokers.forEach((poker, index, array) => {
                poker.x = (i++) * 30;
                poker.y = 0;
            });
            this.canSelect = false;

            //清除当前准备好的牌
            this.myReadyCardSet.cards = [];
            this.myReadyCardSet.type = CardType.ERROR;

            game.roomView.outYes.visible = false;
            game.roomView.outNo.visible = false;

            (game.roomView.mySeat.getChildByName("cardNum") as Laya.Text).text = '' + this.myPokers.length;
        }
    }

    // 不要操作
    public passAction(): void {
        // 不是自己出牌阶段，忽略
        if (this.nowSeat != this.myInfo.seat) {
            return;
        }

        let game = this.game;
        let data = new Message();
        data.command = MsgCode.PLAYER_PLAYCARD;
        data.content = { roomId: this.roomId, index: this.myInfo.seat, curCards: { type: CardType.PASSED, cards: [] } };
        game.socketManager.sendData(data, this.passActionBack, this);
    }

    // 不要回调
    public passActionBack(data: Message) {
        let game = this.game;
        if (data.code == 0) {
            //还原已选择的牌
            this.myPokers.forEach((poker, index, array) => {
                poker.isSelected = false;
                poker.y = 0;
            });
            this.canSelect = false;
            game.roomView.outYes.visible = false;
            game.roomView.outNo.visible = false;
        }
    }

    // 展示出的牌
    public showOutPokers(seat: number, cards: any) {
        let game = this.game;
        this.nowCardSet = cards;
        if (seat == this.myInfo.seat) {
            for (let i = 0; i < cards.cards.length; i++) {
                let poker = game.poolManager.getPoker();
                poker.index = cards.cards[i];
                this.myOutPokers.push(poker);
                poker.x = i * 30;
                poker.y = 0;
                poker.skin = poker.img;
                game.roomView.myOutCard.addChild(poker);
            }
            //这里不用移除手牌，在出牌成功的时候自然会移除
        } else if (seat == this.leftInfo.seat) {
            for (let i = 0; i < cards.cards.length; i++) {
                let poker = game.poolManager.getPoker();
                poker.index = cards.cards[i];
                this.leftOutPokers.push(poker);
                poker.x = 0;
                poker.y = i * 30;
                poker.skin = poker.img;
                game.roomView.leftOutCard.addChild(poker);
            }
            this.leftPokerNum -= cards.cards.length;
            (game.roomView.leftSeat.getChildByName("cardNum") as Laya.Text).text = '' + this.leftPokerNum;
        } else {
            for (let i = 0; i < cards.cards.length; i++) {
                let poker = game.poolManager.getPoker();
                poker.index = cards.cards[i];
                this.rightOutPokers.push(poker);
                poker.x = 0;
                poker.y = i * 30;
                poker.skin = poker.img;
                game.roomView.rightOutCard.addChild(poker);
            }
            this.rightPokerNum -= cards.cards.length;
            (game.roomView.rightSeat.getChildByName("cardNum") as Laya.Text).text = '' + this.rightPokerNum;
        }
    }

    // 展示行动信息
    public showCouldAction(seat: number): void {
        let game = this.game;
        if (seat == this.myInfo.seat) {
            (game.roomView.mySeat.getChildByName("action") as Laya.Box).visible = true;
            (game.roomView.leftSeat.getChildByName("action") as Laya.Box).visible = false;
            (game.roomView.rightSeat.getChildByName("action") as Laya.Box).visible = false;
        } else if (seat == this.leftInfo.seat) {
            (game.roomView.mySeat.getChildByName("action") as Laya.Box).visible = false;
            (game.roomView.leftSeat.getChildByName("action") as Laya.Box).visible = true;
            (game.roomView.rightSeat.getChildByName("action") as Laya.Box).visible = false;
        } else {
            (game.roomView.mySeat.getChildByName("action") as Laya.Box).visible = false;
            (game.roomView.leftSeat.getChildByName("action") as Laya.Box).visible = false;
            (game.roomView.rightSeat.getChildByName("action") as Laya.Box).visible = true;
        }
    }

    //清空某个玩家出的牌
    public removeOutPokers(seat: number): void {
        let game = this.game;
        if (seat == this.leftInfo.seat) {
            this.leftOutPokers.forEach((poker, index, array) => {
                poker.removeSelf();
                game.poolManager.recoverPoker(poker);
            });
            this.leftOutPokers = [];
            game.roomView.leftPass.visible = false;
        } else if (seat == this.rightInfo.seat) {
            this.rightOutPokers.forEach((poker, index, array) => {
                poker.removeSelf();
                game.poolManager.recoverPoker(poker);
            });
            this.rightOutPokers = [];
            game.roomView.rightPass.visible = false;
        } else {
            this.myOutPokers.forEach((poker, index, array) => {
                poker.removeSelf();
                game.poolManager.recoverPoker(poker);
            });
            this.myOutPokers = [];
            game.roomView.myPass.visible = false;
        }
    }

    // 清空本轮出牌信息
    public roundPokerClear() {
        this.nowCardSet.cards = [];
        this.nowCardSet.header = 0;
        this.nowCardSet.type = CardType.INIT;
        for (let i = 1; i <= 3; i++) {
            this.removeOutPokers(i);
        }
    }

    //展示不要框
    public showPass(seat: number) {
        let game = this.game;
        if (seat == this.myInfo.seat) {
            game.roomView.myPass.visible = true;
        } else if (seat == this.leftInfo.seat) {
            game.roomView.leftPass.visible = true;
        } else {
            game.roomView.rightPass.visible = true;
        }
    }

    //刷新牌
    protected refreshMyPokers(tempCards: Array<number>) {
        let game = this.game;
        this.myPokers = [];
        tempCards.forEach((value, index, array) => {
            let poker = game.poolManager.getPoker();
            poker.setRoom(this);
            poker.index = value;
            this.myPokers.push(poker);
        });
    }

    //展示所有的牌
    protected showAllPokers() {
        let game = this.game;
        //一开始默认都是17张
        (game.roomView.leftSeat.getChildByName("cardNum") as Laya.Text).text = '17';
        game.roomView.leftSeat.visible = true;
        (game.roomView.rightSeat.getChildByName("cardNum") as Laya.Text).text = '17';
        game.roomView.rightSeat.visible = true;
        (game.roomView.mySeat.getChildByName("cardNum") as Laya.Text).text = '17';
        game.roomView.mySeat.visible = true;

        let i = 0;
        this.myPokers.forEach((poker, index, array) => {
            poker.x = (i++) * 30;
            poker.y = 0;
            poker.skin = poker.img;
            poker.on(Laya.Event.CLICK, poker, poker.switchStatus);
            game.roomView.myCard.addChild(poker);
        });
    }
}