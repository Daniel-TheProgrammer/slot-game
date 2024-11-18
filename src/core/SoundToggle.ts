import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { Howler } from "howler";

export default class SoundToggle {
    public container: Container;
    private soundState: boolean;
    private soundText: Text;

    constructor(app: Application) {
        this.container = new Container();
        this.soundState = true;
        this.generate(app.screen.width, app.screen.height);
    }

    private toggleSound() {
        this.soundState = !this.soundState;
        this.soundText.text = `Sound: ${this.soundState ? "ON" : "OFF"}`;

        // Howler.js global mute/unmute
        Howler.mute(!this.soundState);
    }

    private generate(appWidth: number, appHeight: number) {
        const style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 24,
            fill: "yellow",
        });

        this.soundText = new Text("Sound: ON", style);
        this.soundText.x = 10;
        this.soundText.y = 5;

        this.soundText.interactive = true;
        this.soundText.cursor = "pointer";

        // Add click event to toggle sound
        this.soundText.on("pointerdown", this.toggleSound.bind(this));

        const rect = new Graphics()
            .beginFill(0x02474e, 0.8)
            .drawRect(0, 0, 160, this.soundText.height + 20)
            .endFill();

        this.container.x = appWidth - rect.width - 5;
        this.container.y = 10;

        this.container.addChild(rect, this.soundText);
    }
}
