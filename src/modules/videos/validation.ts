import { z } from 'zod';
import CommonValidation from '../../utils/commonValidation';

export default {
	getVideos: z.object({
		query: z.object({
			searchQuery: z.string().optional(),
			limit: CommonValidation.queryNumber.optional(),
			offset: CommonValidation.queryNumber.optional(),
		}),
	}),
};
