import { View, TextInput } from 'react-native'

import {  COLORS, SIZES } from "../../../constants";

const FormInputs = ({
    containerStyle,
    inputContainerStyle,
    placeholder,
    inputStyle,
    value = "",
    preprendComponent,
    appendComponent,
    onChange,
    onPress,
    editable,
    secureTextEntry,
    keyboardType = "default",
    autoCompleteType = "off",
    autoCapitalize = "none",
    maxLength,
    placeholderTextColor = COLORS.gray2,
    multiline,
    numberOfLines,
}) => {
    return (
        <View style={{ ...containerStyle }}>
            <View style={{
                flexDirection: "row",
             
                paddingHorizontal: SIZES.radius,
                borderRadius: SIZES.radius,
                alignItems: 'center',
                ...inputContainerStyle
            }}>
                {preprendComponent}
                <TextInput style={{
                    flex: 1,
                    paddingVertical: 0,
                    fontSize: SIZES.body3, lineHeight: 20, ...inputStyle

                }}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCompleteType={autoCompleteType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    onChangeText={(text) => onChange(text)}
                    onPress={onPress}
                    editable={editable}
                    multiline={multiline}
                    numberOfLines={numberOfLines}

                />
                {appendComponent}
            </View>
        </View>
    )
}

export default FormInputs;