import React from 'react';
import { shallow } from 'enzyme';
import ChartContainer from './chart_container';

describe('Scorm Analytics ChartContainer', () => {

  let result;
  let props;
  describe('passed charts', () => {
    beforeEach(() => {
      props = {
        selected: 'passed',
        data: {
          passFail: [],
        },
      };

      result = shallow(<ChartContainer {...props} />);
    });

    it('matches the snapshot', () => {
      expect(result).toMatchSnapshot();
    });

    it('renders a single chart', () => {
      expect(result.find('Chart').length).toBe(1);
    });
  });

  describe('completed charts', () => {
    beforeEach(() => {
      props = {
        selected: 'complete',
        data: {
          completed: [],
        },
      };

      result = shallow(<ChartContainer {...props} />);
    });

    it('renders a single chart', () => {
      expect(result.find('Chart').length).toBe(1);
    });
  });
});
