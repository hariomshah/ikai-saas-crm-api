import {
  Controller,
  Logger,
  Post,
  Request,
  Res,
  Param,
  Get,
  Body,
  HttpStatus,
} from "@nestjs/common";
import { PaymentGatewayService } from "./payment-gateway.service";
import { Response } from "express";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";

@Controller("payment-gateway")
export class PaymentGatewayController {
  private logger = new Logger("PaymentGatewayController");
  constructor(private paymentGateway: PaymentGatewayService) {}

  // @Post("razorpay")
  // razorpay(@Request() request: Request, @Res() res: Response) {
  //   console.log("event occured", request.body);
  //   let ddd = JSON.parse(JSON.stringify(request.body));
  //   console.log("stringifu", ddd.payload);
  //   return res.json({ status: "ok" });
  // }

  @Get("GetOnlinePaymentRequest/:CompCode/:PaymentRequestId")
  GetOnlinePaymentRequest(
    @Param("CompCode") CompCode: any,
    @Param("PaymentRequestId") PaymentRequestId: any
  ): Promise<any> {
    return this.paymentGateway.GetOnlinePaymentRequest(CompCode,PaymentRequestId);
  }

  @Get("checkServiceOrderPaymentStatus/:CompCode/:OrderId")
  checkServiceOrderPaymentStatus(
    @Param("CompCode") CompCode: any,
    @Param("OrderId") OrderId: any): Promise<any> {
    return this.paymentGateway.checkServiceOrderPaymentStatus(CompCode,OrderId);
  }

  @Get("GetPaymentGatewayOptionsAndConfig/:CompCode")
  GetPaymentGatewayOptionsAndConfig(@Param("CompCode") CompCode: any): Promise<any> {
    return this.paymentGateway.GetPaymentGatewayOptionsAndConfig(CompCode);
  }

  @Post("razorPayReqGenerate")
  razorPayReqGenerate(
    @Body("CompCode") CompCode: any,
    @Body("PaymentTypeCode") PaymentTypeCode: any,
    @Body("Amount") Amount: any,
    @Body("RefernceNo") RefernceNo: any
  ): Promise<any> {
    // console.log(data)
    return this.paymentGateway.razorPayReqGenerate(
      CompCode,
      PaymentTypeCode,
      Amount,
      RefernceNo
    );
  }

  @Post("updtOnlinePaymentRequestResponse")
  updtOnlinePaymentRequestResponse(@Body("data") data: any): Promise<any> {
    // console.log(data)
    return this.paymentGateway.updtOnlinePaymentRequestResponse(data);
  }

  @UseGuards(AuthGuard())
  @Post("InsOnlinePaymentRequest")
  InsOnlinePaymentRequest(@Body("data") data: any): Promise<any> {
    // console.log(data)
    return this.paymentGateway.InsOnlinePaymentRequest(data);
  }

  @Post("serviceBookingPaymentSuccess")
  serviceBookingPaymentSuccess(
    @Body("CompCode") CompCode: any,
    @Body("orderId") orderId: any,
    @Body("paymentRequestId") paymentRequestId: any,
    @Body("UpdtUserId") UpdtUserId: any
  ): Promise<any> {
    return this.paymentGateway.serviceBookingPaymentSuccess(
      CompCode,
      orderId,
      paymentRequestId,
      UpdtUserId
    );
  }
}
