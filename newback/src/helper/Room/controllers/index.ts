import trycatcher from "../../../utils/trycatcher";
import { IDecoratedRequest } from "../../../interfaces";
import { IRoomBase, IRoom, IRoomCreateRequest } from "../interfaces";
import methods from "../";
import { EntityName } from "../constants";

const ctrl = {
  create: trycatcher(
    async (req: IDecoratedRequest<IRoomCreateRequest>, h) => {
      const RoomData: IRoomCreateRequest = req.payload;
      return await methods.create(RoomData);
    },
    {
      logMessage: `${EntityName} create request`,
      isRequest: true
    }
  )
};

export default ctrl;
