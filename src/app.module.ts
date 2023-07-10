import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [MongooseModule.forRoot("mongodb+srv://kumol:kumol264@cluster0.tsazd.mongodb.net/attendance?retryWrites=true&w=majority", {
    connectionFactory(connection, name) {
      try {
        connection.on('connected', (err) => {
          console.log('DB is connected');
        });
        connection._events.connected();
        return connection;
      } catch (error) {
        console.log(error);
      }
      // connection._events.error();

    },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
