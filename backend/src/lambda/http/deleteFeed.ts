import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteFeed } from '../../businessLogic/feed'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const feedId = event.pathParameters.feedId
    // TODO: Remove a FEED item by id
    const userId = getUserId(event)

    try{
      await deleteFeed(feedId, userId)
      return {
        statusCode: 200,
        body: `delete feed ${feedId} success!`
      }
    }catch(e){
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: e
        })
      }
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
