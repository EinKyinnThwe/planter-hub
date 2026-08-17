import React, { useEffect, useState } from 'react';

import {
    ScrollView,
    View,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
    logButtonClick,
    logScreenView,
    logErrorToCrashlytics,
} from '../services/analyticsService';

import LocationHeader from '../components/LocationHeader';
import SearchBar from '../components/SearchBar';
import PromoBanner from '../components/PromoBanner';
import SectionHeader from '../components/SectionHeader';
import CategoryChip from '../components/CategoryChip';
import CategoryGridItem from '../components/CategoryGridItem';
import PlantCard from '../components/PlantCard';

import useCart from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import useProducts from '../hooks/useProducts';
import useNotifications from '../hooks/useNotifications';

import {
    CATEGORY_CHIPS,
    CATEGORIES,
} from '../data/categories';

import {
    COLORS,
    SPACING,
    FONT_SIZES,
} from '../constants/theme';

const HomeScreen = ({ navigation }) => {
    const {
        totalItems,
    } = useCart();

    const {
        isFavorite,
        toggleFavorite,
    } = useFavorites();

    const {
        products,
        loading,
        error,
    } = useProducts();

    const {
        unreadCount,
    } = useNotifications();

    const [search, setSearch] =
        useState('');

    const [activeChip, setActiveChip] =
        useState('All');

    useEffect(() => {
        logScreenView('HomeScreen');
    }, []);

    const handleCartPress = () => {
        console.log(
            'Home Cart button pressed!'
        );

        console.log(
            'Root routes:',
            navigation
                .getParent()
                ?.getState()
                ?.routeNames
        );

        // NAVIGATION FIRST
        navigation.navigate('Cart');

        // ANALYTICS SECOND
        logButtonClick(
            'cart',
            'HomeScreen'
        );
    };

    const handleNotificationsPress = () => {
        console.log(
            'Notifications button pressed!'
        );

        navigation.navigate(
            'Notifications'
        );

        logButtonClick(
            'notifications',
            'HomeScreen'
        );
    };

    const handleFilterPress = () => {
        logButtonClick(
            'filter',
            'HomeScreen'
        );
    };

    const handlePromoPress = () => {
        navigation.navigate(
            'AllProducts',
            {
                title:
                    'Special Promo For You',
                initialCategory:
                    activeChip,
            }
        );

        logButtonClick(
            'promo_shop',
            'HomeScreen',
            {
                promo_percent: '25',
            }
        );
    };

    const handleRecommendedSeeAll =
        () => {
            navigation.navigate(
                'AllProducts',
                {
                    title:
                        'Recommended for You',
                }
            );

            logButtonClick(
                'recommended_see_all',
                'HomeScreen'
            );
        };

    const handleCategorySeeAll =
        () => {
            navigation.navigate(
                'AllProducts',
                {
                    title:
                        'Shop by Category',
                }
            );

            logButtonClick(
                'category_see_all',
                'HomeScreen'
            );
        };

    const handleSpecialOffersSeeAll =
        () => {
            navigation.navigate(
                'AllProducts',
                {
                    title:
                        'Special Offers',

                    initialCategory:
                        activeChip,
                }
            );

            logButtonClick(
                'special_offers_see_all',
                'HomeScreen'
            );
        };

    const openDetail = (plant) => {
        console.log(
            'Opening product:',
            plant.id
        );

        navigation.navigate(
            'PlantDetail',
            {
                plant,
            }
        );

        logButtonClick(
            'product_click',
            'HomeScreen',
            {
                product_id:
                    String(plant.id),

                product_name:
                    plant.name
                        ? String(plant.name)
                        : undefined,

                category:
                    plant.category
                        ? String(
                            plant.category
                        )
                        : undefined,
            }
        );
    };

    const handleToggleFavorite =
        (plant) => {
            const currentlyFavorite =
                isFavorite(plant.id);

            toggleFavorite(plant.id);

            logButtonClick(
                currentlyFavorite
                    ? 'remove_favorite'
                    : 'add_favorite',
                'HomeScreen',
                {
                    product_id:
                        String(plant.id),
                }
            );
        };

    const handleCategoryPress =
        (category) => {
            setActiveChip(
                category.label
            );

            logButtonClick(
                'category_click',
                'HomeScreen',
                {
                    category:
                        String(
                            category.label
                        ),
                }
            );
        };

    const handleCategoryChipPress =
        (category) => {
            setActiveChip(category);

            logButtonClick(
                'category_filter_click',
                'HomeScreen',
                {
                    category:
                        String(category),
                }
            );
        };

    const handleSearchChange =
        (value) => {
            setSearch(value);
        };

    useEffect(() => {
        if (error) {
            logErrorToCrashlytics(
                error,
                'HomeScreen - Failed to load products'
            );
        }
    }, [error]);

    const filteredPlants =
        activeChip === 'All'
            ? products
            : products.filter(
                (p) =>
                    p.category ===
                    activeChip
            );

    if (loading) {
        return (
            <SafeAreaView
                style={[
                    styles.safeArea,
                    styles.centered,
                ]}
            >
                <ActivityIndicator
                    size="large"
                    color={COLORS.primary}
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading plants…
                </Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView
                style={[
                    styles.safeArea,
                    styles.centered,
                ]}
            >
                <Text
                    style={styles.errorText}
                >
                    {error}
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
            >
                <LocationHeader
                    city="San Jose, California"
                    cartCount={totalItems}
                    onCartPress={
                        handleCartPress
                    }
                    bellCount={unreadCount}
                    onBellPress={
                        handleNotificationsPress
                    }
                />

                <SearchBar
                    value={search}
                    onChangeText={
                        handleSearchChange
                    }
                    onFilterPress={
                        handleFilterPress
                    }
                />

                <SectionHeader
                    title="Special Promo for You"
                />

                <PromoBanner
                    percent="25%"
                    subtext="First transaction up to $500"
                    dateRange="25 - 29 June 2026"
                    onShopPress={
                        handlePromoPress
                    }
                />

                <SectionHeader
                    title="Recommended for You"
                    onSeeAllPress={
                        handleRecommendedSeeAll
                    }
                />

                <FlatList
                    data={products.slice(0, 6)}
                    keyExtractor={(item) =>
                        String(item.id)
                    }
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        styles.horizontalList
                    }
                    renderItem={({
                        item,
                    }) => (
                        <PlantCard
                            plant={item}
                            isFavorite={isFavorite(
                                item.id
                            )}
                            onToggleFavorite={() =>
                                handleToggleFavorite(
                                    item
                                )
                            }
                            onPress={() =>
                                openDetail(item)
                            }
                            style={
                                styles.horizontalCard
                            }
                        />
                    )}
                />

                <SectionHeader
                    title="Shop by Category"
                    onSeeAllPress={
                        handleCategorySeeAll
                    }
                />

                <View
                    style={
                        styles.categoryGrid
                    }
                >
                    {CATEGORIES.map(
                        (category) => (
                            <CategoryGridItem
                                key={
                                    category.id
                                }
                                category={
                                    category
                                }
                                onPress={() =>
                                    handleCategoryPress(
                                        category
                                    )
                                }
                            />
                        )
                    )}
                </View>

                <SectionHeader
                    title="Special Offers"
                    onSeeAllPress={
                        handleSpecialOffersSeeAll
                    }
                />

                <FlatList
                    data={CATEGORY_CHIPS}
                    keyExtractor={(item) =>
                        item
                    }
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    style={
                        styles.chipListWrapper
                    }
                    contentContainerStyle={
                        styles.chipList
                    }
                    renderItem={({
                        item,
                    }) => (
                        <CategoryChip
                            label={item}
                            active={
                                activeChip ===
                                item
                            }
                            onPress={() =>
                                handleCategoryChipPress(
                                    item
                                )
                            }
                        />
                    )}
                />

                <FlatList
                    data={filteredPlants}
                    keyExtractor={(item) =>
                        String(item.id)
                    }
                    horizontal
                    showsHorizontalScrollIndicator={
                        false
                    }
                    contentContainerStyle={
                        styles.horizontalList
                    }
                    renderItem={({
                        item,
                    }) => (
                        <PlantCard
                            plant={item}
                            isFavorite={isFavorite(
                                item.id
                            )}
                            onToggleFavorite={() =>
                                handleToggleFavorite(
                                    item
                                )
                            }
                            onPress={() =>
                                openDetail(item)
                            }
                            style={
                                styles.horizontalCard
                            }
                        />
                    )}
                />

                <View
                    style={{
                        height: SPACING.xl,
                    }}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles =
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor:
                COLORS.background,
        },

        centered: {
            alignItems: 'center',
            justifyContent:
                'center',
        },

        loadingText: {
            marginTop:
                SPACING.sm,
            fontSize:
                FONT_SIZES.md,
            color:
                COLORS.textMuted,
        },

        errorText: {
            fontSize:
                FONT_SIZES.md,
            color:
                COLORS.danger,
            textAlign: 'center',
            paddingHorizontal:
                SPACING.lg,
        },

        horizontalList: {
            paddingHorizontal:
                SPACING.lg,
            paddingBottom:
                SPACING.sm,
        },

        horizontalCard: {
            width: 170,
            marginRight:
                SPACING.md,
        },

        categoryGrid: {
            flexDirection:
                'row',
            paddingHorizontal:
                SPACING.lg,
        },

        chipListWrapper: {
            flexGrow: 0,
        },

        chipList: {
            paddingHorizontal:
                SPACING.lg,
            paddingBottom:
                SPACING.md,
            alignItems:
                'center',
        },
    });

export default HomeScreen;
