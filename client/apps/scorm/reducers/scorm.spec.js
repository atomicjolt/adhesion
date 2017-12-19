/* global describe beforeEach it expect */

import reducer from './scorm';
import { Constants } from '../actions/scorm';

describe('scorm reducer', () => {
  let state;
  let action;

  beforeEach(() => {
    state = undefined;
    action = {};
  });

  it('should return the initail state', () => {
    state = reducer(state, action);
    expect(state.scormList).toBeDefined();
    expect(state.shouldRefreshList).toBeDefined();
  });

  it('should handle LOAD_PACKAGES_DONE', () => {
    action.type = Constants.LOAD_PACKAGES_DONE;
    action.payload = {
      response: [
        { index: 0, text: 'thing1' },
        { index: 1, text: 'thing2' },
        { index: 2, text: 'thing3' },
      ],
    };
    state = reducer(state, action);
    expect(state.scormList.length).toEqual(3);
    expect(state.scormList[0].text).toEqual('thing1');
    expect(state.scormList[1].text).toEqual('thing2');
    expect(state.scormList[2].text).toEqual('thing3');
    expect(state.shouldRefreshList).toBeFalsy();
    expect(state.file).toBe(null);
  });

  it('should handle UPLOAD_PACKAGE', () => {
    action.type = Constants.UPLOAD_PACKAGE;
    let file;
    action.upload = { file };
    const newState = reducer(state, action);
    expect(newState.file).toBeDefined();
  });

  it('should handle CREATE_SCORM_COURSE_DONE with an error', () => {
    action.type = Constants.CREATE_SCORM_COURSE_DONE;
    action.original = { upload: 'originalFile' };
    action.error = {};
    action.error.message = 'Danger, Will Robinson! Danger!';
    const newState = reducer(state, action);
    expect(newState.errorText).toBe('Danger, Will Robinson! Danger!');
  });

  it('should handle CREATE_SCORM_COURSE_DONE without an error', () => {
    action.type = Constants.CREATE_SCORM_COURSE_DONE;
    action.error = false;
    action.original = { upload: 'originalFile' };
    action.payload = {};
    action.payload.scorm_course_id = 123;
    const newState = reducer(state, action);
    expect(newState.shouldPollStatus).toBeTruthy();
  });

  it('should handle UPDATE_UPLOAD_FILE', () => {
    action.type = Constants.UPDATE_UPLOAD_FILE;
    action.file = 'IMASPEC';
    const newState = reducer(state, action);
    expect(newState.file).toBe('IMASPEC');
  });

  it('should handle REMOVE_ERROR', () => {
    action.type = Constants.REMOVE_ERROR;
    const newState = reducer(state, action);
    expect(newState.file).toBe(null);
    expect(newState.uploadError).toBeFalsy();
  });

  it('should return default', () => {
    const oldState = { val: 'something' };
    action.type = Constants.default;
    const newState = reducer(oldState, action);
    expect(newState).toEqual(oldState);
  });
});
