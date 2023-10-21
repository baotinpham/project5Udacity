import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { FeedItem } from '../models/FeedItem'
import { CreateFeedRequest } from '../requests/CreateFeedRequest';
import { UpdateFeedRequest } from '../requests/UpdateFeedRequest';
const AWSXRay = require("aws-xray-sdk");

const XAWS = AWSXRay.captureAWS(AWS)


export class FeedAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly feedsTable = process.env.FEEDS_TABLE,
        private readonly logger = createLogger('feeds-access')) {
    }

    async getFeedsForUser(userId:string):Promise<FeedItem[]>{
        const rs = await this.docClient.query({
            TableName: this.feedsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()


        const items = rs.Items
        return items as FeedItem[]
    }

    async getFeedForUserById(userId: string, feedId: string): Promise<FeedItem> {
        const result = await this.docClient.query({
            TableName: this.feedsTable,
            KeyConditionExpression: 'userId = :userId AND feedId = :feedId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':feedId': feedId
            }
        }).promise()

        const items = result.Items
        return items[0] as FeedItem
    }

    async createFeedForUser(userId:string, item: FeedItem):Promise<FeedItem>{
        await this.docClient.put({
            TableName: this.feedsTable,
            Item: item
        }).promise()

        return item;
    }

    async deleteFeed(userId: string, feedId: string) {
        await this.docClient.delete({
            TableName: this.feedsTable,
            Key: { userId, feedId }
        }).promise()
    }

    async updateFeeds(userId: string, feedId: string, newFeed: UpdateFeedRequest){
        const current = this.getFeedForUserById(userId, feedId)

        if (!current) {
            throw new Error(`Feed ${feedId} not found`)
        }

        await this.docClient.update({
            TableName: this.feedsTable,
            Key: {
                userId: userId,
                feedId: feedId
            },
            UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':content': newFeed.content,
                ':updatedAt': newFeed.updatedAt
            }
        }).promise()
        
    }

    async updateUrlForFeedItem(userId: string, feedId: string, newData: UpdateFeedRequest) {
        const current = this.getFeedForUserById(userId, feedId)

        if (!current) {
            throw new Error(`Feed ${feedId} not found`)
        }

        await this.docClient.update({
            TableName: this.feedsTable,
            Key: {
                userId: userId,
                feedId: feedId
            },
            UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': newData.attachmentUrl
            }
        }).promise()
    }
}