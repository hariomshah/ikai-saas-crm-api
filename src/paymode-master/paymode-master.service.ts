import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";
const moment = require("moment");
const _ = require("lodash");

@Injectable()
export class PaymodeMasterService {
  private logger = new Logger("PaymodeMasterService");
  constructor(
    private readonly conn: Connection,
    private sequenceConfig: SysSequenceConfigmasterService
  ) {}

  async getPayModeMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPayModeMaster(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtPayModeMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtPayModeMaster(?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.PayCode,
        data.PayDesc,
        data.IsActive,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //

  async InsUpdtPaymentModeMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtPaymentModeMaster(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.PayCode,
        data.PayDesc,
        data.IsPaymentGateway,
        data.PaymentGatewayComp,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.SysOption6,
        data.SysOption7,
        data.SysOption8,
        data.SysOption9,
        data.SysOption10,
        data.PaymentType,
        data.OpeningBalance === null ? null : parseFloat(data.OpeningBalance),
        data.IsActive,
        data.PrimaryPayCode,
        data.AsOfBalance,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //Created by Hari/Savrav/Goving/Sailee on 2021-03-02
  async getDataBankWalletGatewayBook(
    pCompCode: any,
    pPayCode: any,
    pAsOfDate: any
  ): Promise<any> {
    try {
      let query = `CALL spGetDataBankWalletGatewayBookSummary(?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        await pCompCode,
        pPayCode === "null" ? null : pPayCode,
        pAsOfDate,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  //hario on 2021-06-12
  async getDataCashBankSummary(pCompCode: any, pAsOfDate: any): Promise<any> {
    try {
      let query = `CALL spGetDataCashBankSummary(?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [pCompCode, pAsOfDate]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  //getDataBankWalletGatewayBookDetail
  //Created by Hari/Savrav/Goving/Sailee on 2021-03-02
  async getDataBankWalletGatewayBookDetail(
    pCompCode: any,
    pPayCode: any,
    pFromDate: any,
    pToDate: any
  ): Promise<any> {
    try {
      let query = `CALL spGetDataBankWalletGatewayBookDetail(?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        pCompCode,
        pPayCode,
        pFromDate,
        pToDate,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //
  async getDataCashBankTransferPayModes(CompCode): Promise<any> {
    try {
      let query = `CALL spGetDataCashBankTransferPayModes(?)`;

      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //
  async InsUpdtCashBankTransferOrAdjustments(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let l_TranNo;
      let l_TranId = data.TranId;

      if (_.includes([undefined, null, ""], data.TranNo)) {
        const seqData = {
          CompCode: data.CompCode,
          TranType:
            data.TranType === "TRNFR"
              ? "CB_TRNFR"
              : data.TranType === "ADJS"
              ? "CB_ADJS"
              : data.TranType === "CHQ"
              ? "CB_CHQ"
              : "",
          updt_usr: data.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );
        l_TranNo = TranNextTranNo.data[0].NextVal;
      } else {
        l_TranNo = data.TranNo;
      }

      let TranIdInfo = await queryRunner
        .query("call spV2InsReceiptHdr(?,?,?,?,?,?,?,?,?,?,?,?,?);", [
          data.CompCode,
          data.TranType,
          null,
          null,
          null,
          null,
          null,
          data.TranDate,
          l_TranNo,
          data.TranType === "TRNFR" ? 0 : data.Amount,
          0,
          data.Remark,
          data.UpdtUsr,
        ])
        .catch(async (err) => {
          // console.log(err, "Error on spV2InsReceiptHdr");
          // await queryRunner.rollbackTransaction();
          // return false;
          throw new InternalServerErrorException(err);
        });

      l_TranId = TranIdInfo[0][0].TranId;

      if (data.TranType === "TRNFR") {
        await queryRunner
          .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
            data.CompCode,
            l_TranId,
            data.SourcePayCode,
            parseFloat(data.Amount) * -1,
            `Transfer -> ${data.SourcePayCode} To ${data.DestinationPayCode}`,
            null,
            null,
            null,
            null,
            null,
            data.UpdtUsr,
          ])
          .catch(async (err) => {
            // console.log(err, "Error on spV2InsReceiptDtl");
            // await queryRunner.rollbackTransaction();
            // return false;
            throw new InternalServerErrorException(err);
          });

        await queryRunner
          .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
            data.CompCode,
            l_TranId,
            data.DestinationPayCode,
            parseFloat(data.Amount),
            `Transfer To -> ${data.DestinationPayCode} From ${data.SourcePayCode}`,
            null,
            null,
            null,
            null,
            null,
            data.UpdtUsr,
          ])
          .catch(async (err) => {
            // console.log(err, "Error on spV2InsReceiptDtl");
            // await queryRunner.rollbackTransaction();
            // return false;
            throw new InternalServerErrorException(err);
          });
      } else {
        await queryRunner
          .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
            data.CompCode,
            l_TranId,
            data.SourcePayCode,
            parseFloat(data.Amount),
            null,
            null,
            null,
            null,
            null,
            null,
            data.UpdtUsr,
          ])
          .catch(async (err) => {
            // console.log(err, "Error on spV2InsReceiptDtl");
            // await queryRunner.rollbackTransaction();
            // return false;
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      return {
        message: "successful",
        data: { TranId: l_TranId },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //getDataChequeSettlement
  async getDataChequeSettlement(
    pCompCode: any,
    pFromDate: any,
    pToDate: any
  ): Promise<any> {
    try {
      let query = `CALL spGetDataChequeSettlement(?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [pCompCode, pFromDate, pToDate]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtCheque_Deposit_Witdraw_ReOpen(pData: any): Promise<any> {
    try {
      let query = `CALL spUpdtCheque_Deposit_Witdraw_ReOpen(?,?,?,?,?,?)`;
      // console.log(data);
      const res = await this.conn.query(query, [
        pData.CompCode,
        pData.TranType,
        pData.DetailTranId,
        pData.ChequeTranDocId,
        pData.IsReOpen,
        pData.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async DeleteCashBankTransferOrAdjustments(data): Promise<any> {
    try {
      let query = `call spDeleteCashBankTransferOrAdjustments('${data.CompCode}','${data.TranId}')`;
      // console.log(RecieptId, query);
      const res = await this.conn.query(query);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
