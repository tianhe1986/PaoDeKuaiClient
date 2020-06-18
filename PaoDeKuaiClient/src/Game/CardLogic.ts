import CardSet from "./CardSet";
import CardType from "../Constants/CardType";

export default class CardLogic {
    constructor() {

    }

    //是否可出
    // nowCardSet 当前最大牌型
    // myReadyCardSet 选中的手牌构成的牌型
    // myPokerNum 当前总手牌数
    public canOut(nowCardSet: CardSet, myReadyCardSet: CardSet, myPokerNum: number) {
        //如果当前没有牌，只要牌型正确，就可以出
        if (nowCardSet.type == CardType.INIT && myReadyCardSet.type != CardType.ERROR) {
            if (myReadyCardSet.type == CardType.THREE_ONE) { // 三带一要特殊处理，必须是最后才能出
                return myPokerNum == 4;
            }
            return true;
        }

        //炸弹
        if (myReadyCardSet.type == CardType.BOMB) {
            if (nowCardSet.type == CardType.BOMB) { //前面也是炸弹，需要比较大小
                if (myReadyCardSet.header > nowCardSet.header) {
                    return true;
                }
            } else { //炸了
                return true;
            }
        } else { // 类型相同，张数相同，头牌更大，则可以出
            if (myReadyCardSet.cards.length == nowCardSet.cards.length && myReadyCardSet.type == nowCardSet.type && myReadyCardSet.header > nowCardSet.header) { //同类型，张数相同，值更大
                return true;
            }
        }

        return false;
    }

    //计算牌型
    public calcuPokerType(cards: Array<number>): number {
        //转换为点数
        let points = this.cardsToPoints(cards);

        return this.calcuPointsType(points);
    }

    //牌转点数
    public cardsToPoints(cards: Array<number>): Array<number> {
        let points = new Array<number>();
        let point = 0;
        cards.forEach((value, index, array) => {
            // 不会有大小王，因此这样做就OK
            if (value % 4 == 0) {
                point = value / 4 + 2;
            } else {
                point = Math.floor(value / 4) + 3;
            }

            points.push(point);
        });

        //从小到大，再排一下序
        points.sort(function (a, b) { return a - b; });

        return points;
    }

    public calcuPointsType(points): number {
        let len = points.length;

        if (len == 1) { //单牌
            return CardType.SINGLE;
        } else if (len == 2) {
            if (points[0] == points[1]) { //对子
                return CardType.DOUBLE;
            }
        } else if (len == 4) { // 姊妹对， 3带1， 炸弹
            let maxSameNum = this.calcMaxSameNum(points);
            let diffNum = this.calcDiffNum(points);
            if (maxSameNum == 4) { // 有四张一样的，自然是炸弹
                return CardType.BOMB;
            } else if (maxSameNum == 3) { // 三张一样的，三带一
                return CardType.THREE_ONE;
            } else if (maxSameNum == 2 && diffNum == 2 && points[0] + 1 == points[3] && points[3] < 15) { // 两种点数，最多有两张一样的，且点数相连，姊妹对
                return CardType.CONNECT_DOUBLE;
            }
        } else if (len >= 5 && this.isStraight(points) && points[len - 1] < 15) { //这里直接判断所有顺子，免得后面大于5的时候都去判断是否是顺子
            return CardType.STRAIGHT;
        } else if (len == 5 && this.calcMaxSameNum(points) == 3) {//最大相同数为3，有两种点数，说明是三带二
            return CardType.THREE_TWO;
        } else if (len >= 6) { // 大于6的情况, 姊妹对或连续三带二
            let maxSameNum = this.calcMaxSameNum(points);
            let diffNum = this.calcDiffNum(points);
            if (len % 2 == 0 && maxSameNum == 2 && diffNum == len / 2 && (points[len - 1] - points[0] == len / 2 - 1) && points[len - 1] < 15) { //姊妹对
                return CardType.CONNECT_DOUBLE;
            }
            if (len % 5 == 0) { // 连续三带二
                // 找出点数出现大于等于3次的最长递增点数列表，如果此列表长度大于等于 len / 5且最靠前的一段不会到2，则可以
                let threeCards = this.calcSameNumMaxStraightCards(points, 3);
                if (threeCards.length >= len / 5 && threeCards[len / 5 - 1] < 15) {
                    return CardType.CONNECT_THREE_TWO;
                }
            }
        }
        return CardType.ERROR; //错误牌型
    }

