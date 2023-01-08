export type CronJob = {
	schedule: string;
	job: () => Promise<void>;
};
