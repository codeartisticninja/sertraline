"use strict";
import Vector2 = require("./Vector2");

/**
 * lazyJSON module
 * 
 * @date 18-jul-2017
 */
module lazyJSON {
  export function lazyJSON(json:string) {
    try {
      return JSON.parse(json);
    } catch (err) {
      return json;
    }
  }

  export function setProperties(props:any, obj:any) {
    if (typeof props !== "object") return;
    if (typeof obj !== "object") return;
    for (var key in props) {
      var val = lazyJSON(props[key]);
      if (typeof obj[key] === "function") {
        if (!(val instanceof Array)) val = [val];
        obj[key].apply(obj, val);
      } else if (obj[key] instanceof Vector2) {
        if (val instanceof Array) {
          obj[key].set.apply(obj[key], val);
        } else {
          obj[key].copyFrom(val);
        }
      } else {
        obj[key] = val;
      }
    }
  }


  /*
    _privates
  */
  var
    _updateTO:any,
    _lastState:any = {},
    _suspended:string[],
    _;

}
export = lazyJSON;
