import React from 'react';
import { shallow } from 'enzyme';
import Chart from './pie_chart';

describe('Scorm Analytics Chart', () => {

  let result;
  let props;
  describe('pie chart', () => {
    beforeEach(() => {
      props = {
        data: [],
        colors: [],
      };

      result = shallow(<Chart {...props} />);
    });

    it('matches the snapshot', () => {
      expect(result).toMatchSnapshot();
    });
  });
});
