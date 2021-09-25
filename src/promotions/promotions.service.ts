import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { async } from "rxjs/internal/scheduler/async";
import { Connection } from "typeorm";

@Injectable()
export class PromotionsService {
  private logger = new Logger("PromotionService");

  constructor(private readonly conn: Connection) {}

  async getPromotion(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPromotion(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async InsUpdtPromotions(data): Promise<any> {
    // console.log(data.promoIE.Exclusive, data.promoIE.Inclusive);
    try {
      let query = `CALL spInsUpdtPromotion(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.PromotionCode,
        data.BranchCode,
        data.PromotionType,
        data.SchemeType,
        data.PromotionName,
        data.PromotionDesc,
        data.DiscountType,
        data.DiscountValue === "" ? null : data.DiscountValue,
        data.FromQty === "" ? null : data.FromQty,
        data.ToQty === "" ? null : data.ToQty,
        data.DiscQty === "" ? null : data.DiscQty,
        data.FromAmount === "" ? null : data.FromAmount,
        data.ToAmount === "" ? null : data.ToAmount,
        data.MaxDiscount === "" ? null : data.MaxDiscount,
        data.TaxIncludeExclude,
        data.IsActive,
        data.updt_usr,
      ]);
      if (data.promoIE) {
        let prmdata = [...data.promoIE.Exclusive, ...data.promoIE.Inclusive];
        // console.log(prmdata, "promo data");
        let query = `CALL spInsUpdtPromotionsIEConfig(?,?,?,?,?,?,?,?)`;
        prmdata.forEach(async (i, index) => {
          // console.log(i);
          if (i.IsDeleted === "N" && i.IsDirty) {
            const res = await this.conn.query(query, [
              data.CompCode,
              data.PromotionCode,
              data.BranchCode,
              i.IEType,
              i.SrNo ? parseInt(i.SrNo) : index + 1,
              i.IETypeCode,
              i.IEValue,
              data.updt_usr,
            ]);
          } else if (i.IsDeleted === "Y") {
            let query = `CALL spDeletePromoIEConfig(?,?,?,?,?)`;
            const res = await this.conn.query(query, [
              data.CompCode,
              data.PromotionCode,
              data.BranchCode,
              i.IEType,
              i.SrNo,
            ]);
          }
        });
      }
      if (data.promoSchData) {
        let prmdata = [...data.promoSchData];
        // console.log(prmdata);
        let query = `CALL spInsUpdtPromotionSchedule(?,?,?,?,?,?,?,?,?)`;
        prmdata.forEach(async (i, index) => {
          if (i.IsChecked && i.IsDirty) {
            const res = await this.conn.query(query, [
              data.CompCode,
              data.PromotionCode,
              data.BranchCode,
              i.SchDay,
              i.FromDate,
              i.ToDate,
              i.FromTime,
              i.ToTime,
              data.updt_usr,
            ]);
          } else {
            if (
              prmdata.find((ii) => ii.SchDay === "ALL").IsChecked ||
              (i.SchDay === "ALL" && i.IsChecked === false)
            ) {
              let query = `CALL spDeletePromotionSchedule(?,?,?,?)`;
              const res = await this.conn.query(query, [
                data.CompCode,
                data.PromotionCode,
                data.BranchCode,
                i.SchDay,
              ]);
            }
          }
        });
      }
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getPromotionIEData(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPromotionIEData(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getSelectQuery(CompCode,query): Promise<any> {
    // console.log(query);
    try {
      const res = await this.conn.query(`Call '${CompCode}','${query}'`);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getPromotionIEConfig(pCompCode, pBranchCode, pPromoCode): Promise<any> {
    try {
      let query = `Call spGetPromotionIEConfig(?,?,?)`;
      const res = await this.conn.query(query, [
        pCompCode,
        pBranchCode,
        pPromoCode,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPromotionSchedule(pCompCode, pBranchCode, pPromoCode): Promise<any> {
    try {
      let query = `Call spGetPromotionsSchedule(?,?,?)`;
      const res = await this.conn.query(query, [
        pCompCode,
        pBranchCode,
        pPromoCode,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  // async InsUpdtPromotionsIEConfig(data): Promise<any> {
  //   try {
  //     let query = `CALL spInsUpdtPromotionsIEConfig(?,?,?,?,?,?,?,?)`;
  //     const res = await this.conn.query(query, [
  //       data.CompCode,
  //       data.PromotionCode,
  //       data.BranchCode,
  //       data.IEType,
  //       data.SrNo,
  //       data.IETypeCode,
  //       data.IEValue,
  //       data.updt_usr,
  //     ]);
  //     return { message: "successful", data: res[0] };
  //   } catch (error) {
  //     this.logger.error(error);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
