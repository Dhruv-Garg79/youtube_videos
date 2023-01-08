import * as dotenv from 'dotenv';
import path from 'path';

interface Config {
	readonly env: string;
	readonly isProd: boolean;
	readonly port: number;
	readonly youTubeApiKey;
	readonly mongo: {
		connectionUrl: string;
		username: string;
		password: string;
	};
}

const getEnvValue = (key: string): string => {
	return process.env[key] ?? '';
};

const env = getEnvValue('NODE_ENV');
const isProd = env === 'prod';
dotenv.config({ path: path.resolve(__dirname, `../../.env.${env}`) });

export const envConfig: Config = {
	env: env,
	isProd: isProd,
	port: parseInt(getEnvValue('PORT')),
	youTubeApiKey: getEnvValue('YOUTUBE_API_KEY'),
	mongo: {
		connectionUrl: getEnvValue('MONGO_CONNECTION_URL'),
		username: getEnvValue('MONGO_USER_NAME'),
		password: getEnvValue('MONGO_PASSWORD'),
	},
};

if (!isProd) console.log(envConfig);
