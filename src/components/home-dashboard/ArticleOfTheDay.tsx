//Node modules
import * as React from "react";
import { Component } from "react";
import { View, Text, ScrollView } from "react-native";

//My components
import styles from "styles/Styles";
import { fetchArticleOfTheDay } from "contentful-api/ContentfulData";

interface IProps {}
interface IState {}

export default class ArticleOfTheDay extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //this.fetchContentful();
  }

  async fetchContentful() {
    //await fetchArticleOfTheDay();
  }

  render() {
    return (
      <>
        <View style={styles.homeDashboardHeading}>
          <Text style={styles.homeDashboardHeader}>{"Article of the day"}</Text>
        </View>

        <View style={styles.homeDashboardArticleItem}>
          <Text style={styles.homeDashboardHeader}>{"TEST"}</Text>
        </View>
      </>
    );
  }
}
