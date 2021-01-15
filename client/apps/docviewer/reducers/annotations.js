import _ from 'lodash';
import { Constants } from '../actions/annotations';

const defaultState = {
  error: null,
  annotation: null,
  annotations: [],
};

function formatAnnotationFeilds(annotation) {
  const formattedAnnotation = { ...annotation };
  formattedAnnotation.type = annotation.annotation_type;
  formattedAnnotation.documentId = annotation.document_id;
  delete formattedAnnotation.annotation_type;
  delete formattedAnnotation.document_id;
  return formattedAnnotation;
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Constants.GET_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        const annotation = action.payload;
        newState.annotation = formatAnnotationFeilds(annotation);
      }
      return newState;
    }
    case Constants.GET_ANNOTATIONS_DONE: {
      const newState = _.cloneDeep(state);
      newState.annotations = [];
      if (action.error) {
        newState.error = action.error.message;
      } else {
        _.forEach(action.payload, (annotation) => {
          newState.annotations.push(formatAnnotationFeilds(annotation));
        });
      }
      return newState;
    }
    case Constants.ADD_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        const annotation = action.payload;
        newState.annotation = formatAnnotationFeilds(annotation);
      }
      return newState;
    }
    case Constants.EDIT_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.errors) {
        newState.errors = action.errors;
      } else {
        const annotation = action.payload;
        newState.annotation = formatAnnotationFeilds(annotation);
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
}
