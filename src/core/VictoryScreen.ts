import { Container, Graphics, TextStyle, Text } from "pixi.js";

export default class VictoryScreen {
  public container: Container;
  private overlay: Graphics;
  private message: Text;

  constructor(appWidth: number, appHeight: number) {
    this.container = new Container();
    this.generate(appWidth, appHeight);
  }

  private generate(appWidth: number, appHeight: number) {
    this.container.visible = false;

    this.overlay = new Graphics()
      .beginFill(0xffffff, 0.001)
      .drawRect(0, 0, appWidth, appHeight)
      .endFill();
    this.overlay.interactive = true;

    const rect = new Graphics()
      .beginFill(0x02474e, 0.8)
      .drawRoundedRect(0, 0, 717.5, 400, 20)
      .endFill();
    rect.x = (appWidth - rect.width) / 2;
    rect.y = (appHeight - rect.height) / 2;

    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 96,
      fill: "yellow",
    });

    this.message = new Text("", style);
    this.message.anchor.set(0.5);
    this.message.x = appWidth / 2;
    this.message.y = appHeight / 2;

    this.container.addChild(this.overlay, rect, this.message);
  }

  showWin() {
    this.message.text = "YOU WON!";
    this.container.visible = true;
    setTimeout(() => {
      this.hide();
    }, 3000); 
  }

  showLose() {
    this.message.text = "YOU LOST!";
    this.container.visible = true;
    setTimeout(() => {
      this.hide();
    }, 3000); 
  }

  hide() {
    this.container.visible = false;
  }
}
