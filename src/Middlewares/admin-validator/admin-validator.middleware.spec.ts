import { AdminValidatorMiddleware } from './admin-validator.middleware';

describe('AdminValidatorMiddleware', () => {
  it('should be defined', () => {
    expect(new AdminValidatorMiddleware()).toBeDefined();
  });
});
