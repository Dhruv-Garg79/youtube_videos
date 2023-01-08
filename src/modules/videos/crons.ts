import { CronJob } from '../../types/cronJob';
import service from './service';

const videoCronJobs: Array<CronJob> = [
	{
		schedule: '*/1 * * * *',
		job: service.populateVideos,
	},
];

export default videoCronJobs;
