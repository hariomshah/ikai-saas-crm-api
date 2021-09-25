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

  const appConfig = config.get("appConfig");

  @Injectable()
export class DataSyncService {
    private readonly logger = new Logger(DataSyncService.name);
    constructor(private readonly conn: Connection) {}
}