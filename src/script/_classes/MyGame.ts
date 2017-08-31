"use strict";
import Game = require("./lib/Game");

import SpaceScene  = require("./scenes/SpaceScene");


/**
 * MyGame class
 */

class MyGame extends Game {
  public scriptVars={}
  
  constructor(container:string|HTMLElement) {
    super(container, 960);
    this.frameRate = 12;
    this.addScene("space", new SpaceScene(this, "./assets/maps/space.json"));
    this.joypad.mode = "rc";
    this.joypad.enable();
    this.startScene("space");
  }

}
export = MyGame;
