import React from 'react';
import { shallow } from 'enzyme';
import CourseList from './courses_list';

describe('courses list', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      courseId: 'id',
      importPackage: () => {},
      previewPackage: () => {},
      removePackage: () => {},
      replacePackage: () => {},
      updateImportType: () => {},
      canvasUrl: 'salad.com',
      list: [
        { title: 'IMAPSEC', id: 'id' },
      ],
      hideModal: () => {},
      showModal: () => {},
      publishPackage: () => {},
      canvasList: {},
    };
    result = shallow(<CourseList {...props} />);
  });

  it('renders list of items from props', () => {
    const ul = result.find('.c-list');
    expect(ul.length).toBe(1);
  });

  it('verifies number of items in the list', () => {
    let list = result.find('Course');
    expect(list.length).toBe(1);
    props.list = [{ id: 'id' }, { id: 'id' }, { id: 'id' }];
    result = shallow(<CourseList {...props} />);
    list = result.find('Course');
    expect(list.length).toBe(3);
  });
});
