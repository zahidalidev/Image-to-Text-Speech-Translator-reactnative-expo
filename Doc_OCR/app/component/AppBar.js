import * as React from "react";
import { Modal, StyleSheet, View, TouchableOpacity, Text, TouchableWithoutFeedback, Share } from "react-native";
import { Appbar } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import Icon from "react-native-vector-icons/FontAwesome";
import IconM from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from 'expo-status-bar';
import * as StoreReview from 'expo-store-review';

import AppDrawer from "./AppDrawer";
import colors from "../config/colors";
import { RFPercentage } from "react-native-responsive-fontsize";

const AppBar = ({ navigation, showSearchBar }) => {

    const [searchQuery, setSearchQuery] = React.useState('');
    const [showSearch, setShowSearch] = React.useState(false);
    const [showAppBar, setShowAppBar] = React.useState(true);
    const [showCard, setShowCard] = React.useState(false)

    const handleMenu = () => {
        navigation.openDrawer();
    };
    const handleMore = () => {
        setShowCard(true)
    };
    const handleSearch = () => console.log('Searching');
    const onChangeSearch = query => setSearchQuery(query);

    const shareApp = async () => {
        await Share.share({
            message: 'React Native | A framework for building native apps using React',
        });
    }

    const rateApp = async () => {
        const CanRate = await StoreReview.isAvailableAsync();
        if (CanRate) {
            const res = StoreReview.requestReview();
            console.log('res', res, await StoreReview.hasAction())
        }
        StoreReview.requestReview();
    }

    return (
        <View>

            {/* Status Bar */}
            <StatusBar style="light" backgroundColor={colors.primary} />

            {showAppBar && <Appbar.Header style={styles.container} >
                <Appbar.Action size={RFPercentage(3.7)} icon="menu" onPress={handleMenu} />
                {/* <Icon name={"share-alt"} size={RFPercentage(3.7)} color={colors.primary} /> */}
                <Appbar.Content titleStyle={{ fontSize: RFPercentage(3.7) }} title="Doc OCR" />

                {showSearchBar ?
                    <Appbar.Action size={RFPercentage(3.7)} icon="magnify" onPress={() => {
                        setShowSearch(true);
                        setShowAppBar(false)
                    }} />
                    : null}

                <Appbar.Action size={RFPercentage(3.7)} icon="dots-vertical" onPress={handleMore} />
            </Appbar.Header>}

            {showSearch && <Appbar.Header style={styles.container} >
                <Appbar.Action size={RFPercentage(3.7)} icon="arrow-left" onPress={() => {
                    setShowSearch(false)
                    setShowAppBar(true)
                }} />
                <Searchbar
                    barTintColor="#2222221A"
                    style={styles.searchBar}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    iconColor="white"
                    placeholderTextColor={colors.lightGray}
                    selectionColor={colors.secondry}
                    inputStyle={{ color: colors.white }}
                />
            </Appbar.Header>}

            {/* left share and rate us popup buttons icons */}
            <View style={styles.modelContainer}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showCard}
                >
                    {/* to hide the modal */}
                    <TouchableWithoutFeedback onPress={() => setShowCard(false)}>
                        <View style={styles.modalOverlay} />
                    </TouchableWithoutFeedback>

                    <View style={styles.modelShareRateContainer}>
                        <View style={styles.verticalDotContainerCard} >
                            <View  >
                                <TouchableOpacity
                                    style={[styles.circleButtonSmall, styles.shadowEffect]}
                                    onPress={() => {
                                        rateApp()
                                        setShowCard(false)
                                    }}
                                >
                                    <View style={{ flexDirection: "row", padding: RFPercentage(1) }} >
                                        <IconM name={"star"} size={RFPercentage(2.7)} color={colors.primary} />
                                        <Text style={{ marginLeft: RFPercentage(2.4), marginTop: RFPercentage(0.4) }} >Rate Us</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            <View style={styles.circleContainerCenter} >
                                <TouchableOpacity
                                    style={[styles.circleButtonSmall, styles.shadowEffect]}
                                    onPress={() => {
                                        shareApp()
                                        setShowCard(false)
                                    }}
                                >
                                    <View style={{ flexDirection: "row", padding: RFPercentage(1) }} >
                                        <Icon name={"share-alt"} size={RFPercentage(2.7)} color={colors.primary} />
                                        <Text style={{ marginLeft: RFPercentage(2.4), marginTop: RFPercentage(0.4) }} >Share</Text>
                                    </View>
                                </TouchableOpacity>
                                <Text style={{ color: colors.mediumLightGray, paddingTop: RFPercentage(1.2) }} >App version 1.0.3</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({

    // to hide the overlay model
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },

    container: {
        backgroundColor: colors.primary
    },

    searchBar: {
        position: "absolute",
        backgroundColor: colors.primary,
        width: "75%",
        height: "80%",
        borderBottomWidth: 0.3,
        borderBottomColor: colors.lightGray,
        right: RFPercentage(2.4),
    },

    modelContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        // marginBottom: 230
    },
    modelShareRateContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        top: RFPercentage(5),
        right: RFPercentage(5)
    },

    verticalDotContainerCard: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        width: RFPercentage(17),
        height: RFPercentage(20),
        paddingBottom: RFPercentage(0.6)
    }
})
export default AppBar;