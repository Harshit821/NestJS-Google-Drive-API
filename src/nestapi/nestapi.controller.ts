import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NestapiService } from './nestapi.service';
import { CreateNestapiDto } from './dto/create-nestapi.dto';
import { UpdateNestapiDto } from './dto/update-nestapi.dto';

@Controller('nestapi')
export class NestapiController {
  constructor(private readonly nestapiService: NestapiService) {}

  @Post()
  create(@Body() createNestapiDto: CreateNestapiDto) {
    return this.nestapiService.create(createNestapiDto);
  }

  @Get('list')
  findAll() {
    return this.nestapiService.findAll();
  }
  @Get('upload/:name')
  upLoad(@Param('name') name: string) {
    return this.nestapiService.upLoad(name);
  }
  @Get('search/:name')
  Search(@Param('name') name: string) {
    return this.nestapiService.Search(name);
  }
  @Get('download/:name')
  downLoad(@Param('name') name: string) {
    return this.nestapiService.downLoad(name);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nestapiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNestapiDto: UpdateNestapiDto) {
    return this.nestapiService.update(+id, updateNestapiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nestapiService.remove(+id);
  }
}
