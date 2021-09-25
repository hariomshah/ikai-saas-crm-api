import { Controller, Logger, Post, Get, Body } from "@nestjs/common";
import { EmployeeService } from "./employee.service";

import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(AuthGuard())
@Controller("employee")
export class EmployeeController {
  private logger = new Logger("EmployeeController");

  constructor(private employee: EmployeeService) {}
  @Post("insUpdtEmployeeMaster")
  insUpdtEmployeeMaster(@Body("data") data: any): Promise<any> {
    return this.employee.insUpdtEmployeeMaster(data);
  }
  @Post("getEmployees")
  getEmployees(@Body("CompCode") CompCode: any): Promise<any> {
    return this.employee.getEmployees(CompCode);
  }
}
