import PDFJSAnnotate from 'pdf-annotate.js';
import * as annotationActions from '../../actions/annotations';
import * as commentActions from '../../actions/comments';
import store from '../../app';

export default class MyAdapter extends PDFJSAnnotate.StoreAdapter {
  constructor() {
    super({
      getAnnotation(documentId, annotationId) {
        console.log("getAnnotation");
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
        console.log("getAnnotations");
        store.dispatch(annotationActions.getAnnotations(documentId, pageNumber));
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const { annotations, error } = store.getState().annotations;
            if (annotations) {
              resolve(annotations);
            } else {
              reject(error);
            }
          });
        });
      },

      addAnnotation(documentId, pageNumber, annotationJSON) {
        console.log("addAnnotation");
        store.dispatch(annotationActions.addAnnotation(documentId, pageNumber, annotationJSON));
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
        console.log("editAnnotation");
        store.dispatch(annotationActions.editAnnotation(documentId, pageNumber, annotationJSON));
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
        console.log("deleteAnnotation");
        store.dispatch(annotationActions.deleteAnnotation(documentId, annotationId));
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
