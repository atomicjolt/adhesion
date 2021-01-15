import React from 'react';
import MyAdapter from './my_adapter'

describe('Adapter', () => {
  const adapter = new MyAdapter();
  it('Gets all annotations for the document', () => {
    let result;
    this.adapter.getAnnotations(documentId, pageNumber).then((data) => {
      console.log("data: ", data);
      result = data;
    }, (error) => {
      console.log("error: ", error);
      result = error;
    });
    expect(result.length).toBe(2);
  });
});
