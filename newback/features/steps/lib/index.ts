import { server } from "github/NNGame/backend/src/server";
import { IAdmin } from "github/NNGame/backend/src/helper/Admin/interfaces";

export async function getAdmin(name: string): Promise<IAdmin | null> {
  return await server.Admin.findOne({ name });
}
