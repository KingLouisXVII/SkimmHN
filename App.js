import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, RefreshControl, FlatList, Linking, TouchableHighlight, WebView, ActivityIndicator } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Web from './components/Web';
import Comments from './components/Comments';
import Settings from './components/Settings';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262525',
  },
  story: {
    backgroundColor: '#262525',
    margin: 9
  },
  header: {
    fontSize: 33,
    fontWeight: '100',
    paddingTop: '3%',
    backgroundColor: '#FF6600',
    marginTop: -3
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 6,
    marginLeft: 6,
    fontFamily: 'Hiragino Sans',
    color: '#FF6600'
  },
  commentCount: {
    fontSize: 16,
    paddingLeft: 6,
    marginLeft: 6,
    fontFamily: 'Hiragino Sans',
    color: '#BF360C'
  }
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stories: [],
      refreshing: false,
    }
  }

  componentDidMount() {
    this.fetchTopStories();
  }

  fetchTopStories = () => {
    fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    .then(result => result.json())
    .then(array => array.slice(0,49))
    .then(topstories =>  {
      topstories.map(story =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`)
        .then(r => r.json())
        .then(r => {
          this.setState({
            stories: [...this.state.stories, r],
            refreshing: false
          });
          }
        )
      );
      }
    )
    .catch(function (err) {
      return console.log(err);
    });
  }

  static navigationOptions = ({navigation}) => {
        return {
          title: 'SkimmHN',
          headerStyle: {backgroundColor: '#262525', borderBottomColor: '#263238'},
          headerTitleStyle: {fontWeight: 'bold',fontSize: 33,fontFamily: 'Verdana',color: '#BF360C'},
    };
  }

  onRefresh = () => {
    this.setState({stories: [], refreshing: true});
    this.fetchTopStories();
  }

  renderSeparator = () => {
   return (
     <View
       style={{
         height: 1,
         backgroundColor: "#263238",
         width: '86%',
         marginLeft: '7%',
         marginRight: '7%',
       }}
     />
   );
};

  render() {
    return (
      <View style={styles.container}>
        <FlatList
            data={this.state.stories}
            extraData={this.state}
            style={styles.container}
            keyExtractor={item => item.id.toString()}
            ItemSeparatorComponent={this.renderSeparator}
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />}
            renderItem={({item}) =>
                  <View style={styles.story}>
                      <Text
                        style={styles.text}
                        onPress={() => this.props.navigation.navigate('Comments', {story: item})}
                      >
                      {item.title}
                      </Text>
                      <Text style={styles.commentCount} onPress={() => this.props.navigation.navigate('Comments', {story: item})}>
                      {
                        (item.kids ? item.kids.length : 0)
                        +
                        (item.kids && item.kids.length===1?" comment" : " comments")
                      }
                      </Text>
                  </View>
              }
              />
      </View>
    );
  }
}


const MainStack = createStackNavigator(
  {
   Home: {
      screen: Home,
    }
  },
  {
  initialRouteName: 'Home',
  }
);
const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainStack,
    },
    Comments: {
      screen: Comments,
    },
    WebView: {
      screen: Web,
    },
    Settings: {
      screen: Settings,
    },
  },
  {
    mode: 'card',
    headerMode: 'none',
  }
);
const AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
