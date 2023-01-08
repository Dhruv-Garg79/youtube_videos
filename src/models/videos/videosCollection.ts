import { z } from 'zod';
import BaseMongoCollection from '../baseMongoCollection';

export type VideoType = z.infer<typeof VideosCollection.schema>;

export default class VideosCollection extends BaseMongoCollection<VideoType> {
	static readonly collection = 'videos';

	static readonly thumbnailSchema = z.object({
		height: z.number(),
		width: z.number(),
		url: z.string(),
	});

	static readonly schema = z.object({
		_id: z.string(),
		videoId: z.string(),
		title: z.string(),
		description: z.string(),
		channelTitle: z.string(),
		publishedAt: z.date(),
		thumbnails: z.object({
			default: VideosCollection.thumbnailSchema,
			medium: VideosCollection.thumbnailSchema,
			high: VideosCollection.thumbnailSchema,
		}),
	});

	constructor() {
		super(VideosCollection.collection, VideosCollection.schema);
	}

	public async createIndexes() {
		return await this.createDBIndexes([
			{
				publishedAt: 1,
			},
			{
				title: 'text',
				description: 'text',
			},
		]);
	}
}
