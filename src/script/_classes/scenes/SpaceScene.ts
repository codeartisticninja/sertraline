"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Sprite      = require("../lib/scenes/actors/Sprite");
import Actor       = require("../lib/scenes/actors/Actor");
import MediaPlayer = require("../lib/utils/MediaPlayer");
import Script      = require("../lib/utils/Script");
import Sound       = require("../lib/utils/Sound");

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
  public ammo:Pill[]=[];
  public sfx:Sound;

  constructor(game:myGame, map:string) {
    super(game, map);
    this.actorTypes["Ship"] = Ship;
    this.actorTypes["Spawner"] = Spawner;
    this.actorTypes["Joy"] = Joy;
    this.actorTypes["Pill"] = Pill;
    this.actorTypes["Anx"] = Anx;
    this.spawnPill = this.spawnPill.bind(this);

    this.sfx = new Sound("./assets/sounds/sfx.wav");
    this.sfx.setMark("explode", 0, .9);
    this.sfx.setMark("pickup", 1, .9);
    this.sfx.setMark("shoot", 2, .9);
    this.sfx.setMark("hurt", 3, .9);
    this.sfx.setMark("noammo", 4, .9);
  }
  
  reset() {
    super.reset();
    this.setAlarm(12, this.spawnPill);
  }

  update() {
    super.update();
    if (this.game.joypad.delta.fire === 1) {
      if (this.ammo.length > 0) {
        let joy = this.spawn("Joy");
        let pill = this.ammo.pop();
        pill.shoot(joy);
        if (this.ammo.length) this.ammo[this.ammo.length-1].taken = this.actorsByType["Ship"][0];
        this.sfx.play("shoot");
      } else {
        this.sfx.play("noammo");
      }
    }
    this.onOverlap(this.actorsByType["Ship"], this.actorsByType["Pill"], this._shipMeetsPill, this);
    this.onOverlap(this.actorsByType["Anx"], this.actorsByType["Pill"], this._anxMeetsPill, this);
    this.onOverlap(this.actorsByType["Anx"], this.actorsByType["Anx"], this._anxMeetsAnx, this);
    this.onOverlap(this.actorsByType["Ship"], this.actorsByType["Anx"], this._shipMeetsAnx, this);
    this.onOverlap(this.actorsByType["Joy"], this.actorsByType["Anx"], this._joyMeetsAnx, this);
  }

  spawn(name:string) {
    return this.actorsByName[name].spawn();
  }

  spawnPill() {
    this.clearAlarm(this._pillTO);
    this.spawn("Anx");
    this.spawn("Pill");
    this._pillTO = this.setAlarm(120, this.spawnPill);
  }


  /*
    _privates
  */
  private _pillTO:any;

  private _shipMeetsPill(ship:Ship, pill:Pill) {
    if (!pill.taken) {
      pill.velocity.set(0);
      pill.take(ship);
      if (this.ammo.length) this.ammo[this.ammo.length-1].taken = pill;
      this.ammo.push(pill);
      this.sfx.play("pickup");
    }
  }

  private _anxMeetsPill(anx:Anx, pill:Pill) {
    if (!pill.taken) {
      pill.shoot(anx);
      this.sfx.play("hurt");
    }
  }

  private _anxMeetsAnx(anx1:Anx, anx2:Anx) {
    if (!anx1.taken && anx1.scale.x < anx2.scale.x) {
      anx1.take();
    }
  }

  private _shipMeetsAnx(ship:Ship, anx:Anx) {
    anx.scale.addXY(.1);
    if (anx.scale.x > 2.2) {
      if (this.ammo.length) this.ammo.pop().taken=null;
    };
    if (anx.scale.x > 32 && !anx.taken) {
      anx.take()
    };
  }

  private _joyMeetsAnx(joy:Joy, anx:Anx) {
    if (!anx.taken) {
      anx.take();
      this.removeActor(joy);
    }
  }

}
export = SpaceScene;
