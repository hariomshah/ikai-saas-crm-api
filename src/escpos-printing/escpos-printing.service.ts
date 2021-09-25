import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
// const ThermalPrinter = require("node-thermal-printer").printer;
// const PrinterTypes = require("node-thermal-printer").types;
const escpos = require("escpos");

@Injectable()
export class EscposPrintingService {
  private logger = new Logger("EscposPrintingService");
  constructor(private readonly conn: Connection) {}

  async TestPrint(data): Promise<any> {
    try {
      const device = new escpos.USB();
      // const device  = new escpos.RawBT();
      // const device  = new escpos.Network('localhost');
      // const device  = new escpos.Serial('/dev/usb/lp0');
      const printer = new escpos.Printer(device);

      const options = { encoding: "GB18030", width: 80 /* default */ };
      // encoding is optional
      // let sss = await device.findPrinter();
      // console.log(sss)

    //   const printer = new escpos.Printer(device, options);
      device.open(function(error) {
        console.log("error", error);
      });
      console.log("pribnter", printer);

      // device.open(function(error){
      //     printer
      //     .font('a')
      //     .align('ct')
      //     .style('bu')
      //     .size(1, 1)
      //     .text('The quick brown fox jumps over the lazy dog')
      //     .text('敏捷的棕色狐狸跳过懒狗')
      //     .barcode('1234567', 'EAN8')
      //     .table(["One", "Two", "Three"])
      //     .tableCustom(
      //       [
      //         { text:"Left", align:"LEFT", width:0.33, style: 'B' },
      //         { text:"Center", align:"CENTER", width:0.33},
      //         { text:"Right", align:"RIGHT", width:0.33 }
      //       ],
      //       { encoding: 'cp857', size: [1, 1] } // Optional
      //     )
      //     .qrimage('https://github.com/song940/node-escpos', function(err){
      //       this.cut();
      //       this.close();
      //     });
      //   });

      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
