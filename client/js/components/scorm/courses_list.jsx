"use strict";

import React        from 'react';
import Course       from './course';

export default (props) => {
  var items;
  if(props.list) {
    items = props.list.map((item, key)=>{
      const itemProps = {
        course: item,
        // userId: props.userId,
        // lmsCourseId: props.lmsCourseId,
        // loadLaunchUrl: props.loadLaunchUrl,
        removePackage: props.removePackage,
        previewPackage: props.previewPackage,
        importPackage: props.importPackage,
        // assignmentParams: props.assignmentParams
      };

      return <Course key={key+"PackageItem"} {...itemProps} />;
    });
  }

  return (
    <div>
      <ul className="c-list">
        {items}
      </ul>
    </div>
  );
};
