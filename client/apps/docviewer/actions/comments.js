import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'ADD_COMMENT',
  'DELETE_COMMENT',
];

export const Constants = wrapper(actions, requests);

export const addComment = (documentId, annotationId, content) => ({
  method: Network.POST,
  type: Constants.ADD_COMMENT,
  url: '/api/annotation_comments',
  params: { document_id: documentId, annotation_id: annotationId, content }
});

export const deleteComment = (documentId, commentId) => ({
  method: Network.DEL,
  type: Constants.DELETE_COMMENT,
  url: `/api/annotation_comments/${commentId}`,
  params: { document_id: documentId, id: commentId }
});
