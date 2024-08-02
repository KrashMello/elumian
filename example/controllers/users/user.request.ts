import { RequestValidator } from "elumian/request";

const findDataOptions = {
  searchFilter: "alpha",
};

const createUserOptions = {
  name: "required|max:20|alpha",
  email: "required|email",
};

const updateUserOptions = {
  name: "required|max:20|alpha",
};

export const findDataRequest = new RequestValidator(findDataOptions).validate(
  true,
);
export const createUserRequest = new RequestValidator(
  createUserOptions,
).validate();
export const updateUserRequest = new RequestValidator(
  updateUserOptions,
).validate();
