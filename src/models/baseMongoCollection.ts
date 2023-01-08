import { ZodObject } from 'zod';
import { MongoCollection, MongoCreateIndexesOptions, MongoCursor, mongodb, MongoId, MongoInsertManyResult } from '../config/mongodb';
import Result from '../utils/result';
import BaseMongoModel from './baseMongoModel';

type Operators = '$ne' | '$lt' | '$gt' | '$lte' | '$gte';
type ValueTypes = string | number | Date;
type Filter<T> = {
	[field in keyof T]:
		| {
				[operator in Operators]?: ValueTypes;
		  }
		| ValueTypes;
};

export type Projection<T> = {
	[field in keyof T]: 0 | 1;
};

export default abstract class BaseMongoCollection<T> extends BaseMongoModel<T> {
	private readonly typeSchema: ZodObject<any>;
	protected readonly collection: MongoCollection;

	constructor(collectionName: string, schema: ZodObject<any>) {
		super(`${collectionName} collection`);
		this.typeSchema = schema;
		this.collection = mongodb.collection(collectionName);
	}

	public async insertDoc(_id: string, data: T): Promise<Result<T>> {
		(data as any)._id = new MongoId(_id);
		return await this.insert(data);
	}

	public async insert(data: T): Promise<Result<T>> {
		try {
			const validateRes = this.typeSchema.deepPartial().safeParse(data);

			if (!validateRes.success) {
				return this.handleValidateFailure(validateRes, data) as any;
			}

			(data as any).createdAt = new Date();
			const res = await this.collection.insertOne(data);
			this.logger.debug('insertion result', res);
			(data as any)._id = res.insertedId.toString();
			return new Result(data);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async insertMany(array: Array<T>): Promise<Result<MongoInsertManyResult>> {
		try {
			for (const data of array) {
				(data as any).createdAt = new Date();
				const validateRes = this.typeSchema.deepPartial().safeParse(data);

				if (!validateRes.success) {
					return this.handleValidateFailure(validateRes, data) as any;
				}
			}

			this.logger.debug(array);
			const res = await this.collection.insertMany(array);
			this.logger.debug('insertion result', res);
			return new Result(res);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getByPk(_id: string): Promise<Result<T>> {
		try {
			const res = await this.collection.findOne({ _id: new MongoId(_id) });
			return new Result(res as unknown as T);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async exists(_id: string): Promise<Result<boolean>> {
		try {
			const res = await this.collection.countDocuments({ _id: _id });
			return new Result(res > 0);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getAll(param: { limit?: number; offset?: number }): Promise<Result<Array<T>>> {
		try {
			const query = this.collection.find();
			return this.queryLimitAndOffset(query, param.limit, param.offset);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getByFields(param: {
		filter: Filter<T>;
		limit?: number;
		offset?: number;
		project?: Projection<T>;
	}): Promise<Result<Array<T>>> {
		return this.queryLimitAndOffset(this.collection.find(param.filter), param.limit, param.offset, param.project);
	}

	public async filterAndSort(param: {
		filter?: Filter<T>;
		or?: Filter<T>;
		sort: {
			[field in keyof T]: 1 | -1;
		};
		limit?: number;
		offset?: number;
	}): Promise<Result<Array<T>>> {
		const filter = param.filter ?? {};
		if (param.or) {
			const statements = [];
			Object.keys(param.or).forEach(key => {
				statements.push({
					[key]: param.or[key],
				});
			});

			filter['$or'] = statements;
		}

		this.logger.debug(filter);

		const query = this.collection.find(filter).sort(param.sort);
		return this.queryLimitAndOffset(query, param.limit, param.offset);
	}

	private async queryLimitAndOffset(
		query: MongoCursor,
		limit?: number,
		offset?: number,
		project?: Projection<T>,
	): Promise<Result<Array<T>>> {
		try {
			if (offset) query.skip(offset);
			if (limit) query.limit(limit);
			if (project) query.project(project);

			const res = await query.toArray();
			return new Result(res as unknown as Array<T>);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	public async getCountByField(param: Filter<T>): Promise<Result<number>> {
		const res = await this.collection.countDocuments(param);
		return new Result(res);
	}

	public async delete(_id: string): Promise<Result<boolean>> {
		try {
			const deleteRes = await this.collection.deleteOne({
				_id: new MongoId(_id),
			});
			return new Result(deleteRes.deletedCount > 0);
		} catch (error) {
			this.logger.error('Failed To Delete Document :', error);
			return Result.error(error.message);
		}
	}

	public async updateByPk(_id: string, data: T, upsert = true): Promise<Result<boolean>> {
		return this.update(
			{
				_id: new MongoId(_id),
			} as any,
			data,
			upsert,
		);
	}

	public async update(
		filter: {
			[field in keyof T]: ValueTypes;
		},
		data: T,
		upsert = true,
	): Promise<Result<boolean>> {
		try {
			const validateRes = this.typeSchema.deepPartial().safeParse(data);

			if (!validateRes.success) {
				return this.handleValidateFailure(validateRes, data);
			}

			const update = await this.collection.updateOne(filter, { $set: data }, { upsert: upsert });

			const changeCount = update.matchedCount ?? 0 + update.modifiedCount ?? 0 + update.upsertedCount ?? 0;
			return new Result(changeCount > 0);
		} catch (error) {
			this.logger.error(error);
			return Result.error(error.message);
		}
	}

	protected async createDBIndexes(
		indexes: Array<
			{
				[field in keyof T]: 1 | -1 | 'text';
			} & { options?: MongoCreateIndexesOptions }
		>,
	): Promise<Array<string>> {
		const result = [];
		for (const index of indexes) {
			const options = index.options;
			if (options) delete index.options;

			const res = await (options ? this.collection.createIndex(index, options) : this.collection.createIndex(index));

			this.logger.debug(res);
			result.push(res);
		}

		return result;
	}
}
