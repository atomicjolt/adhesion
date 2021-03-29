import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'GET_ANNOTATION',
  'GET_ANNOTATIONS',
  'ADD_ANNOTATION',
  'EDIT_ANNOTATION',
  'DELETE_ANNOTATION',
];

export const Constants = wrapper(actions, requests);

export const getAnnotation = (documentId, annotationId) => ({
  method: Network.GET,
  type: Constants.GET_ANNOTATION,
  url: `/api/annotations/${annotationId}`,
  params: { document_id: documentId, id: annotationId }
});

export const getAnnotations = (documentId, pageNumber) => ({
  method: Network.GET,
  type: Constants.GET_ANNOTATIONS,
  url: '/api/annotations',
  params: { document_id: documentId, page: pageNumber }
});

export const addAnnotation = (documentId, pageNumber, annotation) => ({
  method: Network.POST,
  type: Constants.ADD_ANNOTATION,
  url: '/api/annotations',
  params: { document_id: documentId, page: pageNumber, annotation: JSON.stringify(annotation) }
});

export const editAnnotation = (documentId, pageNumber, annotation) => ({
  method: Network.PUT,
  type: Constants.EDIT_ANNOTATION,
  url: `/api/annotations/${annotation.id}`,
  params: { document_id: documentId, page: pageNumber, annotation: JSON.stringify(annotation) }
});

export const deleteAnnotation = (documentId, annotationId) => ({
  method: Network.DEL,
  type: Constants.DELETE_ANNOTATION,
  url: `/api/annotations/${annotationId}`,
  params: { document_id: documentId, id: annotationId }
});
