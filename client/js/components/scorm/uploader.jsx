"use strict";

import React                    from 'react';
import { connect }              from 'react-redux';
import CoursesList              from './courses_list';
import * as ScormActions        from '../../actions/scorm';

const select = (state, props) => {
  return {
    scormFile: state.scorm.file
  };
};

@connect(select, null, null, { withRefs: true })
export default class Uploader extends React.Component {
    constructor(props) {
        super(props);

        
    }

    componentWillReceiveProps(nextProps){

    }

    render() {
        return (
            <ul className="c-upload">
                <li className="c-list__upload">
                    <svg className="c-icon-upload" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                    <path d="M0 0h48v48h-48z" fill="none"/>
                    <path className="c-path" d="M38.71 20.07c-1.36-6.88-7.43-12.07-14.71-12.07-5.78 0-10.79 3.28-13.3 8.07-6.01.65-10.7 5.74-10.7 11.93 0 6.63 5.37 12 12 12h26c5.52 0 10-4.48 10-10 0-5.28-4.11-9.56-9.29-9.93zm-10.71 5.93v8h-8v-8h-6l10-10 10 10h-6z"/>
                    </svg>
                    <div className="c-list-item__title">RuntimeBasicCalls_SCORM20043rdEdition.zip</div>
                    <div className="c-upload-error">
                    <svg className="c-icon-error" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                        <path d="M0 0h48v48h-48z" fill="none"/>
                        <path className="c-path" d="M24 4c-11.04 0-20 8.95-20 20s8.96 20 20 20 20-8.95 20-20-8.96-20-20-20zm2 30h-4v-4h4v4zm0-8h-4v-12h4v12z"/>
                    </svg>
                    <span>This file is not a valid SCORM package.</span>
                    </div>
                    <div className="c-progress-bar red">
                    <span style={{width: "25%"}}></span>
                    </div>
                    <button className="c-icon-btn">
                    <svg className="c-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                        <path d="M0 0h48v48h-48z" fill="none"/>
                        <path className="c-path" d="M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z"/>
                    </svg>
                    </button>
                </li>
            </ul>
        )
    }

}