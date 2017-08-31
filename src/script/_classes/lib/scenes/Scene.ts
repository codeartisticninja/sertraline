/// <reference path="../../../_d.ts/node.d.ts"/>
"use strict";
import Game        = require("../Game");
import Actor       = require("./actors/Actor");
import Sprite      = require("./actors/Sprite");
import Scenery     = require("./actors/Scenery");
import Vector2     = require("../utils/Vector2");
import http        = require("http");
import lazyJSON    = require("../utils/lazyJSON");

import Text        = require("./actors/Text");

/**
 * Scene class
 * 
 * @date 31-aug-2017
 */

class Scene {
  public actorTypes:Object = {};
  public actors:Actor[];
  public actorsByType:Object;
  public actorsByName:Object = {};
  public spritesByFirstGid:Sprite[]=[];
  public spritesByName:Object = {};
  public size:Vector2 = new Vector2();
  public gravity:Vector2 = new Vector2();
  public camera:Vector2 = new Vector2();
  public boundCamera=true;
  public mouse:Vector2 = new Vector2();
  public mapData:any;
  public backgroundColor:string;

  constructor(public game:Game, public mapUrl?:string) {
    this.size.set(game.canvas.width, game.canvas.height);
  }

  reset() {
    var _t = this;
    this.actors = [];
    this.actorsByType = {};
    this.clearAllAlarms();
    if (this.mapUrl) {
      this.game.loading++;
      http.get(this.mapUrl, function(res){
        var data = "";
        res.on("data", function(chunk:string){ data += chunk; });
        res.on("end", function() {
          _t.mapData = JSON.parse(data.trim());
          _t.loadMap();
          _t.game.loaded++;
        });
      });
    }
  }

  enter() {
  }
  exit() {
  }

  loadMap() {
    var mapFolder = this.mapUrl.substr(0, this.mapUrl.lastIndexOf("/")+1);
    this.size.set(this.mapData.width*this.mapData.tilewidth, this.mapData.height*this.mapData.tileheight);
    this.backgroundColor = this.mapData.backgroundcolor;
    for (var tileset of this.mapData.tilesets) {
      this.addSprite(new Sprite(tileset, mapFolder));
    }
    for (var layer of this.mapData.layers) {
      switch (layer.type) {
        case "objectgroup":
          for (var obj of layer.objects) {
            if (this.actorTypes[obj.type]) {
              this.addActor(new this.actorTypes[obj.type](this, obj));
            } else if (obj.text) {
              this.addActor(new Text(this, obj));
            } else {
              this.addActor(new Actor(this, obj));
            }
          }
          break;
        case "imagelayer":
          this.addActor(new Scenery(this, layer));
          break;
      }
    }
    lazyJSON.setProperties(this.mapData.properties, this);
  }

  update() {
    let i=0;
    for (var alarm of this._alarms) {
      alarm.frames--;
      if (alarm.frames <= 0) {
        this.clearAlarm(alarm);
        alarm.cb();
      }
    }
    for (var actor of this.actors) {
      actor.update();
      if (i) {
        if (this.actors[i].order < this.actors[i-1].order) {
          let a = this.actors[i];
          this.actors[i] = this.actors[i-1];
          this.actors[i-1] = a;
        }
      }
      i++;
    }
    if (this.boundCamera) {
      this.camera.x = Math.max(this.camera.x, 0);
      this.camera.y = Math.max(this.camera.y, 0);
      this.camera.x = Math.min(this.camera.x, this.size.x-this.game.canvas.width);
      this.camera.y = Math.min(this.camera.y, this.size.y-this.game.canvas.height);
    }
  }

  render() {
    if (!this.game) return false;
    var g = this.game.ctx;
    for (var actor of this.actors) {
      if (actor.visible) {
        g.save();
        g.translate(-this.camera.x*actor.parallax, -this.camera.y*actor.parallax);
        g.translate(actor.position.x, actor.position.y);
        g.rotate(actor.rotation);
        g.scale(actor.scale.x, actor.scale.y);
        g.globalAlpha = actor.opacity;
        actor.render();
        g.restore();
      }
    }
  }

