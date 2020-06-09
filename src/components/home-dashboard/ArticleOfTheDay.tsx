//Node modules
import * as React from "react";
import * as Constants from "constants/Constants";
import { Component } from "react";
import { View, Text, Image, Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

//My components
import styles from "styles/Styles";
import { grabAllArticles, debugPrintScript } from "db/SelectScripts";
import { TouchableOpacity } from "react-native-gesture-handler";

interface IProps {}
interface IState {
  url: string;
  articleImage: any;
  articleTitle: string;
}

export default class ArticleOfTheDay extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      url: "",
      articleImage: <></>,
      articleTitle: "",
    };
  }

  componentDidMount() {
    this.fetchContentful();
  }

  async fetchContentful() {
    await debugPrintScript("SELECT * FROM articles ORDER BY RANDOM();");

    let rs = await grabAllArticles();
    if (rs != null && rs.rows.length > 0) {
      let item = rs.rows.item(0);
      let articleImageComponent = <></>;
      if (typeof item.articleImage !== "undefined") {
        articleImageComponent = (
          <Image
            style={{ flex: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
            source={{
              uri: "https:" + item.articleImage,
            }}
          />
        );
      }
      this.setState({
        url: item.url,
        articleImage: articleImageComponent,
        articleTitle: item.articleTitle,
      });
    }
  }

  render() {
    return (
      <>
        <View style={styles.homeDashboardHeading}>
          <Text style={styles.homeDashboardHeader}>{"Article of the day"}</Text>
        </View>

        <TouchableOpacity onPress={() => Linking.openURL(this.state.url)}>
          <LinearGradient
            colors={Constants.LINEAR_GRADIENT_MAIN}
            style={styles.homeDashboardArticleItem}
          >
            {/* <Text style={styles.homeDashboardHeader}>{"TEST"}</Text> */}
            <View style={{ flex: 2, alignSelf: "stretch" }}>
              {this.state.articleImage}
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: "stretch",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: Constants.COLOUR_WHITE,
                  fontSize: 15,
                }}
              >
                {this.state.articleTitle}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </>
    );
  }
}
