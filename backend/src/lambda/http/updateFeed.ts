import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateFeed } from '../../businessLogic/feed'
import { UpdateFeedRequest } from '../../requests/UpdateFeedRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const feedId = event.pathParameters.feedId
    const updatedFeed: UpdateFeedRequest = JSON.parse(event.body)

    const userId = getUserId(event)
    try{
      const item = await updateFeed(userId, feedId, updatedFeed)
      return {
        statusCode: 201,
        body: ''
      }
    }catch(e) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          erorr: e
        })
      }
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
