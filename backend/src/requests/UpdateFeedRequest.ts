/**
 * Fields in a request to update a single FEED item.
 */
export interface UpdateFeedRequest {
  content: string
  updatedAt: string
  attachmentUrl?: string
}