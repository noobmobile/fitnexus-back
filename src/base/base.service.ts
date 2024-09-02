import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { BaseFilter, IBaseFilterResponse } from './base.filter';

@Injectable()
export class BaseService<
  T,
  CreateDto extends DeepPartial<T>,
  UpdateDto extends QueryDeepPartialEntity<T>,
> {
  constructor(private repository: Repository<T>) {}

  async create(createDto: CreateDto) {
    const data = await this.repository.save(createDto);
    return this.findOne(data['id']);
  }

  async findAll(filter: BaseFilter, options: FindManyOptions<T> = {}) {
    const { order: orderBy, sort, offset, limit } = filter;
    const order = {
      [orderBy]: sort,
    } as FindOptionsOrder<T>;

    const data = await this.repository.findAndCount({
      ...options,
      order,
      skip: offset,
      take: limit,
    });

    return {
      data: data[0],
      pagination: {
        total: data[1],
        offset,
        limit,
        sort,
        order: orderBy,
      },
    } as IBaseFilterResponse<T>;
  }

  async findOne(id: number, options: FindOneOptions<T> = {}) {
    const obj = await this.findOneBy({ ...options, where: { id } as any });
    if (!obj) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return obj;
  }

  findOneBy(options: FindOneOptions<T>) {
    return this.repository.findOne(options);
  }

  async update(id: number, updateDto: UpdateDto) {
    await this.repository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
