import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ReceipeMasterService {
  private logger = new Logger("ReceipeMasterService");
  constructor(private readonly conn: Connection) { }

  async getReceipeHDR(CompCode): Promise<any> {
    try {
      let query = `CALL spGetReceipeHDR(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  //getReceipeMenuVariationInfo
  async getReceipeMenuVariationInfo(pCompCode, pMenuCode): Promise<any> {
    try {
      let query = `CALL spValidateMenuVariation(?,?)`;
      const res = await this.conn.query(query, [pCompCode, pMenuCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  //getRestaurantGetRecipeConsumptionDtl
  async getRestaurantGetRecipeConsumptionDtl(
    pCompCode,
    pBranchCode,
    pMenuCode
  ): Promise<any> {
    try {
      let query = `CALL spRestaurantGetRecipeConsumptionDtl(?,?,?)`;
      const res = await this.conn.query(query, [pCompCode, pBranchCode, pMenuCode]);
      // console.log(res);
      return { message: "successful", data: [res[0], res[1]] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getReceipeDTL(CompCode, MenuCode): Promise<any> {
    try {
      let query = `CALL spGetReceipeDTL(?,?)`;
      const res = await this.conn.query(query, [CompCode, MenuCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtReceipeMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtReceipeHDR(?,?,?,?)`;
      // console.log(data,"hdrdata")
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.MenuCode,
        data.updt_usrId,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtReceipesMaster(data: any): Promise<any> {
    try {
      let res = [];
      if (data.Hdr.isDirty === true) {
        let query = `CALL spInsUpdtReceipeDTL(?,?,?,?,?,?)`;
        // console.log(data, "saved data");
        res = await this.conn.query(query, [
          data.Hdr.CompCode,
          data.Hdr.InsUpdtType,
          data.Hdr.MenuCode,
          data.Hdr.ItemCode,
          data.Hdr.Quantity,
          data.Hdr.updt_usrId,
        ]);
      }

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtReceipeManager(data: any): Promise<any> {
    try {
      let query = `CALL spRestaurantInsUpdtReciepeMgmtHdr (?,?,?,?,?,?,?,?)`;
      await this.conn
        .query(query, [
          data.reciepeHdr.CompCode,
          data.reciepeHdr.ReciepeId,
          data.reciepeHdr.BranchCode,
          data.reciepeHdr.MenuCode,
          data.reciepeHdr.Ingredients,
          data.reciepeHdr.CookingSteps,
          data.reciepeHdr.Remark,
          data.updtUsr,
        ])
        .then((res) => {
          data.reciepeDtl.map((item) => {
            let query = `CALL spRestaurantInsUpdtReciepeMgmtDtl (?,?,?,?,?,?,?,?)`;
            this.conn.query(query, [data.reciepeHdr.CompCode,
            data.reciepeHdr.ReciepeId !== 0
              ? data.reciepeHdr.ReciepeId
              : res[0][0].ReciepeId,
            item.ItemCode,
            item.VariationCode,
            item.UnitCode,
            item.ConsumptionQty,
            item.Remark,
            data.updtUsr,
            ]);
          });
        });
      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async DeleteReciepeMgmtDtl(data: any): Promise<any> {
    try {
      // console.log(data, "ss");
      if (data.isDirty === true && data.IsDeleted == "Y" && data.FromDatabase) {
        let query = `CALL spDeleteReciepeMgmtDtl(?,?,?)`;
        this.conn.query(query, [data.CompCode, data.RecipeId, data.ItemCode]);
      }
      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
