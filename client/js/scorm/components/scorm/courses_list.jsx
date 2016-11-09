"use strict";

import React        from 'react';
import Course       from './course';

export default (props) => {
  let items;
  if(props.list) {
    items = props.list.map((item, key)=>{
      const itemProps = {
        course: item,
        removePackage: props.removePackage,
        previewPackage: props.previewPackage,
        importPackage: props.importPackage
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
