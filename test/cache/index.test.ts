import { Elumian } from "elumian/core";
const redisConfirmation = async () => {
	console.log("--------------\n\tRedis confirmation");
	Elumian.cache.setConfigProvider({
		url: "redis://:@localhost:6379",
	});
	const cache = await Elumian.cache.singData({
		key: "test",
		data: { id: 1, name: "asd" },
	});
	console.log(cache);
	console.log(await Elumian.cache.getData("test", cache.id));
	console.log(Elumian.cache.list);
	console.log("----------\n\tConfirm\n");
};
const deleteConfirmation = async () => {
	console.log("--------------\nDelete Confirmation\n");
	console.log('add in key: "test" new value\n with ttl: 10 seconds');
	const cache = await Elumian.cache.singData({
		key: "test",
		data: { id: 1, name: "asd" },
		ttl: 10,
	});
	console.log(`cache provide field: ${cache.id}\n`);
	console.log(`list caching \n`);
	console.log(Elumian.cache.list);
	setTimeout(() => {
		console.log("--------------\nDelete Confirmation\n");
		console.log(`list without 10 secords field: ${cache.id} \n`);
		console.log(Elumian.cache.list);
		console.log("--------\nconfirm \n");
	}, 10000);
};
const verifyIdConfirmation = async () => {
	console.log("--------------\nverify id Confirmation\n");
	console.log("add in key: test new value\n");
	const cache = await Elumian.cache.singData({
		key: "test",
		data: { id: 1, name: "asd" },
		encrypted: true,
	});
	console.log(`cache provide field: ${cache.id}\n`);
	console.log(
		`veryfy if field: "ramdom" in key: "test" exist: ${await Elumian.cache.verifyId("test", "random")} \n`,
	);
	console.log(
		`veryfy if field: ${cache.id} in key: \"test\" exist: ${await Elumian.cache.verifyId("test", "random")}\n`,
	);
};
const verifyCustomFieldConfirmation = async () => {
	console.log("--------------\nverify custom field Confirmation\n");
	console.log("add in key: test new value with a custom field name\n");
	const cache = await Elumian.cache.singData({
		key: "test",
		field: "random",
		data: { id: 1, name: "asd" },
		encrypted: true,
	});
	console.log(`cache provide field: ${cache.id}\n`);
	console.log(
		`veryfy if field custom in key: "test" exist: ${await Elumian.cache.verifyId("test", cache.id)} \n`,
	);
};
const test = async () => {
	await deleteConfirmation();
	await verifyIdConfirmation();
	await verifyCustomFieldConfirmation();
};
test();
