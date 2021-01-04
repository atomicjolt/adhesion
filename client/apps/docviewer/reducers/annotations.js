import _ from 'lodash';
import { Constants } from '../actions/annotations';

const defaultState = {
  error: null,
  annotation: null,
  annotations: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case Constants.GET_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.annotation = action.payload;
      }
      return newState;
    }
    case Constants.GET_ANNOTATIONS_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error.message;
      } else {
        _.forEach(action.payload, (annotation) => {
          const currentAnnotation = annotation;
          currentAnnotation.type = delete currentAnnotation.annotation_type;
          newState.annotations.push(annotation);
        });
      }
      return newState;
    }
    case Constants.ADD_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.annotation = action.payload;
      }
      return newState;
    }
    case Constants.EDIT_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.errors) {
        newState.errors = action.errors;
      } else {
        newState.annotation = action.payload;
      }
      return newState;
    }
    case Constants.DELETE_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.errors) {
        newState.errors = action.errors;
      } else {
        newState.annotation = true;
      }
      return newState;
    }

    default:
      return state;
  }
};
