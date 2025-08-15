// import fs from "node:fs";
import { Elumian } from "elumian/core";
import * as fs from "node:fs";
const keys = Object.keys(Elumian);
const descriptors = Object.getOwnPropertyDescriptors(Elumian);
const types = keys.map((value) => {
	const valueDescriptors = Object.getOwnPropertyDescriptors(
		descriptors[value].value,
	);
	const valueDescriptorsKeys = Object.keys(valueDescriptors).filter(
		(k) => k !== "__esModule",
	);
	return valueDescriptorsKeys.map((valuesDescriptorKey) => {
		return valueDescriptors[valuesDescriptorKey].value;
	});
});
function getType(value) {
	if (typeof value === "function") {
		return getFunctionType(value);
	}
	if (typeof value === "object") {
		if (Array.isArray(value)) return "any[]";
		else {
			// Simple parser para objeto con propiedades
			let props = Object.entries(value)
				.map(([k, v]) => `${k}: any[]`)
				.join("; ");
			return `{ ${props} }`;
		}
	}
	return "any";
}

function generateTypeScript(arr) {
	let result = "type FuncType = (...args: any[]) => any;\n\n";

	arr.forEach((subArr, i) => {
		const types = subArr.map(getType);
		result += `type SubArray${i + 1} = [${types.join(", ")}];\n`;
	});

	result += `\ntype MainArray = [${arr.map((_, i) => `SubArray${i + 1}`).join(", ")}];\n`;

	return result;
}
function getFunctionType(func) {
	const paramCount = func.length;
	const params = [];
	for (let i = 0; i < paramCount; i++) {
		params.push(`arg${i}: any`);
	}
	return `(${params.join(", ")}) => any`;
}
const tsOutput = generateTypeScript(types);
console.log(tsOutput);
import * as path from "node:path";
fs.writeFileSync(path.join(__dirname, "types.d.ts"), tsOutput);
