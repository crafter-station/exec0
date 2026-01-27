import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const marshallOptions = {
  removeUndefinedValues: true,
};

export class DynamoDBTable {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async create(record: Record<string, any>) {
    await dynamoDBClient.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(record, marshallOptions),
      }),
    );
    return record;
  }

  async read(key: Record<string, any>) {
    const result = await dynamoDBClient.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall(key, marshallOptions),
      }),
    );
    return result.Item ? unmarshall(result.Item) : null;
  }

  async update(
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
  ) {
    const result = await dynamoDBClient.send(
      new UpdateItemCommand({
        TableName: this.tableName,
        Key: marshall(key, marshallOptions),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: marshall(
          expressionAttributeValues,
          marshallOptions,
        ),
        ReturnValues: "ALL_NEW",
      }),
    );
    return result.Attributes ? unmarshall(result.Attributes) : {};
  }

  async delete(key: Record<string, any>) {
    await dynamoDBClient.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: marshall(key, marshallOptions),
      }),
    );
  }

  async query(
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    indexName?: string,
  ) {
    const result = await dynamoDBClient.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: marshall(
          expressionAttributeValues,
          marshallOptions,
        ),
      }),
    );
    return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
  }
}

export default dynamoDBClient;
