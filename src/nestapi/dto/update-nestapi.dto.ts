import { PartialType } from '@nestjs/mapped-types';
import { CreateNestapiDto } from './create-nestapi.dto';

export class UpdateNestapiDto extends PartialType(CreateNestapiDto) {}
