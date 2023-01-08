import Logger from '../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import VideosCollection from '../../models/videos/videosCollection';

class Controller {
	private readonly logger = new Logger('Videos Controller');
	private readonly collection = new VideosCollection();

	public getVideos = async (req: Request, res: Response, next: NextFunction) => {
		const { searchQuery, limit, offset } = req.query;

		const videos = searchQuery
			? await this.collection.search({
					search: searchQuery as any,
					limit: (limit as any) ?? 20,
					offset: (offset as any) ?? 0,
			  })
			: await this.collection.filterAndSort({
					sort: { publishedAt: -1 },
					limit: (limit as any) ?? 20,
					offset: (offset as any) ?? 0,
			  });

		return videos.apiResponse(res);
	};
}

export default new Controller();
