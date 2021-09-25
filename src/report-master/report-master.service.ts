import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ReportMasterService {
  private logger = new Logger("reportMastreService");

  constructor(private readonly conn: Connection) {}

  async getReportDetails(CompCode, pReportId): Promise<any> {
    try {
      let query = `CALL spGetReportDetails (?,?)`;
      const res = await this.conn.query(query, [CompCode, pReportId]);
      // console.log(res)
      return { message: "successful", data: res };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getReportDetailsData(data): Promise<any> {
    try {
      let query = data.query;
      let param = [data.CompCode];
      if (data.parameter !== null && data.parameter.length > 0) {
        data.parameter.forEach((element) => {
          param.push(element.data);
        });
      }
      let res = [];

      if (param.length > 0) {
        res = await this.conn.query(query, param);
      } else {
        res = await this.conn.query(query);
      }
      console.log(res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getParamSelectQuery(query): Promise<any> {
    try {
      // let query = data.query;
      // let param = [];
      // data.parameter.forEach(element => {
      //     param.push(element.data)
      // });
      // console.log(query)
      const res = await this.conn.query(query, []);
      // console.log(res)
      return { message: "successful", data: res };
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getReportHdrDtl(CompCode): Promise<any> {
    try {
      // let query = data.query;
      // let param = [];
      // data.parameter.forEach(element => {
      //     param.push(element.data)
      // });
      // console.log(query)
      const res = await this.conn.query(`call spGetReportHdrDtl(${CompCode})`);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getSysReportPrintHdr(CompCode): Promise<any> {
    try {
      const res = await this.conn.query(
        `call spGetSysReportPrintHdr(${CompCode})`,
        []
      );
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getSysReportChartHdr(CompCode): Promise<any> {
    try {
      const res = await this.conn.query(
        `call spGetSysReportChartHdr(${CompCode})`
      );
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //updtSystemReportConfigs
  async updtSystemReportConfigs(data): Promise<any> {
    try {
      if (data.ReportHdr) {
        await this.conn
          .query("call spUpdtSystemReportHdr(?,?,?,?,?,?,?,?,?,?,?)", [
            data.CompCode,
            data.ReportHdr.ReportId,
            data.ReportHdr.ReportName,
            data.ReportHdr.ReportDesc,
            data.ReportHdr.ReportSource,
            data.ReportHdr.hasView,
            data.ReportHdr.hasGraph,
            data.ReportHdr.hasPrintable,
            data.ReportHdr.ReportGroup,
            data.ReportHdr.IsActive,
            data.ReportHdr.UpdtUsr,
          ])
          .catch((err) => console.log(err, "hdr error"));
      }

      if (data.ReportColConfig.length > 0) {
        data.ReportColConfig.forEach(async (row) => {
          await this.conn.query(
            "call spUpdtSystemReportColConfig(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.CompCode,
              row.Id,
              row.ReportId,
              row.ColumnTitle,
              row.ColumnWidth,
              row.ColumnPosition,
              row.ColumnFixed,
              row.ColumnAllowFilter,
              row.ColumnAlign,
              row.ColumnShowToolTip,
              row.ColumnParentName,
              row.ColumnShowSummary,
              row.ColumnSummaryType,
              row.UpdtUsr,
            ]
          );
        });
      }

      // console.log(res)
      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
