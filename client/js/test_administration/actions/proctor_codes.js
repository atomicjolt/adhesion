import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'LOAD_PROCTOR_CODES'
];

export const Constants = wrapper([], requests);

export const loadProctorCodes = proctorId => ({
  method: Network.GET,
  type: Constants.LOAD_PROCTOR_CODES,
  url: '/api/proctor_codes',
  params: { proctor_id: proctorId }
});
