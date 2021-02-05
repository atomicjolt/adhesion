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
    }
  }

  handleAnnotationSelection = (selection) => {
    this.setState({ selectedAnnotation: parseInt(selection.getAttribute('data-pdf-annotate-id'), 10) });
  }

  handleCommentItemSelection = (selection) => {
    const { UI } = this.props;
    this.setState({ selectedAnnotation: selection.id });
    UI.setEdit(selection);
  }

  renderSelected(annotation) {
    const { selectedAnnotation } = this.state;
    if (!annotation.annotationComments.length && annotation.id === selectedAnnotation) {
      return (
        <CommentsSectionItem
          key={`annotation_section_item_${annotation.id}`}
          selected
          annotation={annotation}
          handleCommentItemSelection={this.handleCommentItemSelection}
        />
      );
    }
    return null;
  }

  render() {
    const { annotations, showSecondary } = this.props;
    const { selectedAnnotation } = this.state;
    console.log("annotations: ", annotations);
    return (
      <div className={`comments-section ${showSecondary ? 'lowered' : ''}`}>
        <ul className="comments-section_list">
          {
            _.map(annotations, (annotation) => {
              if (annotation.annotationComments.length > 0) {
                return (
                  <CommentsSectionItem
                    key={`annotation_section_item_${annotation.id}`}
                    selected={annotation.id === selectedAnnotation}
                    annotation={annotation}
                    handleCommentItemSelection={this.handleCommentItemSelection}
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
                  />
                );
              }
            })
          }
        </ul>
      </div>
    );
  }
}

CommentsSection.propTypes = {
  UI: PropTypes.object,
  showSecondary: PropTypes.bool,
};

const select = (state) => ({
  annotations: state.annotations.annotations,
  annotation: state.annotations.annotation,
});

export default connect(
  select,
)(CommentsSection);
