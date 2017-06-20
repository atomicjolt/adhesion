import React from 'react';
import TestUtils from 'react-addons-test-utils';
import _ from 'lodash';
import Stub from '../../../../specs_support/stub';
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

      result = TestUtils.renderIntoDocument(
        <Stub>
          <Chart {...props} />
        </Stub>
      );
    });

    it('renders a single chart', () => {
      const div = TestUtils.findRenderedDOMComponentWithClass(result, 'recharts-wrapper');
      expect(_.size(div)).toBe(1);
    });
  });
});