  addActor(actor:Actor, ...toGroup:Array<Actor>[]) {
    toGroup.push(this.actors);
    toGroup.push(this.actorsByType[actor.type] = this.actorsByType[actor.type] || []);
    for (var group of toGroup) {
      var i = group.indexOf(actor);
      if (i === -1) {
        group.push(actor);
      }
    }
    this.actorsByName[actor.name] = actor;
    actor.scene = this;
    return actor;
  }

  removeActor(actor:Actor, ...fromGroup:Array<Actor>[]) {
    setTimeout(()=>{
      fromGroup.push(this.actors);
      fromGroup.push(this.actorsByType[actor.type]);
      for (var group of fromGroup) {
        var i = group.indexOf(actor);
        if (i !== -1) {
          group.splice(i,1);
        }
      }
      this.actorsByName[actor.name] = null;
      actor.scene = null;
    });
    return actor;
  }

  bringActorToFront(actor:Actor, ...fromGroup:Array<Actor>[]) {
    setTimeout(()=>{
      fromGroup.push(this.actors);
      fromGroup.push(this.actorsByType[actor.type]);
      for (var group of fromGroup) {
        var i = group.indexOf(actor);
        if (i !== -1) {
          group.splice(i,1);
          group.push(actor);
        }
      }
    });
  }

  bringActorToBack(actor:Actor, ...fromGroup:Array<Actor>[]) {
    setTimeout(()=>{
      fromGroup.push(this.actors);
      fromGroup.push(this.actorsByType[actor.type]);
      for (var group of fromGroup) {
        var i = group.indexOf(actor);
        if (i !== -1) {
          group.splice(i,1);
          group.unshift(actor);
        }
      }
    });
  }

  addSprite(sprite:Sprite) {
    this.spritesByFirstGid[sprite.firstGid] = sprite;
    this.spritesByName[sprite.name] = sprite;
    sprite.ctx = this.game.ctx;
    if (!sprite.img.complete) {
      this.game.loading++;
      sprite.img.addEventListener("load", () => {
        this.game.loaded++;
      });
    }
  }
  getSpriteByGid(gid:number) {
    while (gid > -1 && !this.spritesByFirstGid[gid]) {
      gid--;
    }
    return this.spritesByFirstGid[gid];
  }
  getSpriteByName(name:string) {
    return this.spritesByName[name];
  }

  onOverlap(a:Actor|Array<Actor>, b:Actor|Array<Actor>, resolver:Function, context:Object=this) {
    if (!(a && b && resolver)) return;
    if (a instanceof Actor) a = [ a ];
    if (b instanceof Actor) b = [ b ];
    for (var actorA of a) {
      for (var actorB of b) {
        if (actorA !== actorB && actorA.overlapsWith(actorB)) {
          resolver.call(context, actorA, actorB);
        }
      }
    }
  }

  clearAllAlarms() {
    this._alarms = [];
  }

  setAlarm(frames:number, cb:Function) {
    let alarm = {
      frames: frames,
      cb: cb
    };
    this._alarms.push(alarm);
    return alarm;
  }

  clearAlarm(alarm:any) {
    setTimeout(()=>{
      let i = this._alarms.indexOf(alarm);
      if (i > -1) {
        this._alarms.splice(i, 1);
      }
    });
  }

  click(x:number, y:number) {
    let m = new Vector2(x,y);
    let p = new Vector2();
    this.mouse.copyFrom(m);
    this.mouse.add(this.camera);
    for (var actor of this.actors) {
      p.copyFrom(this.camera).multiplyXY(actor.parallax).add(m);
      if (actor.overlapsWithPoint(p)) actor.click();
    }
  }


  /*
    _privates
  */
  private _alarms:Array<any>=[];

}
export = Scene;
