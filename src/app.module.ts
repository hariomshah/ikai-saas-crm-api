import { Module, HttpModule } from "@nestjs/common";

import { ScheduleModule } from "@nestjs/schedule";

import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { HelpModule } from "./help/help.module";
import { LoginModule } from "./login/login.module";
import { OrdersModule } from "./orders/orders.module";
import { AppMainModule } from "./app-main/app-main.module";
import { EmployeeModule } from "./employee/employee.module";
import { UserMasterModule } from "./user-master/user-master.module";

import { ServiceModule } from "./service/service.module";
import { OtherMasterModule } from "./other-master/other-master.module";
import { SlotModule } from "./slot/slot.module";
import { ChangeModule } from "./change/change.module";
import { OrderportalModule } from "./orderportal/orderportal.module";
import { HomescreenModule } from "./homescreen/homescreen.module";
import { LocationmasterModule } from "./locationmaster/locationmaster.module";
import { ConfigModule } from "./config/config.module";
import { UserloginlogsModule } from "./userloginlogs/userloginlogs.module";
import { PackagemasterModule } from "./packagemaster/packagemaster.module";
import { ServiceslotlocationmapModule } from "./serviceslotlocationmap/serviceslotlocationmap.module";
import { ServiceratemapModule } from "./serviceratemap/serviceratemap.module";
import { CountryMasterModule } from "./country-master/country-master.module";
import { StateMasterModule } from "./state-master/state-master.module";
import { CitymasterModule } from "./citymaster/citymaster.module";
import { NotificationCenterModule } from "./notification-center/notification-center.module";
import { TaskNotificationsModule } from "./task-notifications/task-notifications.module";
import { NotifyEventsModule } from "./notify-events/notify-events.module";
import { NotifyEmailService } from "./notify-email/notify-email.service";
import { NotifySmsService } from "./notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "./notify-push-notification/notify-push-notification.service";
import { NotifyEventsService } from "./notify-events/notify-events.service";
import { SubCategoryMasterModule } from "./sub-category-master/sub-category-master.module";
import { CategorymasterModule } from "./categorymaster/categorymaster.module";
import { ManufacturermasterModule } from "./manufacturermaster/manufacturermaster.module";
import { BrandmasterModule } from "./brandmaster/brandmaster.module";
import { TaxMasterModule } from "./tax-master/tax-master.module";
import { HsnsacMasterModule } from "./hsnsac-master/hsnsac-master.module";

import { UnitmasterModule } from "./unitmaster/unitmaster.module";
import { ItemMasterModule } from "./item-master/item-master.module";
import { CompmainModule } from "./compmain/compmain.module";
import { BranchmasterModule } from "./branchmaster/branchmaster.module";
import { DeptmasterModule } from "./deptmaster/deptmaster.module";

