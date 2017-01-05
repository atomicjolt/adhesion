import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'GET_TESTING_CENTERS_ACCOUNT'
];

export const Constants = wrapper([], requests);

export const getTestingCentersAccount = canvasInstanceName => ({
  method: Network.GET,
  type: Constants.GET_TESTING_CENTERS_ACCOUNT,
  url: '/api/testing_centers_accounts',
  params: { canvas_instance_name: canvasInstanceName }
});
