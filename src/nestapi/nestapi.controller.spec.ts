import { Test, TestingModule } from '@nestjs/testing';
import { NestapiController } from './nestapi.controller';
import { NestapiService } from './nestapi.service';

describe('NestapiController', () => {
  let controller: NestapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NestapiController],
      providers: [NestapiService],
    }).compile();

    controller = module.get<NestapiController>(NestapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
