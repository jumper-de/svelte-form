import type { ZodSchema } from "zod";

export function parseFormData(data: FormData) {
  let output: any = {};

  for (const [key, value] of data) {
    key.split(".").reduce((position, path, index, array) => {
      if (index + 1 < array.length) {
        if (
          !(
            (Array.isArray(position) &&
              position.length > Number(path) &&
              position[Number(path)]) ||
            path in position
          )
        ) {
          position[isNaN(Number(path)) ? path : Number(path)] = isNaN(
            Number(array[index + 1]),
          )
            ? {}
            : [];
        }
      } else {
        if (
          !position[isNaN(Number(path)) ? path : Number(path)] ||
          value instanceof File
        ) {
          position[isNaN(Number(path)) ? path : Number(path)] = value;
        }
      }

      return position[isNaN(Number(path)) ? path : Number(path)];
    }, output);
  }

  return output;
}

export async function verifyFormData<S extends ZodSchema>(
  schema: S,
  request: Request,
) {
  return schema.parse(
    await parseFormData(await request.formData()),
  ) as S["_type"];
}
