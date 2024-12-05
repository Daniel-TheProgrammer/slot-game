import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { Container } from "pixi.js";

export class SpineBoy {
  view: Container;
  spine: Spine;
  directionalView: Container;

  constructor() {
    this.view = new Container();
    this.directionalView = new Container();

    this.spine = Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });

    this.directionalView.addChild(this.spine as unknown as Container);
    this.view.addChild(this.directionalView);

    if (this.spine.state) {
      this.spine.state.data.defaultMix = 0.2;
    }
  }

  get direction() {
    return this.directionalView.scale.x > 0 ? 1 : -1;
  }

  set direction(value: number) {
    this.directionalView.scale.x = value > 0 ? 1 : -1;
  }

  playAnimation(name: string) {
    if (this.spine.state) {
      const current = this.spine.state.getCurrent(0);
      if (current?.animation?.name !== name) {
        const trackEntry = this.spine.state.setAnimation(0, name, true);
        trackEntry.timeScale = name === "run" ? 1 : 0.5;
      }
    }
  }
}