import { ItemAddInfoTemplateModule } from "./item-add-info-template/item-add-info-template.module";
import { TablesMasterModule } from "./tables-master/tables-master.module";
import { HomescreenAppLayoutModule } from "./homescreen-app-layout/homescreen-app-layout.module";
import { SysSequenceConfigmasterModule } from "./sys-sequence-configmaster/sys-sequence-configmaster.module";
import { SectionMasterModule } from "./section-master/section-master.module";
import { RestaurantPosModule } from "./restaurant-pos/restaurant-pos.module";
import { ClassMasterModule } from "./class-master/class-master.module";
import { MenuMasterModule } from "./menu-master/menu-master.module";
import { PaymodeMasterModule } from "./paymode-master/paymode-master.module";
import { MenucategoryMasterModule } from "./menucategory-master/menucategory-master.module";
import { MenuvariationsMasterModule } from "./menuvariations-master/menuvariations-master.module";
import { ReceipeMasterModule } from "./receipe-master/receipe-master.module";
import { ReportMasterModule } from "./report-master/report-master.module";
import { RecieptController } from "./reciept/reciept.controller";
import { RecieptModule } from "./reciept/reciept.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { PromotionsController } from "./promotions/promotions.controller";
import { PromotionsService } from "./promotions/promotions.service";
import { PromotionsModule } from "./promotions/promotions.module";
import { CustomerOutstandingModule } from "./customer-outstanding/customer-outstanding.module";
import { HtmlReportsModule } from "./html-reports/html-reports.module";
import { FeedbackController } from "./feedback/feedback.controller";
import { FeedbackService } from "./feedback/feedback.service";
import { FeedbackModule } from "./feedback/feedback.module";
import { PaymentGatewayController } from "./payment-gateway/payment-gateway.controller";
import { PaymentGatewayModule } from "./payment-gateway/payment-gateway.module";
import { SelfOrderController } from "./self-order/self-order.controller";
import { SelfOrderModule } from "./self-order/self-order.module";
// import { EscposPrintingModule } from './escpos-printing/escpos-printing.module';
import { KeyboardHotkeyConfigModule } from "./keyboard-hotkey-config/keyboard-hotkey-config.module";
import { ConfigTableQrService } from "./config-table-qr/config-table-qr.service";
import { ConfigTableQrController } from "./config-table-qr/config-table-qr.controller";
import { ConfigTableQrModule } from "./config-table-qr/config-table-qr.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { EventsModule } from "./events/events.module";
import { MulterModule } from "@nestjs/platform-express";
import { FileUploadsModule } from "./file-uploads/file-uploads.module";
import { InventoryModule } from "./inventory/inventory.module";
import { SupplierMasterModule } from "./supplier-master/supplier-master.module";
import { TransactionTypeMasterModule } from "./transaction-type-master/transaction-type-master.module";
import { PaymentMasterModule } from "./payment-master/payment-master.module";
import { RoundOffConfigModule } from "./round-off-config/round-off-config.module";
import { AppLayoutModule } from "./app-layout/app-layout.module";
import { AppLayoutUsersService } from "./app-layout-users/app-layout-users.service";
import { AppLayoutUsersController } from "./app-layout-users/app-layout-users.controller";
import { AppLayoutUsersModule } from "./app-layout-users/app-layout-users.module";
import { AppRouteModule } from "./app-route/app-route.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      exclude: ["/api*"],
    }),
    AuthModule,
    HelpModule,
    LoginModule,
    OrdersModule,
    AppMainModule,
    EmployeeModule,
    UserMasterModule,
    ServiceModule,
    OtherMasterModule,
    SlotModule,
    ChangeModule,
    OrderportalModule,
    HomescreenModule,
    LocationmasterModule,
    ConfigModule,
    UserloginlogsModule,
    PackagemasterModule,
    ServiceslotlocationmapModule,
    CountryMasterModule,

    ServiceratemapModule,

    StateMasterModule,

    CitymasterModule,

    NotificationCenterModule,

    TaskNotificationsModule,

    NotifyEventsModule,

    HttpModule,

    CategorymasterModule,
    ManufacturermasterModule,
    SubCategoryMasterModule,

    BrandmasterModule,
    TaxMasterModule,

    HsnsacMasterModule,

    UnitmasterModule,

    ItemMasterModule,

    CompmainModule,

    BranchmasterModule,

    DeptmasterModule,

    ItemAddInfoTemplateModule,

    TablesMasterModule,
    HomescreenAppLayoutModule,
    SysSequenceConfigmasterModule,
    SectionMasterModule,
    RestaurantPosModule,
    ClassMasterModule,
    MenuMasterModule,
    PaymodeMasterModule,
    MenucategoryMasterModule,
    MenuvariationsMasterModule,
    ReportMasterModule,
    ReceipeMasterModule,
    RecieptModule,
    DashboardModule,
    PromotionsModule,
    CustomerOutstandingModule,
    HtmlReportsModule,
    FeedbackModule,
    PaymentGatewayModule,
    SelfOrderModule,
    // EscposPrintingModule,
    KeyboardHotkeyConfigModule,
    ConfigTableQrModule,
    EventsModule,
    FileUploadsModule,
    InventoryModule,
    SupplierMasterModule,
    TransactionTypeMasterModule,
    PaymentMasterModule,
    RoundOffConfigModule,
    AppLayoutModule,
    AppLayoutUsersModule,
    AppRouteModule,
  ],
  providers: [
    NotifyEmailService,
    NotifySmsService,
    NotifyPushNotificationService,
    NotifyEventsService,
    PromotionsService,
    FeedbackService,
    ConfigTableQrService,
    AppLayoutUsersService,
  ],
  controllers: [
    FeedbackController,
    SelfOrderController,
    ConfigTableQrController,
    AppLayoutUsersController,
  ],
})
export class AppModule {}
