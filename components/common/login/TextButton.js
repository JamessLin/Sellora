import React from 'react';
import {
    TouchableOpacity,
    Text
} from 'react-native';
import {COLORS , SIZES} from "../../../constants";

const TextButton = ({
    contentContainerStyle,
    disabled,
    label,
    
    labelStyle,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.theme1,
                ...contentContainerStyle
            }}
            disabled={disabled}
            onPress={onPress}
        >
            <Text style={{ color: "#fff", fontSize: SIZES.h3, lineHeight: 22 , ...labelStyle }}>
                {label}
            </Text>
            
        </TouchableOpacity>
    )
}

export default TextButton;