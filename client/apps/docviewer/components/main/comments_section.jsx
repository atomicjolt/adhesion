import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import CommentsSectionItem from '../common/comments_section_item';

export class CommentsSection extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedAnnotation: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { UI } = this.props;
    if (UI !== prevProps.UI) {
      UI.addEventListener('annotation:click', this.handleAnnotationSelection);
      UI.addEventListener('document:click', this.handleDocumentClick);
    }
  }
  handleDocumentClick = (e) => {
    this.setState({ selectedAnnotation: null });
  }

  handleAnnotationSelection = (selection) => {
    const { annotations } = this.props;
    const id = parseInt(selection.getAttribute('data-pdf-annotate-id'), 10);

    // Move to last item in array if there are no previous comments
    if (id) {
      const annotation = _.find(annotations, {id: id});
      if (annotation && annotation.annotationComments.length == 0) {
        let index = _.indexOf(annotations, annotation);
        annotations.push(annotations.splice(index, 1)[0]);
        this.setState({ selectedAnnotation: id });
      }
    }
  }

  handleCommentItemSelection = (selection) => {
    const { UI } = this.props;
    this.setState({ selectedAnnotation: selection.id });
    UI.setEdit(selection);
  }

  initialComments() {
    const { annotations } = this.props;
    let comments = false;
    _.forEach(annotations, (annotation) => {
      if (annotation.annotationComments.length) {
        comments = true;
        return false;
      }
    });
    return comments;
  }

  render() {
    const { annotations, showSecondary, currentUserName } = this.props;
    const { selectedAnnotation } = this.state;

    return (
      <>
        { (this.initialComments() || selectedAnnotation)  &&
          <div className={`comments-section ${showSecondary ? 'lowered' : ''}`}>
            <ol className="comments-section_list">
              {
                _.map(annotations, (annotation, i) => {
                  if (annotation.annotationComments.length > 0) {
                    return (
                      <CommentsSectionItem
                        key={`annotation_section_item_${annotation.id}`}
                        selected={annotation.id === selectedAnnotation}
                        annotation={annotation}
                        handleCommentItemSelection={this.handleCommentItemSelection}
                        currentUserName
                      />
                    );
                  }
                  if (annotation.id === selectedAnnotation) {
                    return (
                      <CommentsSectionItem
                        key={`annotation_section_item_${annotation.id}`}
                        selected={annotation.id === selectedAnnotation}
                        annotation={annotation}
                        handleCommentItemSelection={this.handleCommentItemSelection}
                        currentUserName
                      />
                    );
                  }
                })
              }
            </ol>
        </div>}
      </>
    );
  }
}

CommentsSection.propTypes = {
  UI: PropTypes.object,
  showSecondary: PropTypes.bool,
};

const select = (state) => ({
  annotations: state.annotations.annotations,
});

export default connect(
  select,
)(CommentsSection);
