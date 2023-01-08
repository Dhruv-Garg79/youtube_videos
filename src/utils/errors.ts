import { Response, NextFunction } from 'express';
import Result from './result';

export default class Errors {
	static DOES_NOT_EXIST = 'Doc does not exist';
}

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
	const { message } = err;
	const response = {
		message,
	};

	res.sendServerError(response);
};
