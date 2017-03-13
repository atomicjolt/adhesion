import React                from 'react';
import { hashHistory }      from 'react-router';

export default function Header(props) {
  return (
    <header className="c-aa-head">
      <a
        className="c-aa-back-btn"
        onClick={() => hashHistory.push('/')}>
        <i className="material-icons">arrow_back</i>
      </a>
      <h1 className="c-aa-title">{props.title} Analytics</h1>
    </header>
  );
}
