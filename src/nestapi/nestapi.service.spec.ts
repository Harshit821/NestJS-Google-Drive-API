import { Test, TestingModule } from '@nestjs/testing';
import { NestapiService } from './nestapi.service';

describe('NestapiService', () => {
  let service: NestapiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestapiService],
    }).compile();

    service = module.get<NestapiService>(NestapiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
