import { StyleSheet } from "react-native";

import { COLORS, SIZES } from "../constants";

const styles = StyleSheet.create({
  

  searchContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    height: 50,
    marginTop: 25,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
 
  },
  searchInput: {
    fontSize: 25,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
    
  },

  
  searchContainer1: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    height: 200,
    marginTop: 20,
   
   
  },
  searchWrapper1: {
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
 
  },


  
  searchInput1: {
    fontSize: 15,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
   
  },

  searchContainer2: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",

    height: 100,
    marginTop: 20,
   
   
  },
  searchWrapper2: {
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
 
  },


  
  searchInput2: {
    fontSize: 15,
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
   
  },

}); 

export default styles;
