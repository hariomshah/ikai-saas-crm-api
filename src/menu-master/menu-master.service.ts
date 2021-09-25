import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
@Injectable()
export class MenuMasterService {
  private logger = new Logger("MenuMaster");

  constructor(private readonly conn: Connection) {}

  async getMenuMaster(CompCode): Promise<any> {
    try {
      let query = `CALL spGetMenuMaster (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getMenuImages(CompCode, ItemCode): Promise<any> {
    try {
      let query = `CALL spGetMenuImages (?,?)`;
      const res = await this.conn.query(query, [CompCode, ItemCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtMenuMst(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtMenuMst (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      // console.log(data, "here")
      const res = await this.conn.query(query, [
        data.CompCode,
        data.val.MenuCode,
        data.val.ShortCode,
        data.val.MenuName,
        data.val.MenuDesc,
        data.val.DietType,
        data.val.UnitCode,
        data.val.MenuCatCode,
        data.val.MenuGroupCode,
        data.val.HSNSACCode,
        data.val.TaxCode,
        data.val.ApplyForDineIn,
        data.val.ApplyForPickUp,
        data.val.ApplyForDelivery,
        data.val.ApplyForOnline,
        data.val.IsActive,
        data.val.updt_usrId,
      ]);

      // if (data.dData.length > 0) {
      //   data.dData.map(async (item) => {
      //     if (item.isDirty === false) {
      //       let Dquery = `delete from  item_barcode where itemCode="${data.val.ItemCode}" and barcode="${item.barcode}";`

      //       const Delres = await this.conn.query(Dquery, []);
      //     }
      //   })
      // }

      // // console.log(data.bData, "bdata")
      // let Bquery = `CALL spInsUpdtItemBarcode (?,?,?)`;
      // if (data.bData.length > 0) {
      //   data.bData.map(async (item) => {
      //     const Barres = await this.conn.query(Bquery, [
      //       data.val.ItemCode,
      //       item.barcode,
      //       data.val.updt_usrId,
      //     ]);
      //   })
      // }

      // console.log(data)

      if (data.idData.length > 0) {
        data.idData.map(async (item) => {
          if (item.isDirty === false) {
            let Dquery = `delete from  menumaster_images where CompCode=${data.CompCode} and MenuCode="${data.val.MenuCode}" and SrNo="${item.uid}";`;
            // console.log(Dquery)
            const Delres = await this.conn.query(Dquery, []);
          }
        });
      }

      let Iquery = `CALL spInsUpdtMenuImages(?,?,?,?,?,?)`;
      if (data.iData.length > 0) {
        data.iData.map(async (item) => {
          if (item.isDirty === true) {
            // console.log(Iquery)
            const Delres = await this.conn.query(Iquery, [
              data.CompCode,
              data.val.MenuCode,
              item.uid,
              item.name,
              item.url,
              data.val.updt_usrId,
            ]);
          }
        });
      }

      let Varquery = `CALL spInsUpdtMenuVariation(?,?,?,?,?,?)`;
      if (data.variationType.length > 0) {
        data.variationType.map(async (item) => {
          if (item.isDirty === true) {
            // console.log(Iquery)
            const Varres = await this.conn.query(Varquery, [
              data.CompCode,
              data.val.MenuCode,
              item.value,
              item.isDirty,
              item.defValue,
              data.val.updt_usrId,
            ]);
          }
        });
      }

      let Addquery = `CALL spInsUpdtMenuAddOn(?,?,?,?,?,?)`;
      if (data.addOn.length > 0) {
        data.addOn.map(async (item) => {
          if (item.isDirty === true) {
            // console.log(Iquery)
            const Addres = await this.conn.query(Addquery, [
              data.CompCode,
              data.val.MenuCode,
              item.value,
              item.isDirty,
              item.defValue,
              data.val.updt_usrId,
            ]);
          }
        });
      }

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      return { message: "unsuccessfull", data: error };
      throw new InternalServerErrorException();
    }
  }

  async getMenuAddonHdr(CompCode): Promise<any> {
    try {
      let query = `CALL spGetMenuAddonHdr(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //MenuAddonDtl
  async getMenuAddonDtl(CompCode): Promise<any> {
    try {
      let query = `CALL spGetMenuAddonDtl(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtMenuAddonHdr(data: any): Promise<any> {
    try {
      // console.log(data, "ss");
      let query = `CALL spInsUpdtMenuAddonHdr (?,?,?,?,?)`;
      const res = await this.conn
        .query(query, [
          data.CompCode,
          data.AddOnCode,
          data.AddOnName,
          data.IsActive,
          data.updt_usrId,
        ])
        .catch((err) => {
          console.log(err);
          throw err;
        });

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtMenuAddonDtl(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsUpdtMenuAddonDtl (?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.Id,
        data.AddOnCode,
        data.ItemName,
        data.Rate,
        data.AddInfo,
        data.IsActive,
        data.updt_usrId,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getMenuMasterCard(CompCode, MenuCode): Promise<any> {
    try {
      let query = `CALL spGetMenuMstCard (?,?)`;
      const res = await this.conn.query(query, [CompCode, MenuCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getHelpMenuCategory(CompCode): Promise<any> {
    try {
      let query = `CALL spGetMenuHelpCategory (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getMenuRateMapp(CompCode, BranchCode, DeptCode, SecCode): Promise<any> {
    try {
      let query = `CALL spGetMenuRateMap (?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        DeptCode,
        SecCode,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getMenuAddOnTab(CompCode, MenuCode): Promise<any> {
    try {
      let query = `CALL spGetMenuAddOnTab (?,?)`;
      const res = await this.conn.query(query, [CompCode, MenuCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getMenuVariationTab(CompCode, MenuCode): Promise<any> {
    try {
      let query = `CALL spGetMenuVariationTab (?,?)`;
      const res = await this.conn.query(query, [CompCode, MenuCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async insUpdtMenuRateMapp(data: any): Promise<any> {
    // console.log(data);
    try {
      data.MenuRateMapp.map((item) => {
        let query = `CALL spInsUpdtMenuRateMapp (?,?,?,?,?,?,?)`;
        this.conn
          .query(query, [
            data.CompCode,
            item.BranchCode,
            item.DeptCode,
            item.SecCode,
            item.MenuCode,
            item.Rate,
            data.updtUsr,
          ])
          .catch((err) => {
            console.log(err);
          });
      });

      data.MenuRateVarMapp.map((item) => {
        let query = `CALL spInsUpdtMenuRateMappVar (?,?,?,?,?,?,?,?)`;
        this.conn.query(query, [
          data.CompCode,
          item.BranchCode,
          item.DeptCode,
          item.SecCode,
          item.MenuCode,
          item.VariationCode,
          item.Rate,
          data.updtUsr,
        ]);
      });

      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
