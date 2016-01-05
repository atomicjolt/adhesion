"use strict";

import _                      from "lodash";
import Immutable              from "immutable";
import CanvasConstants            from "../../constants/canvas";
import ErrorTypes             from "../../constants/error";
import assignment_group       from "./assignment_group";


fdescribe("canvas assignment_group reducer", () => {

    it("has no groups", () => {
      const state = assignment_group(undefined, {});
      expect(state.getIn(['assignment_group', 0])).toEqual(undefined);
    });


    it("Adds new group", () => {
      const initialState = Immutable.fromJS({});
      const action = {
        type: CanvasConstants.COURSE_ASSIGNMENT_GROUPS_DONE,
        payload: [{
          id: 11,
          name: "Group13"
        },
        {
          id: 2,
          name: "Group15"
        }]
      }
      const state = assignment_group(initialState, action);
      expect(state.getIn([11, 'name'])).toBe("Group13");
      expect(state.getIn([2, 'name'])).toBe("Group15");
    });


    it("Adds new single group", () => {
      const initialState = Immutable.fromJS({});
      debugger
      const action = {
        type: CanvasConstants.COURSE_ASSIGNMENT_SINGLE_GROUP_DONE,
        payload: [{
          id: 7,
          name: "Group13"
        }]
      }
      const state = assignment_group(initialState, action);
      expect(state.getIn([7, 'id'])).toBe(7);

      console.log(state.toJS().course_assignment_groups[0].name) //returns 'Group13'
    });


    it("Deletes a group", () => {
      const initialState = Immutable.fromJS({});
      debugger
      const action = {
        type: CanvasConstants.COURSE_ASSIGNMENT_SINGLE_GROUP_DEL_DONE,
        payload: [{
          id: 1,
          name: "Group13"
        }]

      }
      const state = assignment_group(initialState, action);
      expect(state.getIn([0,'name'])).toEqual(undefined);
    });


});