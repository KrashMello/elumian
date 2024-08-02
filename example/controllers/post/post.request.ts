import { RequestValidator } from "elumian/request";

const findDataOptions = {
  searchFilter: "alpha",
};

const createPostOptions = {
  title: "required|min:3|max:150|alpha",
  content: "required|max:500|alpha",
  publiched: "required|boolean",
};

const updatePostOptions = {
  title: "required|min:3|max:150|alpha",
  content: "required|max:500|alpha",
  publiched: "required|boolean",
};

export const findDataRequest = {
  options: findDataOptions,
  message: { required: "No se encontro el dato" },
};
export const createPostRequest = { options: createPostOptions };
export const updatePostRequest = { options: updatePostOptions };
