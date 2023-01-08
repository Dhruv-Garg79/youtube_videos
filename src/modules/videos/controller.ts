import Logger from '../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import VideosCollection from '../../models/videos/videosCollection';

class Controller {
	private readonly logger = new Logger('Videos Controller');

	public getVideos = async (req: Request, res: Response, next: NextFunction) => {
		const { limit, offset } = req.query;

		const videos = await new VideosCollection().filterAndSort({
			sort: { publishedAt: -1 },
			limit: (limit as any) ?? 20,
			offset: (offset as any) ?? 0,
		});

		return videos.apiResponse(res);
	};
}

export default new Controller();
