import PDFJSAnnotate from 'pdf-annotate.js';
import * as annotationActions from '../actions/annotations';
import * as commentActions from '../actions/comments';
import * as applicationActions from '../actions/application';
import storeProvider from '../store/store_provider';

export default class MyAdapter extends PDFJSAnnotate.StoreAdapter {
  constructor() {
    const store = storeProvider.getStore();
    super({
      getAnnotation(documentId, annotationId) {
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
        // store.dispatch(annotationActions.getAnnotations(documentId, pageNumber));
        store.dispatch(applicationActions.postDocument('https://atomicjolt.instructure.com/courses/4367/assignments/68573/submissions/7367?download=497638&inline=1'));
        debugger;
        let curAnnotations;
        return new Promise((resolve, reject) => {
          store.subscribe(() => {
            const prevAnnotations = curAnnotations;
            const { annotations, errors } = store.getState().annotations;
            curAnnotations = annotations;
            if (curAnnotations !== null && prevAnnotations) {
              resolve({ documentId, pageNumber, annotations });
            } else if (errors) {
              reject(errors);
            }
          });
        });
      },

      addAnnotation(documentId, pageNumber, annotationJSON) {
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

      getComments(documentId, annotationId) {
        store.dispatch(commentActions.getComments(documentId, annotationId));
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
