import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, StyleSheet, View, Image, ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Ionicons } from "@expo/vector-icons"
import { Picker } from '@react-native-community/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as Speech from 'expo-speech';
import { IconButton } from 'react-native-paper';
import Clipboard from "expo-clipboard"


import AppBar from '../component/AppBar';
import colors from '../config/colors';
import SpeechLangs from "../assets/languages/speechLanguages"
import { getTranslatedText, scanText } from '../http/api/api';


function ResultScreen(props) {

    const [text, setText] = useState('')
    const [translatedText, setTranslatedText] = useState('h')
    const [currentLanguage, setCurrentLanguage] = useState()
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(0);


    useEffect(() => {
        let latestText = props.route.params.data;
        let latestCount = props.route.params.count;

        if (latestCount != count) {
            setText(latestText)
            setTranslatedText('')
            setCount(latestCount)
        }
    })

    const handleTranslation = async (stop) => {
        const body = {
            text,
            to: currentLanguage
        };

        try {
            setLoading(true);
            const { data } = await getTranslatedText(body)
            setLoading(false);
            setTranslatedText(data)
        } catch (error) {
            setLoading(false);
            console.log("error: ", error)
        }
    }

    const swapText = () => {
        const temp = text;
        setText(translatedText)
        setTranslatedText(temp)
    }


    const handleTextToVoice = async (stop) => {
        const options = {
            language: currentLanguage
        };

        Speech.speak(translatedText, options)

    }

    const stopSpeech = () => {
        Speech.stop()

    }

    const pasteContent = async () => {
        const res = await Clipboard.getStringAsync();
        setText(res)
    }

    const copyContent = () => {
        Clipboard.setString(text)
    }

    const pasteContent_2 = async () => {
        const res = await Clipboard.getStringAsync();
        setTranslatedText(res)
    }

    const copyContent_2 = () => {
        Clipboard.setString(translatedText)
    }

    return (
        <View style={styles.mainContainer}>
            <AppBar showSearchBar={false} navigation={props.navigation} />
            {/* App Bar */}


            <Spinner
                color={colors.primary}
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: colors.primary, marginTop: -RFPercentage(5) }}
            />

            <ScrollView>


                <View style={{ marginTop: RFPercentage(4), width: "90%", marginLeft: "5%", alignItems: "center" }} >
                    <Text style={{ fontSize: RFPercentage(4), fontWeight: "bold", color: colors.primary }} >
                        Scanned Text
                    </Text>
                </View>
                <View style={styles.textAreaContainer} >
                    <TextInput
                        style={styles.textArea}
                        underlineColorAndroid="transparent"
                        placeholder="Type something"
                        placeholderTextColor="grey"
                        numberOfLines={9}
                        multiline={true}
                        textAlignVertical="top"
                        textAlign="left"
                        value={text}
                        onChangeText={(text) => setText(text)}
                    />

                    <View style={{ marginTop: -RFPercentage(0.3), flexDirection: "row", width: "100%", marginLeft: -RFPercentage(1.5) }} >
                        <IconButton
                            icon="content-paste"
                            color="grey"
                            size={RFPercentage(3.3)}
                            onPress={() => pasteContent()}
                        />
                        <IconButton
                            icon="content-copy"
                            color="grey"
                            size={RFPercentage(3.3)}
                            onPress={() => copyContent()}
                            style={{ marginLeft: RFPercentage(-1) }}
                        />
                        <IconButton
                            icon="backspace-outline"
                            color="grey"
                            size={RFPercentage(3.3)}
                            onPress={() => setText('')}
                            style={{ marginLeft: RFPercentage(-1) }}
                        />

                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: RFPercentage(3), width: "90%", marginLeft: "10%", alignItems: "center" }} >
                    <TouchableOpacity onPress={() => swapText()} style={{ flexDirection: "row", width: "40%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Ionicons style={{ marginRight: -RFPercentage(1.8), marginTop: RFPercentage(1.3) }} size={30} name="arrow-down" />
                        <Ionicons size={30} name="arrow-up" />
                    </TouchableOpacity>
                    <View style={{ width: "10%", alignItems: "flex-start", justifyContent: "flex-start" }} >
                        <Text numberOfLines={1} style={{ fontSize: RFPercentage(3), fontWeight: "bold", color: colors.primary }} >
                            To
                    </Text>
                    </View>
                    <View style={{ width: "50%", alignItems: "flex-start", justifyContent: "flex-start" }} >
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
                        placeholder="Translated Text"
                        placeholderTextColor="grey"
                        numberOfLines={9}
                        multiline={true}
                        textAlignVertical="top"
                        textAlign="left"
                        value={translatedText}
                        onChangeText={(text) => setTranslatedText(text)}
                    />

                    <View style={{ marginTop: -RFPercentage(0.5), marginLeft: RFPercentage(1), flexDirection: "row", width: "100%", alignItems: "flex-end", justifyContent: "flex-end" }} >
                        <View style={{ flexDirection: "row", width: "75%", marginLeft: -RFPercentage(1.5) }} >
                            <IconButton
                                icon="content-paste"
                                color="grey"
                                size={RFPercentage(3.3)}
                                onPress={() => pasteContent_2()}
                            />
                            <IconButton
                                icon="content-copy"
                                color="grey"
                                size={RFPercentage(3.3)}
                                onPress={() => copyContent_2()}
                                style={{ marginLeft: RFPercentage(-1) }}
                            />
                            <IconButton
                                icon="backspace-outline"
                                color="grey"
                                size={RFPercentage(3.3)}
                                onPress={() => setTranslatedText('')}
                                style={{ marginLeft: RFPercentage(-1) }}
                            />
                        </View>

                        <TouchableOpacity onPress={() => handleTextToVoice()} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3) }} >
                            <MaterialCommunityIcons name={"volume-high"} size={30} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => stopSpeech()} style={{ alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3) }} >
                            <MaterialCommunityIcons name={"volume-off"} size={30} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ marginBottom: RFPercentage(2), flexDirection: 'row', marginTop: RFPercentage(3), width: "90%", marginLeft: "5%", alignItems: "center", justifyContent: 'center' }} >
                    <TouchableOpacity activeOpacity={0.7} onPress={() => props.navigation.navigate('Home')} style={{ marginRight: RFPercentage(2), backgroundColor: "#af3d3d", alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.7} onPress={() => handleTranslation()} style={{ backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderRadius: RFPercentage(3), padding: RFPercentage(1.3), paddingLeft: RFPercentage(3), paddingRight: RFPercentage(3) }} >
                        <Text style={{ fontSize: RFPercentage(2), color: "white" }} >Translate</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        width: "100%"
    },

    textAreaContainer: {
        // flex: 1,
        width: "90%",
        marginLeft: "5%",
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        alignItems: 'flex-start',
        borderColor: colors.lightGray,
        borderWidth: 2,
        marginTop: RFPercentage(4),
        padding: RFPercentage(2),
        maxHeight: RFPercentage(28),
    },
    textArea: {
        width: "100%",
        maxHeight: RFPercentage(20),
        height: RFPercentage(20),
        fontSize: RFPercentage(2.2)
    }
})

export default ResultScreen;