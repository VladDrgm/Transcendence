// import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
// import { CookieParserMiddleware } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';

// @Module({
//   providers: [AuthService],
//   controllers: [AuthController],
// })
// export class AuthModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CookieParserMiddleware).forRoutes('*'); // Apply cookie parser to all routes
//   }
// }
