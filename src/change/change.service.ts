import { Injectable,
    InternalServerErrorException,
    Logger,
 } from '@nestjs/common';
 import { Connection } from 'typeorm';

@Injectable()
export class ChangeService {
    private logger = new Logger('HelpService');

    constructor(private readonly conn: Connection) { }
    async changePassword(data: any): Promise<any> {
        try {
          let query = `CALL spChangePassword (?,?,?,?)`;
    
          //return await this.conn.query(query);
          const res = await this.conn.query(query, [
            data.UserType,
            data.UserId,
            data.NewPassword,
            data.UpdtUsr,
          ]);
          return { message: 'successful', data: res[0] };
        } catch (error) {
          this.logger.error(error);
    
          throw new InternalServerErrorException();
        }
      }
    
}
