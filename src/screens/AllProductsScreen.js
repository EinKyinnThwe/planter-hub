import React, { useMemo, useRef, useState } from 'react';
import {
    FlatList,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import SearchBar from '../components/SearchBar';
import CategoryChip from '../components/CategoryChip';
import PlantCard from '../components/PlantCard';
import useCart from '../hooks/useCart';
import useFavorites from '../hooks/useFavorites';
import useProducts from '../hooks/useProducts';
import { CATEGORY_CHIPS } from '../data/categories';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import {
    startTrace, 
    stopTrace
} from '../services/performanceService';

const AllProductsScreen = ({ route, navigation }) => {
    
    const { title = 'All Plants', initialCategory = 'All' } = route.params || {};

    const { totalItems } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { products, loading, error } = useProducts();

    const [search, setSearch] = useState('');
    const [activeChip, setActiveChip] = useState(initialCategory);

    const filteredPlants = useMemo(() => {
        return products.filter((plant) => {
        const matchesCategory = activeChip === 'All' || plant.category === activeChip;
        const matchesSearch = plant.name.toLowerCase().includes(search.trim().toLowerCase());
        return matchesCategory && matchesSearch;
        });
    }, [products, activeChip, search]);
    
    const performanceTraceRef = useRef(null);
    const hasStoppedTrace = useRef(false);
    
    useEffect(() => {
        let cancelled = false;
        startTrace('all_products_search').then((t) => {
            if (cancelled) {
                stopTrace(t, { outcome: 'cancelled' });
                return;
            }
            perfTraceRef.current = t;
        });
        return () => {
            cancelled = true;
        };
    }, []);
    
    useEffect(() => {
        if (!loading && !hasStoppedTrace.current && perfTraceRef.current) {
            hasStoppedTrace.current = true;
            stopTrace(perfTraceRef.current, {
                outcome: error ? 'error' : 'success',
                resultCount: filteredPlants.length,
                category: activeChip,
            });
        }
    }, [loading]);

    return (
        <SafeAreaView style={styles.safeArea}>
        <ScreenHeader
            title='All of Our Products'
            showBack
            onBackPress={() => navigation.goBack()}
            cartCount={totalItems}
            onCartPress={() => navigation.navigate('Cart')}
        />

        <SearchBar value={search} onChangeText={setSearch} onFilterPress={() => {}} />

        <FlatList
            data={CATEGORY_CHIPS}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipListWrapper}
            contentContainerStyle={styles.chipList}
            renderItem={({ item }) => (
            <CategoryChip
                label={item}
                active={activeChip === item}
                onPress={() => setActiveChip(item)}
            />
            )}
        />

        {loading ? (
            <View style={styles.centered}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        ) : error ? (
            <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            </View>
        ) : (
            <>
            <Text style={styles.resultsCount}>
                {filteredPlants.length} {filteredPlants.length === 1 ? 'plant' : 'plants'}
            </Text>

            <FlatList
                data={filteredPlants}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.gridRow}
                renderItem={({ item }) => (
                <PlantCard
                    plant={item}
                    isFavorite={isFavorite(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    onPress={() => navigation.navigate('PlantDetail', { plant: item })}
                    style={styles.gridCard}
                />
                )}
                ListEmptyComponent={
                <View style={styles.centered}>
                    <Text style={styles.emptyEmoji}>🔍</Text>
                    <Text style={styles.emptyText}>No plants match your search</Text>
                </View>
                }
            />
            </>
        )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    chipListWrapper: {
        flexGrow: 0,
    },
    chipList: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
        alignItems: 'center',
    },
    resultsCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.sm,
    },
    gridContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.xl,
        flexGrow: 1,
    },
    gridRow: {
        gap: SPACING.sm,
    },
    gridCard: {
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: SPACING.xxl,
    },
    errorText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.danger,
        textAlign: 'center',
        paddingHorizontal: SPACING.lg,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: SPACING.sm,
    },
    emptyText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textMuted,
    },
});

export default AllProductsScreen;