import _ from 'lodash';
import { Constants } from '../actions/annotations';

const defaultState = {
  error: null,
  annotation: null,
  annotations: [],
  allAnnotations: []
};
function formatCommentFeilds(comment) {
  const formattedComment = { ...comment };
  formattedComment.annotationId = comment.annotation_id;
  formattedComment.documentId = comment.document_id;
  delete formattedComment.annotation_id;
  delete formattedComment.document_id;
  return formattedComment;
}

function formatAnnotationFeilds(annotation) {
  const formattedAnnotation = { ...annotation };
  formattedAnnotation.type = annotation.annotation_type;
  formattedAnnotation.documentId = annotation.document_id;
  formattedAnnotation.annotationComments = [];
  if (formattedAnnotation.annotation_comments) {
    _.forEach(formattedAnnotation.annotation_comments, (comment) => {
      formattedAnnotation.annotationComments.push(formatCommentFeilds(comment));
    });
  }
  delete formattedAnnotation.annotation_type;
  delete formattedAnnotation.document_id;
  delete formattedAnnotation.annotation_comments;
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
      newState.allAnnotations = [];
      if (action.error) {
        newState.error = action.error.message;
      } else {
        _.forEach(action.payload, (annotation) => {
          const formattedAnnotation = formatAnnotationFeilds(annotation);
          if (annotation.page === action.original.params.page) {
            newState.annotations.push(formattedAnnotation);
          }
          newState.allAnnotations.push(formattedAnnotation);
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
      if (action.error) {
        newState.error = action.error;
      } else {
        const annotation = action.payload;
        newState.annotation = formatAnnotationFeilds(annotation);
      }
      return newState;
    }
    case Constants.DELETE_ANNOTATION_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.annotation = true;
      }
      return newState;
    }

    default:
      return state;
  }
};