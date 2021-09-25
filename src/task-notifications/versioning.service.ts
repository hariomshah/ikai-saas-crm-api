import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Patch,
} from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import mysqldump from "mysqldump";
import * as moment from "moment";
import * as fs from "fs";
import * as config from "config";
import { Connection } from "typeorm";

//Patches start
import { patches } from "./versions/_patches";
//Patches end
var compareVersions = require("compare-versions");

const appConfig = config.get("appConfig");

@Injectable()
export class VersioningService {
  private readonly logger = new Logger(VersioningService.name);
  constructor(private readonly conn: Connection) {}

  @Timeout(0.1 * 1000 * 60)
  handleTimeout() {
    try {
      let query = `Select Value1 DBVer from config Where ConfigCode = 'DBVER'`;
      this.conn.query(query, []).then((res) => {
        // console.log(
        //   res[0].DBVer,
        //   appConfig.CurrentAPIVersion,
        //   compareVersions(res[0].DBVer, appConfig.CurrentAPIVersion)
        // );
        const dbVer = res[0].DBVer;
        patches.map((ver) => {
          if (compareVersions.compare(dbVer, ver.version, "<")) {
            ver.data.map((patch) => {
              let errorDesc = "";

              query = patch.script;
              this.conn
                .query(query, [])
                .catch((err) => {
                  console.error(err.sqlMessage);
                  errorDesc = err.sqlMessage;
                })
                .finally(() => {
                  query = "CALL spInsDBVerPatches(?,?,?,?,?,?,?,?,?)";
                  this.conn.query(query, [
                    patch.patchId,
                    ver.version,
                    patch.desc,
                    patch.preparedBy,
                    patch.prepareOn,
                    patch.validateBy,
                    patch.validateOn,
                    errorDesc === "" ? "SUCCESS" : "FAIL",
                    errorDesc === "" ? null : errorDesc,
                  ]);
                });
              // console.log("valid patch id's", patch.patchId, patch.desc);
            });

            query = `Update config Set Value1 = '${ver.version}' Where ConfigCode = 'DBVER'`;
            this.conn.query(query, []);
          }
        });
      });

      this.logger.debug("Called once after 1 VersioningService");
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