    //最多有多少张点数相同的牌
    public calcMaxSameNum(points: Array<number>): number {
        let maxNum = 1;
        let nowNum = 1;
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i] == points[i + 1]) { //与下一张相同，数量加1
                nowNum++;
                if (nowNum > maxNum) {
                    maxNum = nowNum;
                }
            } else { //重新开始计算
                nowNum = 1;
            }
        }

        return maxNum;
    }

    //有多少不同的点数
    public calcDiffNum(points: Array<number>): number {
        let diffNum = 1;
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i] != points[i + 1]) { //与下一张不同，数量加1
                diffNum++;
            }
        }

        return diffNum;
    }

    //是否是顺子
    public isStraight(points: Array<number>): boolean {
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i + 1] != points[i] + 1) {
                return false;
            }
        }
        return true;
    }

    // 从所有点数的数量大于等于N的列表中，取出最长连续递增子区间
    public calcSameNumMaxStraightCards(points: Array<number>, num: number): Array<number> {
        let geNumCards = this.calcGeNumCards(points, num);
        if (geNumCards.length == 0) {
            return [];
        }

        // 遍历找最长连续递增子区间
        let maxStartPoint: number = geNumCards[0];
        let maxNum: number = 1;

        let nowStartPoint: number = geNumCards[0];
        let nowNum: number = 1;

        for (let i = 1, len = geNumCards.length; i < len; i++) {
            if (geNumCards[i] == geNumCards[i - 1] + 1) { // 比上一张多1
                nowNum++;
            } else { // 重新开始计算
                if (nowNum > maxNum) {
                    maxNum = nowNum;
                    maxStartPoint = nowStartPoint;
                }
                nowNum = 1;
                nowStartPoint = geNumCards[i];
            }
        }

        if (nowNum > maxNum) {
            maxNum = nowNum;
            maxStartPoint = nowStartPoint;
        }

        let cards = new Array<number>();
        for (let i = 0; i < maxNum; i++) {
            cards.push(maxStartPoint + i);
        }

        return cards;
    }

    // 取出所有满足条件的点数：该点数的数量大于等于N
    public calcGeNumCards(points: Array<number>, num: number): Array<number> {
        let cards = new Array<number>();

        let nowNum = 1;
        for (let i = 0; i < points.length - 1; i++) {
            if (points[i] == points[i + 1]) { //与下一张相同，数量加1
                nowNum++;
            } else { //重新开始计算
                if (nowNum >= num) {
                    cards.push(points[i]);
                }
                nowNum = 1;
            }
        }

        if (nowNum >= num) {
            cards.push(points[points.length - 1]);
        }

        return cards;
    }

    //计算最大的牌
    public calcPokerHeader(cards: Array<number>, type: number): number {
        let points = this.cardsToPoints(cards);
        return this.calcPointsHeader(points, type);
    }

    public calcPointsHeader(points: Array<number>, type: number): number {
        switch (type) {
            case CardType.SINGLE: //单牌
            case CardType.DOUBLE: //对子
            case CardType.CONNECT_DOUBLE: // 姊妹对
            case CardType.STRAIGHT: //顺子
            case CardType.BOMB: //炸弹
                return points[0];
            case CardType.THREE_ONE: //三带一
            case CardType.THREE_TWO: //三带二
            // trick 第三张一定属于出现3次的点数
                return points[2];
            case CardType.CONNECT_THREE_TWO: //连续三带二
                // 找出点数出现大于等于3次的最长递增点数列表， 返回最大的可能头牌
                let len = points.length / 5;
                let threeCards = this.calcSameNumMaxStraightCards(points, 3);
                let endIndex = threeCards.length - 1;
                for (; endIndex >= len - 1; endIndex--) {
                    if (threeCards[endIndex] < 15) {
                        break;
                    }
                } 
                return threeCards[endIndex - len + 1];
            default:
                return 0;
        }
    }
}