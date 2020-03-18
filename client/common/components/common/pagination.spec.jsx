import React from 'react';
import { shallow } from 'enzyme';

import Pagination from './pagination';

describe('Pagination', () => {
  const props = {
    changePageTo: () => {},
    currentPage: 2,
    previousPageAvailable: true,
    nextPageAvailable: true,
  };

  it('renders the pagination UI', () => {
    const result = shallow(<Pagination
      changePageTo={props.changePageTo}
      currentPage={props.currentPage}
      previousPageAvailable={props.previousPageAvailable}
      nextPageAvailable={props.nextPageAvailable}
    />);

    expect(result).toMatchSnapshot();
  });

  describe('when the user clicks the previous button', () => {
    it('navigates to the previous page', () => {
      spyOn(props, 'changePageTo');
      const result = shallow(<Pagination
        changePageTo={props.changePageTo}
        currentPage={props.currentPage}
        previousPageAvailable={props.previousPageAvailable}
        nextPageAvailable={props.nextPageAvailable}
      />);

      const previousButton = result.find('button').first();
      previousButton.simulate('click');

      expect(props.changePageTo).toHaveBeenCalledWith(
        props.currentPage - 1,
      );
    });
  });

  describe('when the user clicks the next button', () => {
    it('navigates to the next page', () => {
      spyOn(props, 'changePageTo');
      const result = shallow(<Pagination
        changePageTo={props.changePageTo}
        currentPage={props.currentPage}
        previousPageAvailable={props.previousPageAvailable}
        nextPageAvailable={props.nextPageAvailable}
      />);

      const nextButton = result.find('button').last();
      nextButton.simulate('click');

      expect(props.changePageTo).toHaveBeenCalledWith(
        props.currentPage + 1,
      );
    });
  });

  describe('when there is no previous page available', () => {
    it('disables the previous button', () => {
      const result = shallow(<Pagination
        changePageTo={props.changePageTo}
        currentPage={props.currentPage}
        previousPageAvailable={false}
        nextPageAvailable={props.nextPageAvailable}
      />);

      const previousButton = result.find('button').first();

      expect(previousButton.prop('disabled')).toBe(true);
    });
  });

  describe('when there is no next page available', () => {
    it('disables the next button', () => {
      const result = shallow(<Pagination
        changePageTo={props.changePageTo}
        currentPage={props.currentPage}
        previousPageAvailable={props.previousPageAvailable}
        nextPageAvailable={false}
      />);

      const nextButton = result.find('button').last();

      expect(nextButton.prop('disabled')).toBe(true);
    });
  });
});
