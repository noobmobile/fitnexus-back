import {
  ArgumentMetadata,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Patch,
  Post,
  Query,
  Type,
  UsePipes,
  ValidationPipe,
  ValidationPipeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseError } from './base.error';
import { BaseFilter, IBaseFilterResponse } from './base.filter';
import { BaseService } from './base.service';
import { Roles } from '../routes/auth/decorators/role.decorator';
import { UserRole } from '../routes/auth/models/UserRole';

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: { body?: Type; query?: Type; param?: Type },
  ) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const targetType = this.targetTypes[metadata.type];
    if (!targetType) {
      return super.transform(value, metadata);
    }
    return super.transform(value, { ...metadata, metatype: targetType });
  }
}

export interface ICrudController<
  T,
  C extends DeepPartial<T>,
  U extends QueryDeepPartialEntity<T>,
  Q,
> {
  create(createDto: C): Promise<T>;
  findAll(filter: Q): Promise<IBaseFilterResponse<T>>;
  findOne(id: string): Promise<T>;
  update(id: string, updateDto: U): Promise<T>;
  remove(id: string): Promise<void>;
}

export function ControllerFactory<
  T,
  C extends DeepPartial<T>,
  U extends QueryDeepPartialEntity<T>,
  Q extends BaseFilter,
  F extends IBaseFilterResponse<T>,
>(
  entity: Type<T>,
  createDto: Type<C>,
  updateDto: Type<U>,
  queryDto: Type<Q>,
  filterDto: Type<F>,
): Type<ICrudController<T, C, U, Q>> {
  const createPipe = new AbstractValidationPipe(
    { whitelist: true, forbidNonWhitelisted: true, transform: true },
    { body: createDto },
  );
  const updatePipe = new AbstractValidationPipe(
    { whitelist: true, forbidNonWhitelisted: true, transform: true },
    { body: updateDto },
  );
  const queryPipe = new AbstractValidationPipe(
    { whitelist: true, forbidNonWhitelisted: true, transform: true },
    { query: queryDto },
  );

  @UseInterceptors(ClassSerializerInterceptor)
  class CrudController<
    T,
    C extends DeepPartial<T>,
    U extends QueryDeepPartialEntity<T>,
    Q extends BaseFilter,
  > {
    constructor(public readonly service: BaseService<T, C, U>) {}

    @Post()
    @UsePipes(createPipe)
    @ApiResponse({ status: 201, type: entity })
    @ApiResponse({ status: '4XX', type: BaseError })
    @ApiBody({ type: createDto })
    @ApiBearerAuth()
    @Roles(UserRole.Admin)
    create(@Body() createDto: C) {
      return this.service.create(createDto);
    }

    @Get()
    @UsePipes(queryPipe)
    @ApiResponse({ status: 200, type: filterDto })
    @ApiResponse({ status: '4XX', type: BaseError })
    @ApiQuery({ type: queryDto })
    @ApiBearerAuth()
    @Roles(UserRole.Admin)
    findAll(@Query() filter: Q) {
      return this.service.findAll(filter);
    }

    @Get(':id')
    @ApiResponse({ status: 200, type: entity })
    @ApiResponse({ status: '4XX', type: BaseError })
    @ApiBearerAuth()
    @Roles(UserRole.Admin)
    findOne(@Param('id') id: string) {
      return this.service.findOne(+id);
    }

    @Patch(':id')
    @UsePipes(updatePipe)
    @ApiResponse({ status: 200, type: entity })
    @ApiResponse({ status: '4XX', type: BaseError })
    @ApiBody({ type: createDto })
    @ApiBearerAuth()
    @Roles(UserRole.Admin)
    update(@Param('id') id: string, @Body() updateDto: U) {
      return this.service.update(+id, updateDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: '4XX', type: BaseError })
    @ApiBearerAuth()
    @Roles(UserRole.Admin)
    remove(@Param('id') id: string) {
      return this.service.remove(+id);
    }
  }

  return CrudController;
}
