"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';

export default class Course extends React.Component {
  handleLaunch(){
    this.props.loadLaunchUrl(this.props.course.id, this.props.studentId);
  }

  handleRemove(){
    const courseId = this.props.course.id;
    this.props.removePackage(courseId);
  }

  render(){
    return (
      <div>
        <a onClick={() => this.handleLaunch()}
           href="#">{this.props.course.title}
        </a>
        <button onClick={() => this.handleRemove()}>Remove</button>
      </div>
    );
  }

}
