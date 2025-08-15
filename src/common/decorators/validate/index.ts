import { HttpExceptions } from "../../exceptions";
import { validations, setMessages } from "../../request";
import type {
	validationsOptions,
	validationsMessage,
} from "../../request/type";

const validateMapping =
	(type: string) =>
	(dataValidations: validationsOptions, messages?: validationsMessage) => {
		return (target, propertyKey, descriptor) => {
			const method = descriptor.value;
			descriptor.value = async function () {
				const [req, res] = arguments;
				if (messages) setMessages(messages);
				const errors = validations.compareData(req[type], dataValidations);
				if (errors !== true) {
					HttpExceptions({
						status: 401,
						message: errors,
						type: "WARNING",
					});
					return;
				}
				return method.apply(this, arguments);
			};
		};
	};
export const ValidateBody = validateMapping("body");
export const ValidateQuery = validateMapping("query");
export const ValidateParams = validateMapping("params");
