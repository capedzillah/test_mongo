import { createSelector } from 'reselect';

const exampleDataSelector = state => state.example;

const resultSelector = createSelector(
  exampleDataSelector,
  payload => payload.get('result')
);

export const exampleSelector = state => ({
  result: resultSelector(state),
});

const userDataSelector = state => state.example;

const userSelector = createSelector(
  userDataSelector,
  payload => payload.get('userinfo')
);

export const userInfoSelector = state => ({
	userinfo: userSelector(state),
});
