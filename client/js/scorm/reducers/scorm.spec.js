/* global describe beforeEach it expect */

import reducer from './scorm'
import { Constants } from '../actions/scorm'

describe('scorm reducer', () => {
  let state, action;

  beforeEach(() => {
    state = undefined;
    action = {};
  })
  it('should return the initail state', () => {
    state = reducer(state, action);
    expect(state.scormList).toBeDefined();
    expect(state.shouldRefreshList).toBeDefined();
  });

  it('should handle LOAD_PACKAGES_DONE', () => {
    action.type = Constants.LOAD_PACKAGES_DONE;
    action.payload = {response: "this is what comes back from the database"};
    state = reducer(state, action);
    expect(state.scormList).toEqual("this is what comes back from the database");
    expect(state.shouldRefreshList).toBeFalsy();
    expect(state.file).toBe(null);
  });

  it('should handle UPLOAD_PACKAGE', () => {
    action.type = Constants.UPLOAD_PACKAGE;
    let file;
    action.upload = { file };
    let newState = reducer(state, action);
    expect(newState.showUploading).toBeTruthy();
    expect(newState.file).toBeDefined();
  });

  it('should handle UPLOAD_PACKAGE_DONE with an error', () => {
    action.type = Constants.UPLOAD_PACKAGE_DONE;
    let upload;
    action.original = { upload: "originalFile" };
    action.error = true;
    let newState = reducer(state, action);
    expect(newState.file).toBe("originalFile")
  });

  it('should handle UPLOAD_PACKAGE_DONE without an error', () => {
    action.type = Constants.UPLOAD_PACKAGE_DONE;
    action.error = false;
    let newState = reducer(state, action);
    expect(newState.shouldRefreshList).toBeTruthy();
  });

  it('should handle UPDATE_UPLOAD_FILE', () => {
    action.type = Constants.UPDATE_UPLOAD_FILE;
    action.file = "IMASPEC";
    let newState = reducer(state, action);
    expect(newState.file).toBe("IMASPEC");
  });

  it('should handle REMOVE_ERROR', () => {
    action.type = Constants.REMOVE_ERROR;
    let newState = reducer(state, action);
    expect(newState.file).toBe(null);
    expect(newState.uploadError).toBeFalsy();
  });

  it('should return default', () => {
    const oldState = { val: 'something' }
    action.type = Constants.default;
    let newState = reducer(oldState, action);
    expect(newState).toEqual(oldState);
  });
});
