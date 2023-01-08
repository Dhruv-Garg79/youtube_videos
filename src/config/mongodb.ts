import { Collection, CreateIndexesOptions, MongoClient, ObjectId, FindCursor, InsertManyResult } from 'mongodb';
import { envConfig } from './envConfig';

const mongoClient = new MongoClient(envConfig.mongo.connectionUrl, {
	auth: {
		username: envConfig.mongo.username,
		password: envConfig.mongo.password,
	},
});

export const mongodb = mongoClient.db(envConfig.env);

export const MongoId = ObjectId;
export type MongoCursor = FindCursor;

export type MongoCollection = Collection;
export type MongoCreateIndexesOptions = CreateIndexesOptions;
export type MongoInsertManyResult = InsertManyResult;
