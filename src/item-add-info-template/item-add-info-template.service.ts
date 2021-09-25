import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { isDate } from "lodash";
import { Connection } from "typeorm";

@Injectable()
export class ItemAddInfoTemplateService {
  private logger = new Logger("ItemAddinfoTemplate");
  constructor(private readonly conn: Connection) {}

  //ItemAddInfoTmplHdr
  async getItemAddInfoTmplHdr(CompCode): Promise<any> {
    try {
      let query = `CALL spGetItemAddInfoTmplHdr(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //ItemAddInfoTemplDtl
  async getItemAddInfoTmplDtl(CompCode: any, TempId: any): Promise<any> {
    try {
      let query = `CALL spGetItemAddInfoTmplDtl(?,?)`;
      const res = await this.conn.query(query, [CompCode, TempId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // async InsUpdtItemAddInfoTmplHdr(data: any): Promise<any> {
  //   // console.log(data,"data");
  //   try {
  //     const dataSource = data.Dtl;
  //     let query = `CALL spInsUpdtItemAddInfoTmplHdr(?,?,?,?,?,?)`;
  //     console.log(data);
  //     const res = await this.conn
  //       .query(query, [
  //         data.CompCode,
  //         data.Hdr.InsUpdtType,
  //         data.Hdr.TempId,
  //         data.Hdr.TemplateName,
  //         data.Hdr.IsActive,
  //         data.Hdr.updt_usrId,
  //       ])
  //       .then(async (res) => {
  //         try {
  //           let dtlQuery = `CALL spInsUpdtItemAddInfoTmplDtl (?,?,?,?,?,?,?,?)`;
  //           if (dataSource.length > 0) {
  //             dataSource.map(async (item) => {
  //               // console.log(item)
  //               const dtlRes = await this.conn.query(dtlQuery, [
  //                 res[0][0].TempId,
  //                 item.key,
  //                 item.FieldTitle,
  //                 item.DefaultValue,
  //                 item.IsReadOnly,
  //                 item.IsCompulsary,
  //                 item.orderBy === null ? null : parseInt(item.orderBy),
  //                 data.Hdr.updt_usrId,
  //               ]);
  //             });
  //           }

  //           let deleteQuery = `delete from item_addinfo_tmpl_dtl where TempId=${
  //             res[0][0].TempId
  //           } ${
  //             dataSource.length > 0
  //               ? `and SrNo NOT IN (${dataSource.map((i) => i.key)})`
  //               : ``
  //           };`;
  //           // console.log(deleteQuery)
  //           const deleteRes = await this.conn.query(deleteQuery);
  //           return res;
  //         } catch (err) {
  //           this.logger.error(err);
  //         }
  //       });
  //     return { message: "successful", data: res[0] };
  //   } catch (error) {
  //     this.logger.error(error);
  //     return { message: "unsuccessful", data: error };
  //     throw new InternalServerErrorException();
  //   }
  // }

  async InsUpdtItemAddInfoTmpl(data: any): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // console.log(data, "data");
    try {
      // console.log(data.Hdr, data.Dtl);
      //const dataSource = data.Dtl;
      let hdrQuery = `CALL spInsUpdtItemAddInfoTmplHdr(?,?,?,?,?,?)`;
      let l_templateId = 0;

      let l_hdrRes = await queryRunner
        .query(hdrQuery, [
          data.CompCode,
          data.Hdr.InsUpdtType,
          data.Hdr.TempId,
          data.Hdr.TemplateName,
          data.Hdr.IsActive,
          data.Hdr.updt_usrId,
        ])
        .catch(async (err) => {
          console.log(err, "some rror received - spInsUpdtItemAddInfoTmplHdr");
          await queryRunner.rollbackTransaction();
          return false;
        });

      l_templateId = l_hdrRes[0][0].TempId;

      data.Dtl.filter((i) => i.isDeleted === false).map(async (item, inx) => {
        await queryRunner
          .query(`CALL spInsUpdtItemAddInfoTmplDtl (?,?,?,?,?,?,?,?,?)`, [
            data.CompCode,
            l_templateId,
            item.SrNo,
            item.FieldTitle,
            item.DefaultValue,
            item.IsReadOnly,
            item.IsCompulsary,
            item.orderBy === null ? null : parseInt(item.orderBy),
            data.Hdr.updt_usrId,
          ])
          .catch(async (err) => {
            console.log(err, "Error on spInsUpdtItemAddInfoTmplDtl");
            await queryRunner.rollbackTransaction();
            return false;
          });
      });

      data.Dtl.filter((i) => i.isDeleted === true).map(async (item) => {
        await queryRunner
          .query("CALL spDeleteAddInfoTemplate(?,?)", [l_templateId, item.SrNo])
          .catch(async (err) => {
            console.log(err, "Error on spDeleteAddInfoTemplate");
            await queryRunner.rollbackTransaction();
            return false;
          });
      });

      await queryRunner.commitTransaction();
      return {
        message: "successful",
        data: { l_templateId },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return {
        message: "unsuccessful",
      };
    } finally {
      await queryRunner.release();
    }
  }
}
