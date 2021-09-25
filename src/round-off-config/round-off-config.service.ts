import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";


@Injectable()
export class RoundOffConfigService {
    private logger = new Logger("RoundOffConfigService");
    constructor(private readonly conn: Connection) { }

    // spUpdtRounOffConfig
    async UpdtRounOffConfig(data: any): Promise<any> {
        // console.log(data)
        try {
            let query = `CALL spUpdtRounOffConfig(?,?,?,?,?,?,?)`;
            // console.log(data);
            const res = await this.conn.query(query, [
                data.CompCode,
                data.ProjectType,
                data.TransactionType,
                data.IsEnabled,
                data.RoundValue,
                data.RoundType,
                data.Updt_Usr,
            ]);

            return { message: "successful", data: res[0] };
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    // spGetRoundOffConfigData
    async getRoundOffConfigData(CompCode): Promise<any> {
        try {
            let query = `CALL spGetRoundOffConfigData(?)`;
            const res = await this.conn.query(query, [CompCode]);
            return { message: "successful", data: res[0] };
        } catch (error) {
            this.logger.error(error);

            throw new InternalServerErrorException();
        }
    }
}
