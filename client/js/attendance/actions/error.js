"use strict";

import wrapper    from "../../constants/wrapper";
import Network    from "../../constants/network";

// Local actions
const actions = ["ERROR"];

// Actions that make an api request
const requests = [];

export const Constants = wrapper(actions, requests);

export function showError(value){
  return {
    type:   Constants.ERROR,
    error: value
  };
}
