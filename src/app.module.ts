import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './routes/user/user.module';
import { AuthModule } from './routes/auth/auth.module';
import { JwtAuthGuard } from './routes/auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './routes/auth/guards/role-auth.guard';
import { NotificationModule } from './routes/notification/notification.module';
import { PostModule } from './routes/post/post.module';
import { TrainingDateModule } from './routes/training_dates/training_date.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: process.env.NODE_ENV === 'production',
    }),
    UserModule,
    AuthModule,
    NotificationModule,
    PostModule,
    TrainingDateModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
