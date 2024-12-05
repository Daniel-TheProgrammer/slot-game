import { Application, Assets, Container } from "pixi.js";
import { gsap } from "gsap";
import { Howl } from "howler";
import Loader from "./Loader";
import PlayButton from "./PlayButton";
import Background from "./Background";
import ReelsContainer from "./ReelsContainer";
import Scoreboard from "./Scoreboard";
import SoundToggle from "./SoundToggle";
import VictoryScreen from "./VictoryScreen";
import { SpineBoy } from "./spineanimation";

export default class Game {
  public app: Application;
  private loader: Loader;
  private playBtn: PlayButton;
  private reelsContainer: ReelsContainer;
  private scoreboard: Scoreboard;
  private soundToggle: SoundToggle;
  private victoryScreen: VictoryScreen;
  private backgroundMusic: Howl;
  private spinSound: Howl;
  private winSound: Howl;
  private loseSound: Howl;
  private spineBoy: SpineBoy;

  constructor() {
    this.app = new Application();
  }

  public async init() {
    await this.app.init({ width: 960, height: 536 });
    this.loader = new Loader(this.app);
    window.document.body.appendChild(this.app.canvas);
    await this.loader.loadAssets();
    this.loadSounds();
    this.createScene();
    this.createPlayButton();
    this.createReels();
    this.createScoreboard();
    this.createVictoryScreen();
    this.createSoundToggle();
    this.playBackgroundMusic();
    this.createSpineBoy();
  }

  private loadSounds() {
    this.backgroundMusic = new Howl({
      src: ["assets/sounds/game-bg-music.mp3"],
      loop: true,
      volume: 0.5,
    });
    this.spinSound = new Howl({
      src: ["assets/sounds/game-start.mp3"],
      volume: 0.8,
    });
    this.winSound = new Howl({
      src: ["assets/sounds/game-win.mp3"],
      volume: 1.0,
    });
    this.loseSound = new Howl({
      src: ["assets/sounds/lose.mp3"],
      volume: 1.0,
    });
  }

  private playBackgroundMusic() {
    this.backgroundMusic.play();
  }

  private createScene() {
    const bg = new Background();
    this.app.stage.addChild(bg.sprite);
    gsap.from(bg.sprite.scale, {
      x: 0,
      y: 0,
      duration: 1,
      ease: "bounce.out",
    });
  }

  private createPlayButton() {
    this.playBtn = new PlayButton(this.app, this.handleStart.bind(this));
    this.app.stage.addChild(this.playBtn.sprite);
    gsap.from(this.playBtn.sprite, {
      alpha: 0,
      y: "+=50",
      duration: 0.8,
      ease: "power2.out",
    });

    this.playBtn.sprite.interactive = true;
    this.playBtn.sprite.on("pointerover", () =>
      gsap.to(this.playBtn.sprite.scale, {
        x: 1.2,
        y: 1.2,
        duration: 0.2,
      })
    );
    this.playBtn.sprite.on("pointerout", () =>
      gsap.to(this.playBtn.sprite.scale, { x: 1, y: 1, duration: 0.2 })
    );
  }

  private createReels() {
    this.reelsContainer = new ReelsContainer(this.app);
    this.app.stage.addChild(this.reelsContainer.container);
    gsap.from(this.reelsContainer.container, { alpha: 0, duration: 1 });
  }

  private createScoreboard() {
    this.scoreboard = new Scoreboard(this.app);
    this.app.stage.addChild(this.scoreboard.container);
    gsap.from(this.scoreboard.container, {
      alpha: 0,
      duration: 1,
      delay: 0.5,
    });
  }

  private createVictoryScreen() {
    this.victoryScreen = new VictoryScreen(
      this.app.screen.width,
      this.app.screen.height
    );
    this.app.stage.addChild(this.victoryScreen.container);
    this.victoryScreen.container.alpha = 0;
  }

  private createSoundToggle() {
    this.soundToggle = new SoundToggle(this.app);
    this.app.stage.addChild(this.soundToggle.container);
  }

  private createSpineBoy() {
    this.spineBoy = new SpineBoy();
    this.spineBoy.view.x = this.app.screen.width / 2;
    this.spineBoy.view.y = this.app.screen.height - 80;
    const spineView = this.spineBoy.view as unknown as Container;
    spineView.scale.set(0.5);
  }

  private removeSpineBoy() {
    if (this.spineBoy.view.parent) {
      this.spineBoy.view.parent.removeChild(this.spineBoy.view);
    }
    this.resetPlayButton();
  }

  private async handleStart() {
    this.spinSound.play();
    this.scoreboard.decrement();
    this.playBtn.setDisabled();
    this.reelsContainer.spin().then(this.processSpinResult.bind(this));

    setTimeout(() => {
      console.log("Re-enabling play button after spin");
      this.resetPlayButton();
    }, 1000);
  }

  private resetPlayButton() {
    console.log("Resetting play button to active state");
    this.playBtn.setEnabled();
    gsap.fromTo(
      this.playBtn.sprite.scale,
      { x: 1.2, y: 1.2 },
      { x: 1, y: 1, duration: 0.2 }
    );

    this.playBtn.sprite.interactive = true;
    this.playBtn.sprite.on("pointerover", () =>
      gsap.to(this.playBtn.sprite.scale, {
        x: 1.2,
        y: 1.2,
        duration: 0.2,
      })
    );
    this.playBtn.sprite.on("pointerout", () =>
      gsap.to(this.playBtn.sprite.scale, { x: 1, y: 1, duration: 0.2 })
    );
  }

  private processSpinResult(isWin: boolean) {
    if (isWin) {
      this.winSound.play();
      this.scoreboard.increment();
      this.victoryScreen.showWin();
      this.spineBoy.direction = 1;
      this.spineBoy.playAnimation("run");
      this.app.stage.addChild(this.spineBoy.view);
      setTimeout(() => {
        this.removeSpineBoy();
      }, 3000);

      gsap.fromTo(
        this.victoryScreen.container,
        { alpha: 0, y: -100 },
        { alpha: 1, y: 0, duration: 1, ease: "bounce.out" }
      );
    } else {
      this.loseSound.play();
      this.victoryScreen.showLose();
      this.spineBoy.direction = -1;
      this.spineBoy.playAnimation("walk");
      this.app.stage.addChild(this.spineBoy.view);
      setTimeout(() => {
        this.removeSpineBoy();
      }, 3000);

      gsap.to(this.reelsContainer.container, {
        x: "+=10",
        duration: 0.05,
        repeat: 5,
        yoyo: true,
        onComplete: () => {
          this.reelsContainer.container.x = 0;
        },
      });
    }

    if (this.scoreboard.outOfMoney) {
      this.spineBoy.direction = 0;
      this.spineBoy.playAnimation("idle");
      this.app.stage.addChild(this.spineBoy.view);
      setTimeout(() => {
        this.removeSpineBoy();
      }, 3000);
    }
  }
}
