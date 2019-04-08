import { formatTimeFromSeconds } from '../../utils/utils';

describe('Time formatting tests', () => {
  it('Should format time correctly', () => {
    expect(formatTimeFromSeconds(60)).toEqual('1:00')
    expect(formatTimeFromSeconds(61)).toEqual('1:01')
    expect(formatTimeFromSeconds(59)).toEqual('0:59')
    expect(formatTimeFromSeconds(500)).toEqual('8:20')
  })
})