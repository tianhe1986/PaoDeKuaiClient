import Poker from "./Poker";

export default class PoolManager {
    constructor() {

    }

    //获得到一个Poker对象
    public getPoker(): Poker  {
        let poker = Laya.Pool.getItemByClass('poker', Poker);
        poker.reInit();

        return poker;
    }

    //回收Poker对象
    public recoverPoker(poker: Poker): void {
        Laya.Pool.recover('poker', poker);
    }
}