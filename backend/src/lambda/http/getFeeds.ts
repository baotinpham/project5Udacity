import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getFeedsForUser as getFeedsForUser} from '../../businessLogic/feed'
import { getUserId } from '../utils';

// TODO: Get all FEED items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const feeds = await getFeedsForUser(userId)
    try {

        const items = await getFeedsForUser(userId)
        return {
          statusCode: 200,
          body: JSON.stringify({
            items
          })
        }
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid Parameters'
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)