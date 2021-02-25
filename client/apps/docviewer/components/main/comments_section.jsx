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
      UI.addEventListener('annotation:delete', this.handleAnnotationDelete);
      UI.addEventListener('document:click', this.handleDocumentClick);
    }
  }

  setUserPermissions = (selection) => {
    const { UI, settings } = this.props;
    const { lms_user_id: currentUserId } = settings;
    const { lms_user_id: selectionUserId } = selection.user;
    if (selectionUserId === currentUserId) {
      UI.setUser(true);
    } else {
      UI.setUser(false);
    }
  }

  handleDocumentClick = () => {
    const { handleSelection } = this.props;
    this.setState({ selectedAnnotation: null });
    handleSelection(false);
  }

  handleAnnotationSelection = (selection) => {
    const { allAnnotations, handleSelection } = this.props;
    const id = parseInt(selection.getAttribute('data-pdf-annotate-id'), 10);

    // Move to last item in array if there are no previous comments
    if (id) {
      const annotation = _.find(allAnnotations, { id });
      if (annotation) {
        this.setUserPermissions(annotation);
        if (annotation.annotationComments.length === 0) {
          const index = _.indexOf(allAnnotations, annotation);
          allAnnotations.push(allAnnotations.splice(index, 1)[0]);
          this.setState({ selectedAnnotation: id }, () => {
            handleSelection(true);
          });
        }
      } else {
        this.setState({ selectedAnnotation: id }, () => {
          handleSelection(true);
        });
      }
    }
  }

  handleAnnotationDelete = () => {
    const { handleRerender } = this.props;
    handleRerender();
  }

  handleCommentItemSelection = (selection) => {
    const { UI } = this.props;
    this.setState({ selectedAnnotation: selection.id });
    this.setUserPermissions(selection);
    UI.setEdit(selection);
  }

  render() {
    const {
      allAnnotations,
      showSecondary,
      hasComments
    } = this.props;
    const { selectedAnnotation } = this.state;

    if (hasComments || selectedAnnotation) {
      return (
        <React.Fragment>
          <div className={`comments-section ${showSecondary ? 'lowered' : ''}`}>
            <ol className="comments-section_list">
              {
                _.map(allAnnotations, (annotation) => {
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
                        selected
                        annotation={annotation}
                        handleCommentItemSelection={this.handleCommentItemSelection}
                        showReply={false}
                      />
                    );
                  }
                  return null;
                })
              }
            </ol>
          </div>
        </React.Fragment>
      );
    }
    return null;
  }
}

CommentsSection.propTypes = {
  UI: PropTypes.object,
  showSecondary: PropTypes.bool,
  hasComments: PropTypes.bool,
  handleSelection: PropTypes.func,
  handleRerender: PropTypes.func,
  settings: PropTypes.object,
};

const select = state => ({
  allAnnotations: state.annotations.allAnnotations,
  settings: state.settings,
});

export default connect(
  select,
)(CommentsSection);
