import { server } from "../../../src/server";
import { IAdmin } from "../../../src/helper/Admin/interfaces";

export async function getAdmin(name: string): Promise<IAdmin | null> {
  return await server.Admin.findOne({ name });
}
