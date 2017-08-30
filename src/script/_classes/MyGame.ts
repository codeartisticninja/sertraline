"use strict";
import Game = require("./lib/Game");

import AdventureScene  = require("./scenes/AdventureScene");


/**
 * MyGame class
 */

class MyGame extends Game {
  public scriptVars={}
  
  constructor(container:string|HTMLElement) {
    super(container, 960);
    this.frameRate = 12;
    this.addScene("bedroom", new AdventureScene(this, "./assets/maps/bedroom.json"));
    this.addScene("dream",   new AdventureScene(this, "./assets/maps/dream.json"));
    this.joypad.mode = "gc";
    this.joypad.enable();
    this.startScene("dream");
  }

  startScene(sceneName:string) {
    for (let name in this.scenes) {
      document.body.parentElement.classList.remove(name);
    }
    document.body.parentElement.classList.add(sceneName);
    if (sceneName === "dream") {
      this.mediaChannels.ambiance.play("./assets/sounds/water.mp3", true);
    } else {
      this.mediaChannels.ambiance.pause();
    }
    super.startScene(sceneName);
  }

}
export = MyGame;
