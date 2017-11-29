import React from 'react';
import { shallow } from 'enzyme';
import Question from './_question';
import MultipleChoice from './multiple_choice_question';
import MultipleAnswer from './multiple_answers_question';
import ShortAnswer from './short_answer_question';
import FillInBlanks from './fill_in_multiple_blanks_question';
import MultipleDropdowns from './multiple_dropdowns_question';
import Matching from './matching_question';
import Essay from './essay_question';
import TextOnly from './question_text';

describe('question', () => {
  let result;
  let props;

  beforeEach(() => {
    props = {
      question_type: 'multiple_choice_question',
      position: 1,
      points_possible: 3,
    };
    result = shallow(<Question {...props} />);
  });

  it('renders the question position', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders the points possible', () => {
    expect(result.find(MultipleChoice).length).toBe(1);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'multiple_answers_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(1);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'numerical_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(1);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'fill_in_multiple_blanks_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(1);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'multiple_dropdowns_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(1);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'matching_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(1);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'essay_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(1);
    expect(result.find(TextOnly).length).toBe(0);
  });

  it('renders the points possible', () => {
    props.question_type = 'text_only_question';
    result = shallow(<Question {...props} />);
    expect(result.find(MultipleChoice).length).toBe(0);
    expect(result.find(MultipleAnswer).length).toBe(0);
    expect(result.find(ShortAnswer).length).toBe(0);
    expect(result.find(FillInBlanks).length).toBe(0);
    expect(result.find(MultipleDropdowns).length).toBe(0);
    expect(result.find(Matching).length).toBe(0);
    expect(result.find(Essay).length).toBe(0);
    expect(result.find(TextOnly).length).toBe(1);
  });
});
