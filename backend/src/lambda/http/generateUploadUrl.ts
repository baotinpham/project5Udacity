import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import { createPresignedUrl } from '../../helpers/attachmentUtils'
import { updateUrlForFeedItem } from '../../businessLogic/feed'

const s3_bucket = process.env.ATTACHMENT_S3_BUCKET
const AWS_REGION = process.env.AWS_REGION

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const feedId = event.pathParameters.feedId
    // TODO: Return a presigned URL to upload a file for a FEED item with the provided id
    const userId = getUserId(event)

    const attachmentId = uuid.v4()
    const presignedUrl: string = await createPresignedUrl(attachmentId)

    await updateUrlForFeedItem(userId, feedId, attachmentId)

    return {
        statusCode: 200,
        body: JSON.stringify({
          'uploadUrl': presignedUrl
        })
      }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
