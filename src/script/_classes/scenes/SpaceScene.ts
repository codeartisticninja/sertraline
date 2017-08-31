"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Sprite      = require("../lib/scenes/actors/Sprite");
import Actor       = require("../lib/scenes/actors/Actor");
import MediaPlayer = require("../lib/utils/MediaPlayer");
import Script      = require("../lib/utils/Script");

import Ship        = require("./actors/Ship");
import Spawner     = require("./actors/Spawner");
import Joy         = require("./actors/Joy");
import Pill        = require("./actors/Pill");
import Anx         = require("./actors/Anx");

/**
 * SpaceScene class
 */

class SpaceScene extends Scene {
  public game:myGame;
  public ammo:number=0;

  constructor(game:myGame, map:string) {
    super(game, map);
    this.actorTypes["Ship"] = Ship;
    this.actorTypes["Spawner"] = Spawner;
    this.actorTypes["Joy"] = Joy;
    this.actorTypes["Pill"] = Pill;
    this.actorTypes["Anx"] = Anx;
    this.spawnPill = this.spawnPill.bind(this);
  }
  
  reset() {
    super.reset();
    this.setAlarm(12, this.spawnPill);
  }

  update() {
    super.update();
    if (this.ammo > 0 && this.game.joypad.delta.fire === 1) {
      this.spawn("Joy");
      this.ammo--;
    }
    this.onOverlap(this.actorsByType["Ship"], this.actorsByType["Pill"], this._shipMeetsPill, this);
    this.onOverlap(this.actorsByType["Ship"], this.actorsByType["Anx"], this._shipMeetsAnx, this);
    this.onOverlap(this.actorsByType["Joy"], this.actorsByType["Anx"], this._joyMeetsAnx, this);
  }

  spawn(name:string) {
    this.actorsByName[name].spawn();
  }

  spawnPill() {
    this.spawn("Anx");
    this.spawn("Pill");
    this.setAlarm(120, this.spawnPill);
  }


  /*
    _privates
  */

  private _shipMeetsPill(ship:Ship, pill:Pill) {
    if (!pill.taken) {
      pill.take();
      this.ammo++;
    }
  }

  private _shipMeetsAnx(ship:Ship, anx:Anx) {
    anx.scale.addXY(.1);
  }

  private _joyMeetsAnx(joy:Joy, anx:Anx) {
    if (!anx.taken) {
      anx.take();
      this.removeActor(joy);
    }
  }

}
export = SpaceScene;
