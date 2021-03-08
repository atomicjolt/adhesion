import _ from 'lodash';
import { Constants } from '../actions/comments';

const defaultState = {
  error: null,
  comment: null,
  comments: [],
};

function formatCommentFeilds(comment) {
  const formattedComment = { ...comment };
  formattedComment.documentId = comment.document_id;
  delete formattedComment.document_id;
  return formattedComment;
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case Constants.GET_COMMENTS_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        _.forEach(action.payload, (comment) => {
          newState.comments.push(formatCommentFeilds(comment));
        });
      }
      return newState;
    }
    case Constants.ADD_COMMENT_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.comment = formatCommentFeilds(action.payload);
      }
      return newState;
    }
    case Constants.DELETE_COMMENT_DONE: {
      const newState = _.cloneDeep(state);
      if (action.error) {
        newState.error = action.error;
      } else {
        newState.comment = true;
      }
      return newState;
    }
    default:
      return state;
  }
};
