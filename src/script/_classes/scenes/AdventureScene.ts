"use strict";
import Scene       = require("../lib/scenes/Scene");
import myGame      = require("../MyGame");
import Sprite      = require("../lib/scenes/actors/Sprite");
import Actor       = require("../lib/scenes/actors/Actor");
import MediaPlayer = require("../lib/utils/MediaPlayer");
import Script      = require("../lib/utils/Script");

import Aye         = require("./actors/Aye");
import Fish        = require("./actors/Fish");
import Trigger     = require("./actors/Trigger");
import Thing       = require("./actors/Thing");
import Dialog      = require("./actors/Dialog");

/**
 * AdventureScene class
 */

class AdventureScene extends Scene {
  public game:myGame;
  public script:Script;

  constructor(game:myGame, map:string) {
    super(game, map);
    this.actorTypes["Aye"] = Aye;
    this.actorTypes["Fish"] = Fish;
    this.actorTypes["Trigger"] = Trigger;
    this.actorTypes["Thing"] = Thing;
  }

  reset() {
    super.reset();
    this.addActor(new Dialog(this));
  }

  loadScript(url:string) {
    this.script = new Script(url, this.game.scriptVars);
    this.script.commands["p"] = (attrs:any, body:string, el:Element, cb:Function) => {
      this.actorsByType["Dialog"][0].say(body, cb);
    }
    this.script.commands["wait"] = (attrs:any, body:string, el:Element, cb:Function) => {
      this.setAlarm(parseInt(body), cb);
    }
    this.script.commands["scene"] = (attrs:any, body:string) => {
      this.game.startScene(body);
    }
    this.script.commands["track"] = (attrs:any, body:string, el:Element, cb:Function) => {
      this.game.trackEvent(body);
      cb();
    }
    this.script.commands["sleep"] = (attrs:any, body:string, el:Element, cb:Function) => {
      this.actorsByType["Aye"][0].sleep();
      cb();
    }
    this.script.commands["do"] = (attrs:any, body:string, el:Element, cb:Function) => {
      this.actorsByType["Aye"][0].doSomething();
      cb();
    }
    this.script.commands["idle"] = (attrs:any, body:string, el:Element, cb:Function) => {
      this.actorsByType["Aye"][0].doNothing();
      cb();
    }
  }

  enter() {
    super.enter();
    this._gotoEnter();
  }

  update() {
    super.update();
    this.onOverlap(this.actorsByType["Aye"], this.actorsByType["Trigger"], this.AyeMeetsTrigger, this);
    this.onOverlap(this.actorsByType["Aye"], this.actorsByType["Thing"], this.AyeMeetsTrigger, this);
    this.onOverlap(this.actorsByType["Aye"], this.actorsByType["Wall"], this.AyeMeetsWall, this);
    this.onOverlap(this.actorsByType["Fish"], this.actorsByType["Aye"], this.FishMeetsAye, this);
  }

  click(x:number, y:number) {
    super.click(x,y);
    this.actorsByType["Aye"][0].goTo(this.mouse);
  }

  FishMeetsAye(fish:Fish, aye:Aye) {
    fish.snapToEdge(aye);
    fish.scale.x *= -1;
    fish.velocity.x *= -3;
  }

  AyeMeetsWall(aye:Aye, wall:Actor) {
    aye.snapToEdge(wall);
  }

  AyeMeetsTrigger(aye:Aye, trigger:Trigger) {
    let joy = this.game.joypad;
    // if (joy.fire) aye.position.x = trigger.position.x;
    trigger.hover();
  }

  /*
    _privates
  */

  private _gotoEnter() {
    if (this.script && this.script.storyTree) {
      this.script.goto("#enter");
    } else {
      setTimeout(this._gotoEnter.bind(this), 1024);
    }
  }
}
export = AdventureScene;
