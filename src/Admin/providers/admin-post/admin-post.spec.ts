import { Test, TestingModule } from '@nestjs/testing';
import { AdminPost } from './admin-post.service';

describe('AdminPost', () => {
  let provider: AdminPost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPost],
    }).compile();

    provider = module.get<AdminPost>(AdminPost);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
