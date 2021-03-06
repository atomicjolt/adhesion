import React from 'react';
import { shallow, mount } from 'enzyme';

import { SearchPage } from './search_page';
import Loader from '../../../../libs/components/loader';

jest.mock('./edit_user_modal');

describe('SearchPage', () => {
  const props = {
    searchForAccountUsers: () => {},
    matchingUsers: [
      {
        id: 1,
        name: 'George Washington',
        login_id: 'countryfather@revolution.com',
        sis_user_id: 'george_123',
        email: 'countryfather@revolution.com',
      },
      {
        id: 2,
        name: 'Thomas Jefferson',
        login_id: 'idodeclare@revolution.com',
        sis_user_id: 'thomas_123',
        email: 'idodeclare@revolution.com',
      }
    ],
    currentPage: 2,
    previousPageAvailable: true,
    nextPageAvailable: true,
  };

  const submitSearch = (searchPage) => {
    searchPage.find('button[type="submit"]').simulate('click', {
      preventDefault: () => {},
      target: { form: { reportValidity: () => {} } },
    });
  };

  it('renders the search page', () => {
    const searchPage = shallow(<SearchPage
      matchingUsers={props.matchingUsers}
      searchForAccountUsers={props.searchForAccountUsers}
      currentPage={props.currentPage}
      previousPageAvailable={props.previousPageAvailable}
      nextPageAvailable={props.nextPageAvailable}
    />);

    expect(searchPage).toMatchSnapshot();
  });

  describe('when the user submits a search', () => {
    it('submits a search request', () => {
      spyOn(props, 'searchForAccountUsers');
      const searchTerm = 'student name';
      const searchPage = shallow(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
      />);

      searchPage.find('input').simulate('change', { target: { value: searchTerm } });
      submitSearch(searchPage);

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        searchTerm,
      );
    });

    it('displays the loading indicator', () => {
      const searchPage = shallow(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
        isSearching
      />);

      expect(searchPage.contains(<Loader />)).toEqual(true);
    });
  });

  describe('when the user submits a search that returns no results', () => {
    it('displays the no search results section', () => {
      const searchPage = shallow(<SearchPage
        matchingUsers={[]}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
        previousPageAvailable={props.previousPageAvailable}
        nextPageAvailable={props.nextPageAvailable}
      />);

      searchPage.find('input').simulate('change', { target: { value: 'student name' } });
      submitSearch(searchPage);

      expect(searchPage).toMatchSnapshot();
    });
  });

  describe('when the user submits a search with less than 3 characters', () => {
    it('does not submit the search', () => {
      spyOn(props, 'searchForAccountUsers');
      const searchTerm = 'jo';
      const searchPage = shallow(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
      />);

      searchPage.find('input').simulate('change', { target: { value: searchTerm } });
      submitSearch(searchPage);

      expect(props.searchForAccountUsers).not.toHaveBeenCalled();
    });

    it('does not affect the paged results', () => {
      spyOn(props, 'searchForAccountUsers');
      const firstSearchTerm = 'john';
      const shortSearchTerm = 'sa';
      const searchPage = mount(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
        previousPageAvailable={props.previousPageAvailable}
        nextPageAvailable={props.nextPageAvailable}
      />);

      searchPage.find('input').simulate('change', { target: { value: firstSearchTerm } });
      submitSearch(searchPage);

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        firstSearchTerm,
      );

      searchPage.find('input').simulate('change', { target: { value: shortSearchTerm } });
      submitSearch(searchPage);

      const buttons = searchPage.find('button');
      const nextButton = buttons.at(buttons.length - 1);
      nextButton.simulate('click');

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        firstSearchTerm,
        props.currentPage + 1,
      );
    });
  });

  describe('when the user updates the value in the search input field', () => {
    it('does not affect the paged results', () => {
      spyOn(props, 'searchForAccountUsers');
      const firstSearchTerm = 'john';
      const secondSearchTerm = 'jones';
      const searchPage = mount(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
        previousPageAvailable={props.previousPageAvailable}
        nextPageAvailable={props.nextPageAvailable}
      />);

      searchPage.find('input').simulate('change', { target: { value: firstSearchTerm } });
      submitSearch(searchPage);

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        firstSearchTerm,
      );

      searchPage.find('input').simulate('change', { target: { value: secondSearchTerm } });

      const buttons = searchPage.find('button');
      const nextButton = buttons.at(buttons.length - 1);
      nextButton.simulate('click');

      expect(props.searchForAccountUsers).toHaveBeenCalledWith(
        firstSearchTerm,
        props.currentPage + 1,
      );
    });
  });

  describe('when a user is being updated', () => {
    it('displays the loading indicator', () => {
      const searchPage = shallow(<SearchPage
        matchingUsers={props.matchingUsers}
        searchForAccountUsers={props.searchForAccountUsers}
        currentPage={props.currentPage}
        isUpdatingUser
      />);

      expect(searchPage.contains(<Loader />)).toEqual(true);
    });
  });
});
