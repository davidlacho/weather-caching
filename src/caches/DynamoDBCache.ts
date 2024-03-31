import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall, marshall } from '@aws-sdk/util-dynamodb';
import { ICache } from './ICache';

export class DynamoDBCache implements ICache {
  private client: DynamoDBClient;

  constructor(private tableName: string) {
    if (!process.env.AWS_REGION) {
      throw new Error('AWS_REGION is required');
    }

    this.client = new DynamoDBClient({ region: process.env.AWS_REGION });
  }

  async get<T>(key: string): Promise<T | null> {
    const params = {
      TableName: this.tableName,
      Key: marshall({ key }),
    };

    const { Item } = await this.client.send(new GetItemCommand(params));
    return Item ? (unmarshall(Item) as T) : null;
  }

  async set<T>(key: string, value: T, ttl: number = 600): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: marshall({
        key,
        value,
        ttl: Math.floor(Date.now() / 1000) + ttl,
      }),
    };

    await this.client.send(new PutItemCommand(params));
  }
}
