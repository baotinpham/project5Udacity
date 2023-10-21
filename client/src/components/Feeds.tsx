import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFeed, deleteFeed, getFeeds, patchFeed } from '../api/feeds-api'
import Auth from '../auth/Auth'
import { Feed } from '../types/Feed'

interface FeedsProps {
  auth: Auth
  history: History
}

interface FeedsState {
  feeds: Feed[]
  newFeedName: string
  loadingFeeds: boolean
}

export class Feeds extends React.PureComponent<FeedsProps, FeedsState> {
  state: FeedsState = {
    feeds: [],
    newFeedName: '',
    loadingFeeds: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFeedName: event.target.value })
  }

  onEditButtonClick = (feedId: string) => {
    this.props.history.push(`/feeds/${feedId}/edit`)
  }

  onFeedCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newFeed = await createFeed(this.props.auth.getIdToken(), {
        content: this.state.newFeedName
      })
      this.setState({
        feeds: [...this.state.feeds, newFeed],
        newFeedName: ''
      })
    } catch {
      alert('Feed creation failed')
    }
  }

  onFeedDelete = async (feedId: string) => {
    try {
      await deleteFeed(this.props.auth.getIdToken(), feedId)
      this.setState({
        feeds: this.state.feeds.filter(feed => feed.feedId !== feedId)
      })
    } catch {
      alert('Feed deletion failed')
    }
  }

  // onFeedCheck = async (pos: number) => {
  //   try {
  //     const feed = this.state.feeds[pos]
  //     await patchFeed(this.props.auth.getIdToken(), feed.feedId, {
  //       name: feed.name,
  //       dueDate: feed.dueDate,
  //       done: !feed.done
  //     })
  //     this.setState({
  //       todos: update(this.state.todos, {
  //         [pos]: { done: { $set: !todo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Todo deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const feeds = await getFeeds(this.props.auth.getIdToken())
      this.setState({
        feeds,
        loadingFeeds: false
      })
    } catch (e) {
      alert(`Failed to fetch feeds: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">FEEDs</Header>

        {this.renderCreateFeedInput()}

        {this.renderFeeds()}
      </div>
    )
  }

  renderCreateFeedInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onFeedCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFeeds() {
    if (this.state.loadingFeeds) {
      return this.renderLoading()
    }

    return this.renderFeedsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading FEEDs
        </Loader>
      </Grid.Row>
    )
  }

  renderFeedsList() {
    return (
      <Grid padded>
        {this.state.feeds.map((feed, pos) => {
          return (
            <Grid.Row key={feed.feedId}>
              <Grid.Column width={10} verticalAlign="middle">
                {feed.content}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {feed.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(feed.feedId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFeedDelete(feed.feedId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {feed.attachmentUrl && (
                <Image src={feed.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
