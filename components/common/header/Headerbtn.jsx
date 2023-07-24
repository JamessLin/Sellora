import React from 'react'
import { TouchableOpacity, Image } from 'react-native'

import styles from './screenheader.style'

const HeaderBtn = ({ icons, sizes, handleclick }) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={handleclick}>
      <Image
        source={icons}
        resizeMode='cover'
        style={styles.btnImg(sizes)} />
    </TouchableOpacity>
  )
}

export default HeaderBtn