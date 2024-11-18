import { Application, Container, Text, TextStyle } from "pixi.js";

export default class Scoreboard {
    public container: Container;
    public outOfMoney = false;
    private money: number = 100;
    private bet: number = 5;
    private moneyText: Text;

    constructor(app: Application) {
        this.container = new Container();
        this.generate(app.screen.width);
    }

    decrement() {
        if (!this.outOfMoney) {
            this.money -= this.bet;
            this.updateText();
        }
        if (this.money - this.bet < 0) {
            this.outOfMoney = true;
        }
    }

    increment() {
        this.money += this.bet * 2;
        this.updateText();
        if (this.outOfMoney) {
            this.outOfMoney = false;
        }
    }

    private generate(appWidth: number) {
        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white",
        });

        this.moneyText = new Text(`Money: $${this.money}`, style);
        this.moneyText.x = appWidth - 200;
        this.moneyText.y = 10;

        this.container.addChild(this.moneyText);
    }

    private updateText() {
        this.moneyText.text = `Money: $${this.money}`;
    }
}
