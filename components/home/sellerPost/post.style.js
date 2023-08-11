import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {


  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 21,
  },
  headerTitle: {

    fontSize: 20,
    fontFamily: 'Avenir-Book',
    color: COLORS.main,

  },
  headerBtn: {
    fontSize: 13,
    marginTop: 6,
    color: COLORS.black,
  },
  cardsContainer: {
    marginTop: 10,
    gap: SIZES.small,

    height: '93%',

  },
  postUser: {
    fontWeight: 500,

    marginBottom: 8,
    fontSize: 15
  },
  postTitle: {
    fontWeight: 700,

    fontSize: 17
  },
});

export default styles;
