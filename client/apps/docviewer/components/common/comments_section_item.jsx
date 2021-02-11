import React from 'react';
import PDFJSAnnotate from 'pdf-annotate.js';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class CommentsSectionItem extends React.Component {
  constructor() {
    super();
    this.state = {
      content: '',
      reply: false,
    };
  }

  getIcon = (tool) => {
    switch (tool) {
      case 'selection':
        return 'near_me';
      case 'point':
        return 'push_pin';
      case 'highlight':
        return 'border_color';
      case 'textbox':
        return 'title';
      case 'strikeout':
        return 'strikethrough_s';
      case 'drawing':
        return 'brush';
      case 'area':
        return 'highlight_alt';
      default:
        return '';
    }
  }

  handleInputChange = (e) => {
    this.setState({ content: e.target.value });
  }

  handleReply = (annotation) => {
    const { annotationComments } = annotation;
    annotationComments.push({ id: 'temp' });
    this.setState({ reply: true });
  }

  cancelComment = (annotation) => {
    const { annotationComments } = annotation;
    annotationComments.pop();
    this.setState({
      content: '',
      reply: false,
    });
  }

  handleAddComment = (e, annotation, content) => {
    e.preventDefault();
    this.cancelComment(annotation);
    PDFJSAnnotate.getStoreAdapter().addComment(
      annotation.documentId,
      annotation.id, content
    ).then(() => {
      PDFJSAnnotate.getStoreAdapter().getAnnotations(
        annotation.documentId,
        annotation.page
      );
    });
  }

  handleDeleteComment = (annotation, commentId) => {
    if (commentId === 'temp') {
      this.cancelComment(annotation);
    } else {
      PDFJSAnnotate.getStoreAdapter().deleteComment(
        annotation.documentId,
        commentId
      ).then(() => {
        PDFJSAnnotate.getStoreAdapter().getAnnotations(
          annotation.documentId,
          annotation.page
        );
      });
    }
  }

  renderForm() {
    const { selected, annotation } = this.props;
    const { content, reply } = this.state;
    if (selected) {
      return (
        <form
          className="comment-section_form"
          onSubmit={(e) => this.handleAddComment(e, annotation, content)}
        >
          {reply &&
            <input
              type="text"
              className="comment-section_reply-input"
              onChange={this.handleInputChange}
              placeholder="Leave a reply"
            />
          }
          {!reply &&
            <button
              type="submit"
              className="comments-section_reply-button"
              onClick={() => this.handleReply(annotation)}
            >
              <span>Reply</span>
            </button>}
        </form>
      );
    }
    return null;
  }

  renderComments() {
    const { annotation, selected, currentUserName } = this.props;
    const { annotationComments } = annotation;
    return (
      <>
        { annotationComments &&
        <ul>
          { annotationComments.map((comment, i) => (
            <li
              key={`comments-section-item_comment-${comment.id}`}
              className={`${comment.id === 'temp' || (!selected && i === annotationComments.length - 1) ? 'no-bottom-border' : ''}`}
            >
              <div className="user-container">
                <span className="comments-section_comment-user">
                  {comment.user ? comment.user.name : currentUserName}
                </span>
                { selected &&
                  <button
                    type="button"
                    className="comments-section_delete-button"
                    onClick={() => this.handleDeleteComment(annotation, comment.id)}
                  >
                    <i className="material-icons" aria-hidden>
                      delete_outline
                    </i>
                  </button> }
              </div>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>}
      </>
    );
  }

  render() {
    const {
      annotation,
      handleCommentItemSelection,
    } = this.props;

    return (
      <li
        className="comments-section_item"
        onClick={() => handleCommentItemSelection(annotation)}
        aria-hidden
      >
        <div
          style={{ backgroundColor: `#${annotation.color}` }}
          className="comments-section_tool-type"
        >
          <i
            className="material-icons comments-section_icon"
            aria-hidden
          >
            {this.getIcon(annotation.type)}
          </i>
        </div>
        <div
          className="comments-section-item_comment-container"
        >
          { this.renderComments() }
          { this.renderForm() }
        </div>
      </li>
    );
  }
}

const select = (state) => ({
  currentUserName: state.settings.lis_person_name_full,
});

CommentsSectionItem.propTypes = {
  annotation: PropTypes.object,
  selected: PropTypes.bool,
  handleCommentItemSelection: PropTypes.func,
};

export default connect(
  select,
)(CommentsSectionItem);
