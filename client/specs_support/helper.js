"use strict";

import _                  from "lodash";

import configureStore     from "../js/store/configure_store";

export default class Helper{

  // Create a fake store for testing
  static mockStore(state) {
    return {
      subscribe: () => {},
      dispatch: () => {},
      getState: () => {
        return {...state};
      }
    };
  }

  // Create a real store that can be used for testing
  static makeStore(settings){
    const initialState = {
      jwt      : "fake_jwt_token",
      settings : _.assign({
                    csrf     : "csrf_token",
                    apiUrl   : "http://www.example.com"
                  }, settings)
    };
    return configureStore(initialState);
  }

  static testPayload(){
    return JSON.stringify([{
      "id":1,
      "name":"Starter App"
    }]);
  }

  static stubAjax(){

    beforeEach(function(){
      jasmine.Ajax.install();

      jasmine.Ajax.stubRequest(
          RegExp('.*/api/test')
        ).andReturn({
          "status": 200,
          "contentType": "json",
          "statusText": "OK",
          "responseText": Helper.testPayload()
        });

      jasmine.Ajax.stubRequest(
          RegExp('.*/api/test/.+')
        ).andReturn({
          "status": 200,
          "contentType": "json",
          "statusText": "OK",
          "responseText": Helper.testPayload()
        });

    });

    afterEach(function(){
      jasmine.Ajax.uninstall();
    });
  }

  static mockClock(){

    beforeEach(function(){
      jasmine.clock().install(); // Mock out the built in timers
    });

    afterEach(function(){
      jasmine.clock().uninstall();
    });

  }

}
