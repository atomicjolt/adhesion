import React from 'react';
import { shallow } from 'enzyme';

import { Errors } from './errors';

describe('Errors', () => {
  const props = {
    clearErrors: () => {},
    errors: [
      { message: 'Something went wrong.' },
      { message: 'A terrible thing happened.' }
    ],
  };

  it('renders the errors', () => {
    const errors = shallow(<Errors
      clearErrors={props.clearErrors}
      errors={props.errors}
    />);

    expect(errors).toMatchSnapshot();
  });

  describe('when there are no errors', () => {
    it('renders nothing', () => {
      const errors = shallow(<Errors
        clearErrors={props.clearErrors}
        errors={[]}
      />);

      expect(errors.html()).toEqual(null);
    });
  });

  describe('when the user clicks the clear errors button', () => {
    it('clears the errors', () => {
      spyOn(props, 'clearErrors');
      const errors = shallow(<Errors
        clearErrors={props.clearErrors}
        errors={props.errors}
      />);

      errors.find('button').simulate('click');

      expect(props.clearErrors).toHaveBeenCalled();
    });
  });

  describe('when the user hits the enter key on the clear errors button', () => {
    it('clears the errors', () => {
      spyOn(props, 'clearErrors');
      const errors = shallow(<Errors
        clearErrors={props.clearErrors}
        errors={props.errors}
      />);

      // I'm not positive this `key` value matches the real world value.
      errors.find('button').simulate('keypress', { key: 'enter' });

      expect(props.clearErrors).toHaveBeenCalled();
    });
  });

  describe('when the user hits the space key on the clear errors button', () => {
    it('clears the errors', () => {
      spyOn(props, 'clearErrors');
      const errors = shallow(<Errors
        clearErrors={props.clearErrors}
        errors={props.errors}
      />);

      // I'm not positive this `key` value matches the real world value.
      errors.find('button').simulate('keypress', { key: 'space' });

      expect(props.clearErrors).toHaveBeenCalled();
    });
  });

  describe('when the user hits some other key on the clear errors button', () => {
    it('does not clear the errors', () => {
      spyOn(props, 'clearErrors');
      const errors = shallow(<Errors
        clearErrors={props.clearErrors}
        errors={props.errors}
      />);

      errors.find('button').simulate('keypress', { key: 'z' });

      expect(props.clearErrors).not.toHaveBeenCalled();
    });
  });
});
