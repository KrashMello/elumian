import { type cacheData, type cacheLists } from "./type";
import { Elumian } from "..";
import { createClient } from "redis";

const secondsToMidnight = (n: Date): number => {
	return (
		(24 - n.getHours() - 1) * 60 * 60 +
		(60 - n.getMinutes() - 1) * 60 +
		(60 - n.getSeconds())
	);
};

export const list: Record<string, Record<string, any>> = {};

let redisConfiguration: {
	url: string;
};

const expireTime = (seconds: number = 1) => {
	return 1000 * seconds;
};

export const setConfigProvider = (args: { url: string }) => {
	redisConfiguration = args;
};

export const singData = async (args: {
	key: string;
	data: any;
	field?: string;
	encrypted?: boolean;
	ttl?: number;
}): Promise<any> => {
	let { key, data, field, encrypted, ttl } = args;

	const id = field || Elumian.crypto.codeGen(72);
	let result: { id: string; expireTime?: any } = {
		id,
	};
	if (encrypted) {
		data = Elumian.crypto.hardEncrypt(data);
	}
	if (ttl) {
		const expirationDuration = secondsToMidnight(new Date()) * expireTime(ttl);
		result.expireTime = new Date(Date.now() + expirationDuration);
	}
	if (redisConfiguration) {
		const client = await createClient(redisConfiguration)
			.on("error", (err) => console.log("Redis Client Error", err))
			.connect();
		await client.hSet(key, id, JSON.stringify(data));
		if (ttl) await client.hExpire(key, id, ttl || 60);
		client.destroy();
	} else {
		if (!list[key]) list[key] = {};
		if (!list[key][id]) list[key][id] = data;
		if (ttl) {
			setTimeout(() => {
				delete list[key][id];
			}, expireTime(ttl));
		}
	}
	return result;
};

export const getData = async (
	key: string,
	field: string,
): Promise<cacheData | string> => {
	let value: string | Record<string, any>;
	if (redisConfiguration) {
		const client = await createClient(redisConfiguration)
			.on("error", (err) => console.log("Redis Client Error", err))
			.connect();
		value = JSON.parse((await client.hGet(key, field)) as string);
		client.destroy();
	} else {
		value = list[key][field] || undefined;
	}
	return value as string;
};

export const verifyId = async (
	key: string,
	field: string,
): Promise<boolean> => {
	return (await getData(key, field)) ? true : false;
};
