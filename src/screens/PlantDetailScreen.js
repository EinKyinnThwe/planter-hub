import React, {
    useEffect,
    useState,
} from 'react';

import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import QuantityStepper from '../components/QuantityStepper';

import useCart from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import useCheckout from '../hooks/useCheckout';

import {
    COLORS,
    SPACING,
    FONT_SIZES,
    RADIUS,
} from '../constants/theme';

import {
    logButtonClick,
    logScreenView,
    logErrorToCrashlytics,
} from '../services/analyticsService';

const PlantDetailScreen = ({
    route,
    navigation,
}) => {
    const plant =
        route?.params?.plant;

    const {
        addToCart,
        totalItems,
    } = useCart();

    const {
        isFavorite,
        toggleFavorite,
    } = useFavorites();

    const [quantity, setQuantity] =
        useState(1);

    useEffect(() => {
        logScreenView(
            'PlantDetailScreen'
        );
    }, []);

    if (!plant) {
        return (
            <SafeAreaView
                style={styles.safeArea}
            >
                <View
                    style={
                        styles.centered
                    }
                >
                    <Text>
                        Product not found.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const hasDiscount =
        !!plant.discountPercent &&
        !!plant.originalPrice;

    const price =
        Number(plant.price) || 0;

    const total =
        (
            price * quantity
        ).toFixed(2);

    const handleBack = () => {
        navigation.goBack();

        logButtonClick(
            'back',
            'PlantDetailScreen',
            {
                product_id:
                    String(plant.id),
            }
        );
    };

    const handleShare = () => {
        logButtonClick(
            'share_product',
            'PlantDetailScreen',
            {
                product_id:
                    String(plant.id),
            }
        );
    };

    const handleCartPress = () => {
        console.log(
            'PlantDetail cart pressed'
        );

        console.log(
            'PlantDetail navigation routes:',
            navigation
                .getParent()
                ?.getState()
                ?.routeNames
        );
        navigation.navigate(
            'Cart'
        );
        logButtonClick(
            'cart',
            'PlantDetailScreen',
            {
                product_id:
                    String(plant.id),
            }
        );
    };

    const handleMorePress = () => {
        logButtonClick(
            'product_more',
            'PlantDetailScreen',
            {
                product_id:
                    String(plant.id),
            }
        );
    };

    const handleFavoritePress =
        () => {
            const currentlyFavorite =
                isFavorite(plant.id);
            toggleFavorite(
                plant.id
            );
            logButtonClick(
                currentlyFavorite
                    ? 'remove_favorite'
                    : 'add_favorite',
                'PlantDetailScreen',
                {
                    product_id:
                        String(plant.id),

                    product_name:
                        String(
                            plant.name
                        ),
                }
            );
        };

    const handleIncreaseQuantity =
        () => {
            setQuantity(
                (current) =>
                    current + 1
            );
        };

    const handleDecreaseQuantity =
        () => {
            setQuantity(
                (current) =>
                    Math.max(
                        1,
                        current - 1
                    )
            );
        };

    const handleAddToCart = () => {
        console.log(
            'Adding product to cart:',
            plant.id,
            'quantity:',
            quantity
        );

        try {
            addToCart(
                plant,
                quantity
            );

            logButtonClick(
                'add_to_cart',
                'PlantDetailScreen',
                {
                    product_id:
                        String(plant.id),

                    product_name:
                        String(plant.name),

                    category:
                        plant.category
                            ? String(
                                plant.category
                            )
                            : undefined,

                    quantity:
                        Number(quantity),

                    price:
                        Number(price),
                }
            );

            Alert.alert(
                'Added to cart',
                `${quantity} × ${plant.name} added.`
            );
        } catch (error) {
            console.error(
                'Add to cart failed:',
                error
            );

            logErrorToCrashlytics(
                error,
                'Failed to add item to cart'
            );
        }
    };

    const {
        checkout,
        loading,
        error,
    } = useCheckout(() => {
        navigation.navigate(
            'Main',
            {
                screen: 'History',
            }
        );
    });

    const handleBuyNow = async () => {
        try {
            logButtonClick(
                'buy_now',
                'PlantDetailScreen',
                {
                    product_id:
                        String(plant.id),

                    product_name:
                        String(plant.name),

                    category:
                        plant.category
                            ? String(
                                plant.category
                            )
                            : undefined,

                    quantity:
                        Number(quantity),

                    total_price:
                        Number(total),
                }
            );

            await checkout();
        } catch (error) {
            console.error(
                'Checkout failed:',
                error
            );

            logErrorToCrashlytics(
                error,
                'Checkout failed from PlantDetailScreen'
            );
        }
    };

    const handleChatPress = () => {
        navigation.navigate(
            'Chat'
        );

        logButtonClick(
            'product_chat',
            'PlantDetailScreen',
            {
                product_id:
                    String(plant.id),
            }
        );
    };

    useEffect(() => {
        if (error) {
            logErrorToCrashlytics(
                error,
                'Checkout error on PlantDetailScreen'
            );
        }
    }, [error]);

    return (
        <SafeAreaView
            style={styles.safeArea}
        >
            <View
                style={styles.iconHeader}
            >
                <TouchableOpacity
                    onPress={handleBack}
                    hitSlop={8}
                >
                    <Text
                        style={styles.iconText}
                    >
                        ←
                    </Text>
                </TouchableOpacity>

                <View
                    style={
                        styles.iconHeaderRight
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.iconButton
                        }
                        onPress={
                            handleShare
                        }
                        hitSlop={8}
                    >
                        <Text
                            style={styles.iconText}
                        >
                            ↗
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.iconButton
                        }
                        onPress={
                            handleCartPress
                        }
                        hitSlop={8}
                    >
                        <View>
                            <Text
                                style={
                                    styles.iconText
                                }
                            >
                                🛒
                            </Text>

                            {totalItems >
                                0 && (
                                    <View
                                        style={
                                            styles.cartBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.cartBadgeText
                                            }
                                        >
                                            {totalItems}
                                        </Text>
                                    </View>
                                )}
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.iconButton
                        }
                        onPress={
                            handleMorePress
                        }
                        hitSlop={8}
                    >
                        <Text
                            style={styles.iconText}
                        >
                            ⋯
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={
                    styles.container
                }
            >
                <View
                    style={styles.imageBox}
                >
                    <View
                        style={
                            styles.categoryTag
                        }
                    >
                        <Text
                            style={
                                styles.categoryTagText
                            }
                        >
                            {plant.category}
                        </Text>
                    </View>

                    <Text
                        style={styles.emoji}
                    >
                        {plant.emoji}
                    </Text>

                    <View
                        style={
                            styles.counterBadge
                        }
                    >
                        <Text
                            style={
                                styles.counterText
                            }
                        >
                            1/
                            {plant.imageCount ||
                                1}
                        </Text>
                    </View>
                </View>

                <View
                    style={styles.titleRow}
                >
                    <Text
                        style={styles.name}
                    >
                        {plant.name}
                    </Text>

                    <TouchableOpacity
                        onPress={
                            handleFavoritePress
                        }
                        hitSlop={8}
                    >
                        <Text
                            style={styles.heart}
                        >
                            {isFavorite(
                                plant.id
                            )
                                ? '♥'
                                : '♡'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={styles.ratingRow}
                >
                    <Text
                        style={styles.star}
                    >
                        ★
                    </Text>

                    <Text
                        style={
                            styles.ratingText
                        }
                    >
                        {Number(
                            plant.rating || 0
                        ).toFixed(1)}{' '}
                        ({plant.reviewCount || 0})
                    </Text>

                    <Text
                        style={styles.dot}
                    >
                        ·
                    </Text>

                    <Text
                        style={
                            styles.ratingText
                        }
                    >
                        {plant.sold || 0} sold
                    </Text>
                </View>

                <View
                    style={styles.priceRow}
                >
                    {hasDiscount && (
                        <View
                            style={
                                styles.discountBadge
                            }
                        >
                            <Text
                                style={
                                    styles.discountText
                                }
                            >
                                {
                                    plant.discountPercent
                                }
                                %
                            </Text>
                        </View>
                    )}

                    <Text
                        style={styles.price}
                    >
                        $
                        {price.toFixed(2)}
                    </Text>

                    {hasDiscount && (
                        <Text
                            style={
                                styles.originalPrice
                            }
                        >
                            $
                            {Number(
                                plant.originalPrice
                            ).toFixed(2)}
                        </Text>
                    )}
                </View>

                <Text
                    style={
                        styles.sectionTitle
                    }
                >
                    Description
                </Text>

                <Text
                    style={
                        styles.description
                    }
                >
                    {plant.description}
                </Text>

                <View
                    style={styles.buyRow}
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Buy Item:
                    </Text>

                    <QuantityStepper
                        quantity={quantity}
                        onIncrease={
                            handleIncreaseQuantity
                        }
                        onDecrease={
                            handleDecreaseQuantity
                        }
                    />
                </View>
            </ScrollView>

            <View
                style={styles.footer}
            >
                <TouchableOpacity
                    style={
                        styles.chatButton
                    }
                    hitSlop={6}
                    onPress={
                        handleChatPress
                    }
                >
                    <Text
                        style={
                            styles.chatIcon
                        }
                    >
                        💬
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        styles.addToCartButton
                    }
                    onPress={
                        handleAddToCart
                    }
                >
                    <Text
                        style={
                            styles.addToCartText
                        }
                    >
                        Add to cart
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        styles.buyButton
                    }
                    onPress={
                        handleBuyNow
                    }
                    disabled={loading}
                >
                    <Text
                        style={
                            styles.buyButtonText
                        }
                    >
                        {loading
                            ? 'Processing…'
                            : `Buy $${total}`}
                    </Text>
                </TouchableOpacity>
            </View>
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
            flex: 1,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        iconHeader: {
            flexDirection:
                'row',
            justifyContent:
                'space-between',
            alignItems:
                'center',
            paddingHorizontal:
                SPACING.lg,
            paddingVertical:
                SPACING.sm,
        },

        iconHeaderRight: {
            flexDirection:
                'row',
        },

        iconButton: {
            marginLeft:
                SPACING.md,
        },

        iconText: {
            fontSize:
                FONT_SIZES.xxl,
            color:
                COLORS.primary,
            fontWeight:
                'bold',
        },

        cartBadge: {
            position:
                'absolute',
            top: -4,
            right: -8,
            backgroundColor:
                COLORS.primary,
            borderRadius: 10,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 3,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        cartBadgeText: {
            color:
                COLORS.white,
            fontSize: 10,
            fontWeight:
                '700',
        },

        container: {
            paddingHorizontal:
                SPACING.lg,
            paddingBottom:
                SPACING.xl,
        },

        imageBox: {
            backgroundColor:
                COLORS.surface,
            borderRadius:
                RADIUS.lg,
            height: 240,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginBottom:
                SPACING.lg,
        },

        categoryTag: {
            position:
                'absolute',
            top: SPACING.md,
            left: SPACING.md,
            backgroundColor:
                'rgba(31,42,36,0.75)',
            borderRadius:
                RADIUS.sm,
            paddingHorizontal:
                SPACING.sm,
            paddingVertical: 4,
        },

        categoryTagText: {
            color:
                COLORS.white,
            fontSize:
                FONT_SIZES.xs,
            fontWeight:
                '600',
        },

        emoji: {
            fontSize: 96,
        },

        counterBadge: {
            position:
                'absolute',
            bottom: SPACING.md,
            right: SPACING.md,
            backgroundColor:
                'rgba(31,42,36,0.75)',
            borderRadius:
                RADIUS.sm,
            paddingHorizontal:
                SPACING.sm,
            paddingVertical: 4,
        },

        counterText: {
            color:
                COLORS.white,
            fontSize:
                FONT_SIZES.xs,
            fontWeight:
                '600',
        },

        titleRow: {
            flexDirection:
                'row',
            justifyContent:
                'space-between',
            alignItems:
                'center',
        },

        name: {
            fontSize:
                FONT_SIZES.xl,
            fontWeight:
                '700',
            color:
                COLORS.text,
            flex: 1,
            marginRight:
                SPACING.sm,
        },

        heart: {
            fontSize:
                FONT_SIZES.xl,
            color:
                COLORS.danger,
        },

        ratingRow: {
            flexDirection:
                'row',
            alignItems:
                'center',
            marginTop:
                SPACING.xs,
        },

        star: {
            color:
                COLORS.star,
            fontSize:
                FONT_SIZES.md,
            marginRight: 4,
        },

        ratingText: {
            fontSize:
                FONT_SIZES.sm,
            color:
                COLORS.textMuted,
        },

        dot: {
            marginHorizontal:
                SPACING.xs,
            color:
                COLORS.textMuted,
        },

        priceRow: {
            flexDirection:
                'row',
            alignItems:
                'center',
            marginTop:
                SPACING.sm,
            marginBottom:
                SPACING.lg,
        },

        discountBadge: {
            backgroundColor:
                COLORS.discountBg,
            borderRadius:
                RADIUS.sm,
            paddingHorizontal:
                SPACING.sm,
            paddingVertical: 2,
            marginRight:
                SPACING.sm,
        },

        discountText: {
            color:
                COLORS.discountText,
            fontSize:
                FONT_SIZES.sm,
            fontWeight:
                '700',
        },

        price: {
            fontSize:
                FONT_SIZES.xl,
            fontWeight:
                '700',
            color:
                COLORS.text,
            marginRight:
                SPACING.sm,
        },

        originalPrice: {
            fontSize:
                FONT_SIZES.md,
            color:
                COLORS.strikethrough,
            textDecorationLine:
                'line-through',
        },

        sectionTitle: {
            fontSize:
                FONT_SIZES.md,
            fontWeight:
                '700',
            color:
                COLORS.text,
            marginBottom:
                SPACING.xs,
        },

        description: {
            fontSize:
                FONT_SIZES.md,
            color:
                COLORS.textMuted,
            lineHeight: 22,
            marginBottom:
                SPACING.lg,
        },

        buyRow: {
            flexDirection:
                'row',
            alignItems:
                'center',
            justifyContent:
                'space-between',
        },

        footer: {
            flexDirection:
                'row',
            alignItems:
                'center',
            paddingHorizontal:
                SPACING.lg,
            paddingVertical:
                SPACING.md,
            borderTopWidth: 1,
            borderTopColor:
                COLORS.inputBorder,
        },

        chatButton: {
            width: 48,
            height: 48,
            borderRadius:
                RADIUS.md,
            borderWidth: 1,
            borderColor:
                COLORS.inputBorder,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginRight:
                SPACING.sm,
        },

        chatIcon: {
            fontSize:
                FONT_SIZES.lg,
        },

        addToCartButton: {
            flex: 1,
            height: 48,
            borderRadius:
                RADIUS.md,
            borderWidth: 1.5,
            borderColor:
                COLORS.primary,
            alignItems:
                'center',
            justifyContent:
                'center',
            marginRight:
                SPACING.sm,
        },

        addToCartText: {
            color:
                COLORS.primary,
            fontSize:
                FONT_SIZES.md,
            fontWeight:
                '700',
        },

        buyButton: {
            flex: 1,
            height: 48,
            borderRadius:
                RADIUS.md,
            backgroundColor:
                COLORS.primary,
            alignItems:
                'center',
            justifyContent:
                'center',
        },

        buyButtonText: {
            color:
                COLORS.white,
            fontSize:
                FONT_SIZES.md,
            fontWeight:
                '700',
        },
    });

export default PlantDetailScreen;
