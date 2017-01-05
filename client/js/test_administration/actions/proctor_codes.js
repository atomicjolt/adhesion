import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'LOAD_PROCTOR_CODES',
  'TESTING_CENTERS_ACCOUNT_SETUP'
];

export const Constants = wrapper([], requests);

export const loadProctorCodes = proctorId => ({
  method: Network.GET,
  type: Constants.LOAD_PROCTOR_CODES,
  url: '/api/proctor_codes',
  params: { proctor_id: proctorId }
});

export const testingCentersAccountSetup = (accountId, instanceName) => ({
  method: Network.POST,
  type: Constants.TESTING_CENTERS_ACCOUNT_SETUP,
  url: '/api/testing_centers_accounts',
  params: { account_id: accountId, instance_name: instanceName }
});
