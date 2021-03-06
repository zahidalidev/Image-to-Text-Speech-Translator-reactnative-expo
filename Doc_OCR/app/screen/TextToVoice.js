import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, Text, TextInput, StyleSheet, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-community/picker';

import AppBar from '../component/AppBar';
import colors from '../config/colors';
import SpeechLangs from "../assets/languages/speechLanguages"


function TextToVoice({ navigation }) {

    const [text, setText] = useState('')
    const [stop, setStop] = useState(false)
    const [icon, setIcon] = useState()
    const [currentLanguage, setCurrentLanguage] = useState()

    const handleTextToVoice = async (stop) => {
        const options = {
            language: currentLanguage
        };

        Speech.speak(text, options)

    }

    const stopSpeech = () => {
        Speech.stop()

    }

    return (
        <View style={styles.mainContainer}>
            <AppBar showSearchBar={false} navigation={navigation} />
            {/* App Bar */}

            <View style={{ marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                <Text style={{ fontSize: RFPercentage(4), fontWeight: "bold", color: colors.primary }} >
                    Voice To Text
                </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: RFPercentage(4), width: "90%", marginLeft: "10%", alignItems: "center" }} >
                <View style={{ width: "45%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                    <Text numberOfLines={1} style={{ fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                        Select Language
                    </Text>
                </View>
                <View style={{ width: "55%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                    <Picker
                        selectedValue={currentLanguage}
                        style={{ height: 50, width: RFPercentage(20) }}
                        onValueChange={(itemValue, itemIndex) =>
                            setCurrentLanguage(itemValue)
                        }
                    >
                        {SpeechLangs.map((lang, i) => (
                            <Picker.Item key={i} label={lang.name} value={lang.code} />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.textAreaContainer} >
                <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="Type something"
                    placeholderTextColor="grey"
                    numberOfLines={25}
                    multiline={true}
                    textAlignVertical="top"
                    textAlign="left"
                    onChangeText={(text) => setText(text)}
                />
            </View>
            <View style={{ flexDirection: 'row', marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center", justifyContent: 'center' }} >
                <TouchableOpacity onPress={() => handleTextToVoice()} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3) }} >
                    <MaterialCommunityIcons name={"volume-high"} size={35} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => stopSpeech()} style={{ marginLeft: RFPercentage(2), alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3) }} >
                    <MaterialCommunityIcons name={"volume-off"} size={35} color={colors.primary} />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },

    textAreaContainer: {
        width: "90%",
        marginLeft: "5%",
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        alignItems: 'flex-start',
        borderColor: colors.lightGray,
        borderWidth: 2,
        marginTop: RFPercentage(4),
        padding: RFPercentage(2)
    },
    textArea: {
        width: "100%",
        fontSize: RFPercentage(2.2)
    }
})

export default TextToVoice;