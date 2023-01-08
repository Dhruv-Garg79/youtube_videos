import axios from 'axios';
import { envConfig } from '../../config/envConfig';
import VideosCollection, { VideoType } from '../../models/videos/videosCollection';
import Logger from '../../utils/logger';

class Service {
	private readonly logger = new Logger('Videos Service');
	private readonly collection = new VideosCollection();

	constructor() {
		this.collection.createIndexes();
	}

	public populateVideos = async () => {
		this.logger.debug('populate videos invoked');
		try {
			const lastVideoStored = await this.collection.filterAndSort({
				sort: { publishedAt: -1 },
				limit: 1,
			});

			const video = lastVideoStored.value?.length > 0 ? lastVideoStored.value[0] : null;
			const date = video ? video.publishedAt : new Date();
			if (!video) date.setDate(date.getDate() - 7);

			const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
				params: {
					key: envConfig.youTubeApiKey,
					part: 'snippet',
					q: 'football',
					type: 'video',
					order: 'date',
					publishedAfter: date.toISOString(),
					maxResults: 50
				},
			});

			this.logger.debug(res.data.items.length);

			const videos: VideoType[] = [];
			for (const item of res.data.items) {
				videos.push({
					videoId: item.id.videoId,
					channelTitle: item.snippet.channelTitle,
					title: item.snippet.title,
					description: item.snippet.description,
					thumbnails: item.snippet.thumbnails,
					publishedAt: new Date(item.snippet.publishedAt),
				});
			}

			const insertRes = await this.collection.insertMany(videos);
			this.logger.debug(insertRes.value?.insertedCount);
		} catch (error) {
			this.logger.error(error.response);
		}
	};
}

const service = new Service();

// populate videos on the start of server
service.populateVideos();

export default service;
