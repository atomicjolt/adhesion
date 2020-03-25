import React from 'react';
import { shallow, mount } from 'enzyme';

import { SearchPage } from './search_page';

describe('SearchPage', () => {
  const props = {
    searchForAccountUsers: () => {},
    matchingUsers: [
      {
        id: 1,
        name: 'George Washington',
        login_id: 'countryfather@revolution.com',
        sis_user_id: 'george_123',
        roles: ['admin', 'teacher'],
        email: 'countryfather@revolution.com',
      },
      {
        id: 2,
        name: 'Thomas Jefferson',
        login_id: 'idodeclare@revolution.com',
        sis_user_id: 'thomas_123',
        roles: ['teacher'],
        email: 'idodeclare@revolution.com',
      }
    ],
    lmsAccountId: '1',
    currentPage: 2,
    previousPageAvailable: true,
    nextPageAvailable: true,
  };

  it('renders the search page', () => {
    const result = shallow(<SearchPage
      matchingUsers={props.matchingUsers}
      searchForAccountUsers={props.searchForAccountUsers}
      lmsAccountId={props.lmsAccountId}
      currentPage={props.currentPage}
      previousPageAvailable={props.previousPageAvailable}
      nextPageAvailable={props.nextPageAvailable}
    />);

    expect(result).toMatchSnapshot();
  });

  describe('when the user submits a search', () => {
    it('submits a search request', () => {
      spyOn(props, 'searchForAccountUsers');
      const searchTerm = 'student name';
      const result = mount(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        lmsAccountId={props.lmsAccountId}
        currentPage={props.currentPage}
      />);

      result.find('input').simulate('change', { target: { value: searchTerm } });
      result.find('button[type="submit"]').simulate('click');

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        props.lmsAccountId,
        searchTerm,
      );
    });

    describe('when the user submits a search with less than 3 characters', () => {
      it('does not submit the search', () => {
        spyOn(props, 'searchForAccountUsers');
        const searchTerm = 'jo';
        const result = mount(<SearchPage
          matchingUsers={props.matchingUsers}
          searchForAccountUsers={props.searchForAccountUsers}
          lmsAccountId={props.lmsAccountId}
          currentPage={props.currentPage}
        />);

        result.find('input').simulate('change', { target: { value: searchTerm } });
        result.find('button[type="submit"]').simulate('click');

        expect(props.searchForAccountUsers).not.toHaveBeenCalledWith(
          props.lmsAccountId,
          searchTerm,
        );
      });
    });

    describe('when the user updates the value in the search input field', () => {
      it('does not affect the paged results', () => {
        spyOn(props, 'searchForAccountUsers');
        const firstSearchTerm = 'john';
        const secondSearchTerm = 'jones';
        const result = mount(<SearchPage
          matchingUsers={props.matchingUsers}
          searchForAccountUsers={props.searchForAccountUsers}
          lmsAccountId={props.lmsAccountId}
          currentPage={props.currentPage}
          previousPageAvailable={props.previousPageAvailable}
          nextPageAvailable={props.nextPageAvailable}
        />);

        result.find('input').simulate('change', { target: { value: firstSearchTerm } });
        result.find('button[type="submit"]').simulate('click');

        expect(props.searchForAccountUsers).toHaveBeenCalledWith(
          props.lmsAccountId,
          firstSearchTerm,
        );

        result.find('input').simulate('change', { target: { value: secondSearchTerm } });

        const buttons = result.find('button');
        const nextButton = buttons.at(buttons.length - 1);
        nextButton.simulate('click');

        expect(props.searchForAccountUsers).toHaveBeenCalledWith(
          props.lmsAccountId,
          firstSearchTerm,
          props.currentPage + 1,
        );
      });
    });
  });
});
