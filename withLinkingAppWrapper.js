import * as React from 'react';
import {Alert, AppState, Platform} from 'react-native';
import RNFileShareIntent from 'react-native-file-share-intent';

function _withLinkingAppWrapper(WrappedComponent) {
  class HOC extends React.Component {
    contentUri: any = null;

    state = {
      appState: 'active',
    };

    componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);
      this.componentDidUpdate();
    }

    componentDidUpdate() {
      this._checkContentUri();
    }

    componentWillUnmount() {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        this.setState({refresh: 'active'}); // permit to have componentDidUpdate
      }
      if (nextAppState.match(/inactive|background/)) {
        this._clearContentUri();
        this.setState({refresh: 'inactive'}); // permit to have componentDidUpdate
      }
    };

    _checkContentUri = () => {
      if (this.state.appState === 'active' && this.contentUri === null) {
        RNFileShareIntent &&
          RNFileShareIntent.getFilePath((contentUri: any) => {
            if (contentUri) {
              this.contentUri = contentUri;

              Alert.alert(
                'Alert Title',
                `content uri = ${contentUri[0].uri}`,
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
              );
            }
          });
      }
    };

    _clearContentUri = () => {
      if (Platform.OS === 'android') {
        RNFileShareIntent.clearFilePath();
      }
      this.contentUri = null;
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return HOC;
}

export const withLinkingAppWrapper = WrappedComponent => {
  return _withLinkingAppWrapper(WrappedComponent);
};
