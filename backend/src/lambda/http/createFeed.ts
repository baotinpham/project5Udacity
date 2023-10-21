import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateFeedRequest } from '../../requests/CreateFeedRequest'
import { getUserId } from '../utils';
import { createFeedForUser } from '../../businessLogic/feed'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const newFeed: CreateFeedRequest = JSON.parse(event.body)
        // TODO: Implement creating a new FEED item
        const userId = getUserId(event)
        const item = await createFeedForUser(userId, newFeed)

        return {
        statusCode: 201,
        body: JSON.stringify({
            item
        })
        }
    }   
)

handler.use(
  cors({
    credentials: true
  })
)
