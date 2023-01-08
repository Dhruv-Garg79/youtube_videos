import cron from 'cron';
import { CronJob } from '../types/cronJob';
import Logger from '../utils/logger';

const TIMEZONE = 'Asia/Kolkata';
const logger = new Logger('cron job');

export function initCronJobs(cronJobs: Array<CronJob>) {
	logger.info('Setting up crons', cronJobs.length);

	for (const it of cronJobs) {
		const job = new cron.CronJob(it.schedule, it.job, null, true, TIMEZONE);
		// job.start();
	}
}
