import PDFJSAnnotate from 'pdf-annotate.js';
import * as annotationActions from '../../actions/annotations';
import * as commentActions from '../../actions/comments';
import store from '../../app';

export default class MyAdapter extends PDFJSAnnotate.StoreAdapter {
  constructor() {
    super({
      getAnnotation(documentId, annotationId) {
        console.log(`getAnnotation => documentId: ${documentId}, annotationId: ${annotationId}`);
        store.dispatch(annotationActions.getAnnotation(documentId, annotationId));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { annotation, error } = store.getState().annotations;
            if (annotation) {
              resolve(annotation);
            } else {
              reject(error);
            }
          });
        });
      },
      getAnnotations(documentId, pageNumber) {
        console.log(`getAnnotations => documentId: ${documentId}, pageNumber: ${pageNumber}`);
        // store.dispatch(annotationActions.getAnnotations(2, 1));
        store.dispatch(annotationActions.getAnnotations(documentId, pageNumber));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { annotations, error } = store.getState().annotations;
            if (annotations) {
              console.log("getAnnotation => annotations: ", annotations);
              resolve({ documentId, pageNumber, annotations });
            } else {
              reject(error);
            }
          });
        });
      },

      addAnnotation(documentId, pageNumber, annotationJSON) {
        console.log(`addAnnotation => documentId: ${documentId}, pageNumber: ${pageNumber} annotationJSON: ${annotationJSON}`);
        store.dispatch(annotationActions.addAnnotation(documentId, pageNumber, annotationJSON));
        // store.dispatch(annotationActions.addAnnotation(2, 1, annotationJSON));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { annotation, error } = store.getState().annotations;
            if (annotation) {
              resolve(annotation);
            } else {
              reject(error);
            }
          });
        });
      },

      editAnnotation(documentId, pageNumber, annotationJSON) {
        console.log(`editAnnotation => documentId: ${documentId}, pageNumber: ${pageNumber} annotationJSON: ${annotationJSON}`);
        store.dispatch(annotationActions.editAnnotation(documentId, pageNumber, annotationJSON));
        // store.dispatch(annotationActions.editAnnotation(2, 1, annotationJSON));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { annotation, error } = store.getState().annotations;
            if (annotation) {
              resolve(annotation);
            } else {
              reject(error);
            }
          });
        });
      },

      deleteAnnotation(documentId, annotationId) {
        console.log(`deleteAnnotation => documentId: ${documentId}, annotationId: ${annotationId}`);
        store.dispatch(annotationActions.deleteAnnotation(documentId, annotationId));
        // store.dispatch(annotationActions.deleteAnnotation(2, annotationId));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { annotation, error } = store.getState().annotations;
            // annotation is true if destroyed
            if (annotation) {
              resolve(annotation);
            } else {
              reject(error);
            }
          });
        });
      },

      getComments(documentId, annotationId) {
        console.log("getComments");
        store.dispatch(commentActions.addComment(documentId, annotationId));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { comments, error } = store.getState().comments;
            if (comments) {
              resolve({ documentId, annotationId, comments });
            } else {
              reject(error);
            }
          });
        });
      },

      addComment(documentId, annotationId, content) {
        console.log("addComment");
        store.dispatch(commentActions.addComment(documentId, annotationId, content));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { comment, error } = store.getState().comments;
            if (comment) {
              resolve(comment);
            } else {
              reject(error);
            }
          });
        });
      },

      deleteComment(documentId, commentId) {
        console.log("deleteComment");
        store.dispatch(commentActions.deleteComment(documentId, commentId));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { comment, error } = store.getState().comments;
            if (comment) {
              resolve(comment);
            } else {
              reject(error);
            }
          });
        });
      }

    });
  }
}
