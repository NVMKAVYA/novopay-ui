import { AadhaarMaskPipe } from './aadhaar-mask.pipe';

describe('AadhaarMaskPipe', () => {
  it('create an instance', () => {
    const pipe = new AadhaarMaskPipe();
    expect(pipe).toBeTruthy();
  });
});
