"use strict";

import React from 'react';

export default (props)=>{

  const d = {
    gradedAssignment: "M28 4h-16c-2.21 0-3.98 1.79-3.98 4l-.02 32c0 2.21 1.77 4 3.98 4h24.02c2.21 0 4-1.79 4-4v-24l-12-12zm4 32h-16v-4h16v4zm0-8h-16v-4h16v4zm-6-10v-11l11 11h-11z",
    delete: "M12 38c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4v-24h-24v24zm26-30h-7l-2-2h-10l-2 2h-7v4h28v-4z",
    preview: "M24 9C14 9 5.46 15.22 2 24c3.46 8.78 12 15 22 15s18.54-6.22 22-15C42.54 15.22 34.01 9 24 9zm0 25c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10zm0-16c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z",
    error: "M24 4c-11.04 0-20 8.95-20 20s8.96 20 20 20 20-8.95 20-20-8.96-20-20-20zm2 30h-4v-4h4v4zm0-8h-4v-12h4v12z",
    removeError: "M29.17 16l-5.17 5.17-5.17-5.17-2.83 2.83 5.17 5.17-5.17 5.17 2.83 2.83 5.17-5.17 5.17 5.17 2.83-2.83-5.17-5.17 5.17-5.17-2.83-2.83zm-5.17-12c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm0 36c-8.82 0-16-7.18-16-16s7.18-16 16-16 16 7.18 16 16-7.18 16-16 16z",
    drop: "M14 20l10 10 10-10z",
    upload: "M38.71 20.07c-1.36-6.88-7.43-12.07-14.71-12.07-5.78 0-10.79 3.28-13.3 8.07-6.01.65-10.7 5.74-10.7 11.93 0 6.63 5.37 12 12 12h26c5.52 0 10-4.48 10-10 0-5.28-4.11-9.56-9.29-9.93zm-10.71 5.93v8h-8v-8h-6l10-10 10 10h-6z",
    previous: "M14 20l10 10 10-10z",
    next: "M14 20l10 10 10-10z",
    date: "M34 24h-10v10h10v-10zm-2-22v4h-16v-4h-4v4h-2c-2.21 0-3.98 1.79-3.98 4l-.02 28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4v-28c0-2.21-1.79-4-4-4h-2v-4h-4zm6 36h-28v-22h28v22z"
  };
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <path className="c-path" d={d[props.type]}/>
      <path d="M0 0h48v48h-48z" fill="none"/>
    </svg>
  );
};
