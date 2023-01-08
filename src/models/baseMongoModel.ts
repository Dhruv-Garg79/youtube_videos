import { SafeParseError, SafeParseReturnType } from 'zod/lib/types';
import Logger from '../utils/logger';
import Result from '../utils/result';

export default abstract class BaseMongoModel<T> {
	protected readonly logger: Logger;

	constructor(namespace: string) {
		this.logger = new Logger(namespace);
	}

	protected handleValidateFailure(result: SafeParseReturnType<any, any>, input: T): Result<any> {
		const failResult = result as SafeParseError<T>;
		this.logger.error('validation error for input', input);
		this.logger.error(failResult.error);
		return Result.error('validation failed');
	}
}
