"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Sprite      = require("../lib/scenes/actors/Sprite");
import Actor       = require("../lib/scenes/actors/Actor");
import MediaPlayer = require("../lib/utils/MediaPlayer");
import Script      = require("../lib/utils/Script");

import Ship        = require("./actors/Ship");

/**
 * SpaceScene class
 */

class SpaceScene extends Scene {
  public game:myGame;

  constructor(game:myGame, map:string) {
    super(game, map);
    this.actorTypes["Ship"] = Ship;
  }

  update() {
    super.update();
    this.onOverlap(this.actorsByType["Ship"], this.actorsByType["PillSpawner"], this._shipMeetsActor, this);
  }


  /*
    _privates
  */

  private _shipMeetsActor(ship:Ship, actor:Actor) {
    ship.snapToEdge(actor);
  }

}
export = SpaceScene;
