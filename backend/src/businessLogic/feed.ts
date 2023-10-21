import { FeedAccess } from '../dataLayer/feedAcess'
import { FeedItem } from '../models/FeedItem'
import { CreateFeedRequest } from '../requests/CreateFeedRequest'
import { UpdateFeedRequest } from '../requests/UpdateFeedRequest'

import * as uuid from 'uuid'

const feedAccess = new FeedAccess()
const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const AWS_REGION = process.env.AWS_REGION

export async function getFeedsForUser(userId: string) {
    return await feedAccess.getFeedsForUser(userId)
}

export async function createFeedForUser(userId: string, item: CreateFeedRequest) {
    const feedId = uuid.v4()
    return await feedAccess.createFeedForUser(userId, {
        userId: userId,
        feedId: feedId,
        createdAt: new Date().toISOString(),
        content: item.content
    } )
}

export async function deleteFeed(userId: string, feedId: string) {
    return await feedAccess.deleteFeed(userId, feedId)
}

export async function updateFeed(userId: string, feedId: string, newData: UpdateFeedRequest) {
    return await feedAccess.updateFeeds(userId, feedId, newData)
}

export async function updateUrlForFeedItem(userId: string, feedId: string, attachmentId: string) {
    const feedItem = await feedAccess.getFeedForUserById(userId, feedId)
    const updatedDate = new Date().toISOString()
    const attachmentUrl  = `https://${s3_bucket}.s3.${AWS_REGION}.amazonaws.com/${attachmentId}`
    return await feedAccess.updateUrlForFeedItem(userId, feedId, {
            updatedAt: updatedDate,
            content: feedItem.content,
            attachmentUrl: attachmentUrl
    })
}