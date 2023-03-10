import { Test, TestingModule } from '@nestjs/testing';
import { AdminUser } from './admin-user.service';

describe('AdminUser', () => {
  let provider: AdminUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminUser],
    }).compile();

    provider = module.get<AdminUser>(AdminUser);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
