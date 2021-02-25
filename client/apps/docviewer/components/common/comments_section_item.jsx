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

  handleReply = () => {
    this.setState({ reply: true });
  }

  cancelComment = () => {
    this.setState({
      content: '',
      reply: false,
    });
  }

  handleAddComment = (e, annotation, content) => {
    e.preventDefault();
    this.cancelComment();
    PDFJSAnnotate.getStoreAdapter().addComment(
      annotation.documentId,
      annotation.id,
      content
    ).then(() => {
      PDFJSAnnotate.getStoreAdapter().getAnnotations(
        annotation.documentId,
        annotation.page
      );
    });
  }

  handleDeleteComment = (annotation, comment) => {
    if (!comment) {
      this.cancelComment();
    } else {
      PDFJSAnnotate.getStoreAdapter().deleteComment(
        annotation.documentId,
        comment.id
      ).then(() => {
        PDFJSAnnotate.getStoreAdapter().getAnnotations(
          annotation.documentId,
          annotation.page
        );
      });
    }
  }

  renderUser(comment) {
    const { annotation, selected, currentUserName } = this.props;
    return (
      <div className="user-container">
        <span className="comments-section_comment-user">
          { (comment && comment.user) ? comment.user.name : currentUserName }
        </span>
        { selected && (
          <button
            type="button"
            className="comments-section_delete-button"
            onClick={() => this.handleDeleteComment(annotation, comment)}
          >
            <i className="material-icons" aria-hidden>
              delete_outline
            </i>
          </button>)}
      </div>
    );
  }

  renderReply() {
    return (
      <li>
        <div className="flex-right">
          <button
            type="button"
            className="comments-section_reply-button"
            onClick={() => this.handleReply()}
          >
            <span>Reply</span>
          </button>
        </div>
      </li>
    );
  }

  renderForm() {
    const { annotation } = this.props;
    const { content } = this.state;
    const { annotationComments } = annotation;
    return (
      <li>
        { this.renderUser() }
        <form
          className="comment-section_form"
          onSubmit={e => this.handleAddComment(e, annotation, content)}
        >
          <input
            type="text"
            className="comment-section_reply-input"
            onChange={this.handleInputChange}
            placeholder={annotationComments.length ? 'Leave a reply' : 'Leave a comment'}
          />
        </form>
      </li>
    );
  }

  renderCommentsList() {
    const { annotation, selected } = this.props;
    const { reply } = this.state;
    const { annotationComments } = annotation;
    return (
      <React.Fragment>
        <ul>
          { annotationComments.map(comment => (
            <li
              key={`comments-section-item_comment-${comment.id}`}
            >
              { this.renderUser(comment) }
              { comment.content && <p>{comment.content}</p> }
            </li>
          ))}
          { (selected && annotationComments.length && !reply) ? this.renderReply() : null }
          { (selected && annotationComments.length && reply) ? this.renderForm() : null }
          { selected && !annotationComments.length && this.renderForm() }
        </ul>
      </React.Fragment>
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
          { this.renderCommentsList() }
        </div>
      </li>
    );
  }
}

const select = state => ({
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
