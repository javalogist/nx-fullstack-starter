import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

@Module({})
export class MongoConnectionModule {
    static forRootAsync(options: {
        connectionName: string;
        configKey: string;
    }): DynamicModule {
        const { connectionName, configKey } = options;

        const mongoModule = MongooseModule.forRootAsync({
            connectionName,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService): Promise<MongooseModuleOptions> => {
                const uri = configService.get<string>(configKey);
                if (!uri) {
                    throw new Error(
                        `[MongoConnectionModule] Missing MongoDB URI for config key: ${configKey}`,
                    );
                }
                return {
                    uri,
                    onConnectionCreate: (connection) => {
                        connection.on('connected', () =>
                            Logger.log(`✅ MongoDB [${connectionName}] connected at ${uri}`),
                        );
                        connection.on('error', (err) =>
                            Logger.error(`❌ MongoDB [${connectionName}] connection error:`, err),
                        );
                        connection.on('disconnected', () =>
                            Logger.warn(`⚠️ MongoDB [${connectionName}] disconnected!`),
                        );
                        connection.on('reconnected', () =>
                            Logger.log(`🔄 MongoDB [${connectionName}] reconnected!`),
                        );
                        return connection;
                    },
                };
            },
        });

        return {
            module: MongoConnectionModule,
            imports: [mongoModule],
            exports: [mongoModule],
        };
    }
}
