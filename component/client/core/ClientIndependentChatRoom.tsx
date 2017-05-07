import * as React from "react";

import ClientChat from "./ClientChat";

import * as Constants from "../../Constants";

interface IClientIndependentChatRoomState {
  username: string;
  currentUrl: string;
}

class ClientIndependentChatRoom extends React.Component<any, IClientIndependentChatRoomState> {
  private storage;

  private static getCurrentTabUrl(callback) {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
      callback(tabs[0] ? tabs[0].url : undefined);
    });
  }

  constructor() {
    super();
    this.state = {
      currentUrl: Constants.NOOP_URL,
      username: Constants.NOOP_USERNAME
    };
    this.storage = (chrome.extension.getBackgroundPage() as any).BackgroundStorageService;
    this.switchRoom = this.switchRoom.bind(this);
    this.storage.get("username").then((username) => {
      if (username) {
        this.setState({
          username
        });
      }
    });
    ClientIndependentChatRoom.getCurrentTabUrl((url) => {
      if (url) {
        this.setState({
          currentUrl: url
        });
      }
    });
  }

  public render() {
    return <ClientChat url={this.state.currentUrl} username={this.state.username} switchRoom={this.switchRoom}/>;
  }

  public switchRoom(url: string) {
    this.setState({currentUrl: url});
  }
}

export default ClientIndependentChatRoom;