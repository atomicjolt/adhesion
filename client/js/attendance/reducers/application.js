"use strict";

import {Constants as ApplicationConstants} from '../actions/application';

const initialState = () => {
  const date = new Date();
  date.setHours(0,0,0,0); // Zero out time field
  return {date};
};

export default (state = initialState(), action) => {
  switch(action.type){
    case ApplicationConstants.CHANGE_DATE:
      let newState = {date: action.date};
      state = {...state, ...newState};
      break;
  }
  return state;
};
