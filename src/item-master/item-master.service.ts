import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class ItemMasterService {
  private logger = new Logger("ItemMaster");
  constructor(private readonly conn: Connection) {}

  async getItemMaster(pCompCode): Promise<any> {
    try {
      let query = `CALL spGetItemMaster (?)`;
      const res = await this.conn.query(query, [pCompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // getHelpSubCategory
  async getHelpSubCategory(CompCode): Promise<any> {
    try {
      let query = `CALL spGetItemHelpSubCategory (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getItemBarcode(CompCode: any, itemCode: any): Promise<any> {
    try {
      let query = `CALL spGetItemBarcode (?,?)`;
      const res = await this.conn.query(query, [CompCode, itemCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getItemImages(CompCode, ItemCode): Promise<any> {
    try {
      let query = `CALL spGetItemImages (?,?)`;
      const res = await this.conn.query(query, [CompCode, ItemCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getItemMasterCard(CompCode, ItemCode): Promise<any> {
    try {
      let query = `CALL spGetItemMasterCard (?,?)`;
      const res = await this.conn.query(query, [CompCode, ItemCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtItemMst(data: any): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let query = `CALL spInsUpdtItemMst (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.val.ItemCode,
        data.val.ItemName,
        data.val.ItemDesc,
        data.val.UnitCode,
        data.val.SubCategoryCode,
        data.val.BrandCode,
        data.val.classCode,
        data.val.IsActive,
        data.val.ProductType,
        data.val.PrintLabel,
        data.val.HSNSACCode,
        data.val.TaxCode,
        data.val.IsSaleOnMRP,
        data.val.MarkUpDown,
        data.val.MarkUpDownPV,
        data.val.Cost,
        data.val.MRP,
        data.val.SalePrice,
        data.val.SecondaryUnitCode,
        data.val.ConversionRate,
        data.val.updt_usrId,
        data.val.MaintainInventory,
        data.val.MBQ,
        data.val.LabelCopies,
        data.val.TaxType,
        data.val.MainItemCode,
        data.val.Var1,
        data.val.Var2,
        data.val.Var3,
        data.val.Var4,
        data.val.Var5,

      ]).catch(async (err) => {
        this.logger.error(err)
        await queryRunner.rollbackTransaction()
      });

      if (data.dData.length > 0) {
        data.dData.map(async (item) => {
          if (item.isDirty === false) {
            let Dquery = `delete from  item_barcode where compcode=${data.CompCode} and itemCode="${data.val.ItemCode}" and barcode="${item.barcode}";`;

            const Delres = await this.conn.query(Dquery, []).catch(async (err) => {
              this.logger.error(err)
              await queryRunner.rollbackTransaction()
            });;
          }
        });
      }


      let Bquery = `CALL spInsUpdtItemBarcode (?,?,?,?)`;
      if (data.bData.length > 0) {
        data.bData.map(async (item) => {
          await this.conn.query(Bquery, [
            data.CompCode,
            data.val.ItemCode,
            item.barcode,
            data.val.updt_usrId,
          ]).catch(async (err) => {
            this.logger.error(err)
            await queryRunner.rollbackTransaction()
          });
        });
      }


      if (data.idData.length > 0) {
        data.idData.map(async (item) => {
          if (item && item.isDirty === false) {
            let Dquery = `delete from  item_images where CompCode='${data.CompCode}' and ItemCode="${data.val.ItemCode}" and SrNo="${item.uid}";`;
            // console.log(Dquery)
            const Delres = await this.conn.query(Dquery, []).catch(async (err) => {
              this.logger.error(err)
              await queryRunner.rollbackTransaction()
            });
          }
        });
      }
      let Iquery = `CALL spInsUpdtItemImages(?,?,?,?,?,?,?)`;
      if (data.iData.length > 0) {
        data.iData.map(async (item) => {
          if (item.isDirty === true) {
            // console.log(Iquery)
            const Delres = await this.conn.query(Iquery, [
              data.CompCode,
              data.val.ItemCode,
              item.uid,
              item.name,
              item.pathType === "C" ? item.customUrl : item.url,
              item.pathType,
              data.val.updt_usrId,
            ]).catch(async (err) => {
              this.logger.error(err)
              await queryRunner.rollbackTransaction()
            });
          }
        });
      }
      await queryRunner.commitTransaction();
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      return { message: "unsuccessful", data: error };
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async getItemMasterData(CompCode, ItemCode): Promise<any> {
    try {
      let query = `CALL spGetDataItemMaster (?,?)`;
      const res = await this.conn.query(query, [CompCode, ItemCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getValidateItemBarcode(CompCode, Barcode, ItemCode): Promise<any> {
    try {
      let query = `CALL spValidateItemBarcode (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, Barcode, ItemCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getValidateItemMaster(CompCode, ItemCode): Promise<any> {
    try {
      let query = `CALL spValidateItemMaster (?,?)`;
      const res = await this.conn.query(query, [CompCode, ItemCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // Atul 2021-01-29
  async getDataItemAddInfoTemplate(
    CompCode,
    ItemCode,
    TemplateId
  ): Promise<any> {
    try {
      let query = `CALL spGetDataItemAddInfoTemplate (?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        ItemCode,
        TemplateId,
      ]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async saveItemMstAddInfoDtl(pData): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner
        .query("call spDeleteItmMstAddInfoDtl(?,?,?);", [
          pData.CompCode,
          pData.Hdrdata.ItemCode,
          pData.Hdrdata.TemplateId,
        ])
        .catch(async (err) => {
          console.log(err, "Error on spDeleteItmMstAddInfoDtl");
          await queryRunner.rollbackTransaction();
          return false;
        });

      let i = 0;
      for (i; i < pData.dtlData.length; i++) {
        await queryRunner
          .query("CALL spInsItemMstAddInfoDtl(?,?,?,?,?,?,?)", [
            pData.CompCode,
            pData.dtlData[i].ItemCode,
            pData.dtlData[i].FieldTitle,
            pData.dtlData[i].FieldValue,
            pData.dtlData[i].TemplId,
            pData.dtlData[i].TemplSrNo,
            pData.dtlData[i].UpdtUsr,
          ])
          .catch(async (err) => {
            console.log(err, "Error on spInsItemMstAddInfoDtl");
            await queryRunner.rollbackTransaction();
            return false;
          });
      }

      await queryRunner.commitTransaction();
      // console.log("received data", pData);
      return {
        message: "successful",
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getVariationTypesConfigHdr(CompCode): Promise<any> {
    try {
      let query = `CALL spGetVariationTypesConfigHdr(?)`;
      const res = await this.conn.query(query, [CompCode]);
      // console.log(res)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //spGetItemVariationConfigData
  async getItemVariationConfigData(CompCode): Promise<any> {
    try {
      let query = `CALL spGetItemVariationConfigData (?)`;
      const res = await this.conn.query(query, [CompCode]);
      // console.log(res, "data");
      return { message: "successful", data: res };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }


  async getDataItemVariants(CompCode, ItemCode): Promise<any> {
    try {
      let query = `CALL spGetDataItemVariants (?,?)`;
      const res = await this.conn.query(query, [CompCode, ItemCode]);
      // console.log(res, "data");
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
