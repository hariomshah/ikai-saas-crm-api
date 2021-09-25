import { Injectable,
    InternalServerErrorException,
    Logger,
 } from '@nestjs/common';
 import { Connection } from 'typeorm';

@Injectable()
export class PackagemasterService {
    private logger = new Logger('PackagemasterService');

    constructor(private readonly conn: Connection) { }
    async insUpdtPackageMaster (data: any): Promise<any> {
        try {
            // console.log(data);
          let query = `CALL spInsUpdtPackageMaster (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    
          //return await this.conn.query(query);
          const res = await this.conn.query(query, [
            data.CompCode,
            data.InsUpdtType,
            data.PackageId,		
            data.PackageTitle,		
            data.PackageDesc,		
            data.PackageUnit,		
            data.PackageUnitDesc,		
            data.PackageDiscType,		
            data.PackageDiscValue,		
            data.IsActive,			
            data.updt_usr,	
            data.VisitType,	
            data.PackageDiscHtml,
            ]);
          
          return { message: 'successful', data: res[0] };
        } catch (error) {
          this.logger.error(error);
    
          throw new InternalServerErrorException();
        }
      }
      async getPackageMaster(CompCode): Promise<any> {
        try {
          let query = `CALL spGetPackageMaster (?)`;
          const res = await this.conn.query(query, [
            CompCode
          ]);
          return { message: 'successful', data: res[0] };
        } catch (error) {
          this.logger.error(error);
    
          throw new InternalServerErrorException();
        }
      }
}
