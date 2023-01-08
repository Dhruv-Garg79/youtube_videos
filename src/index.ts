import app from './config/app';
import { initCronJobs } from './config/cron';
import { envConfig } from './config/envConfig';
import videoCronJobs from './modules/videos/crons';
import Logger from './utils/logger';

const logger = new Logger('server');

const server = app.listen(envConfig.port, () => {
	logger.info(`Listening to port ${envConfig.port}`);
});

initCronJobs([...videoCronJobs]);

const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

const unexpectedErrorHandler = (error: string) => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});
