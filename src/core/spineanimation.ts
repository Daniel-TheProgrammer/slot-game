import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { Container } from "pixi.js";

export class SpineBoy {
  view: any;
  spine: Spine;
  directionalView: any;
  constructor() {
    this.view = new Container();

    this.spine = Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });

    this.view = new Container();
    this.directionalView = new Container();

    this.spine = Spine.from({
      skeleton: "spineSkeleton",
      atlas: "spineAtlas",
    });

    this.directionalView.addChild(this.spine);

    this.view.addChild(this.directionalView);

    this.spine.state.data.defaultMix = 0.2;
  }

  get direction() {
    return this.directionalView.scale.x > 0 ? 1 : -1;
  }

  set direction(value) {
    this.directionalView.scale.x = value;
  }

  playAnimation() {
    const trackEntry = this.spine.state.setAnimation(0, "run", true);

    trackEntry.timeScale = 1
  }
}
