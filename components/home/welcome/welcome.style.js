import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {

    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  container1: {

    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },

  welcome: {

    fontSize: 24, fontFamily: 'Avenir-Book'
  },
  welcome2: {
    color: COLORS.gray, fontSize: 16,
    fontFamily: 'Avenir-Book',
  },
  searchContainer: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",

    height: 50,
    marginBottom: 10,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,

    
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 14,
    
    height: "100%",
    width:"100%",
  
    paddingHorizontal:20,
    borderWidth:1,
    borderColor: COLORS.border,

  },
  searchInput: {

    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,

  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.theme1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnImage: {
    width: "50%",
    height: "50%",
    tintColor: COLORS.border
  },




  
  tabsContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: SIZES.small,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  tab: (activeType, item) => ({
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 1,
    borderColor: activeType === item ? COLORS.theme1 : COLORS.border,
    backgroundColor: activeType === item ? COLORS.theme1 : COLORS.transparent
  }),
  tabText: (activeType, item) => ({

    color: activeType === item ? COLORS.white : COLORS.border,
  }),
});

export default styles;
