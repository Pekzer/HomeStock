import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
  TextInput,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '@/types/Product';
import { StorageService } from '@/services/StorageService';

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'relative'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const loadProducts = async () => {
    let data = await StorageService.getProducts();
    
    // Si estamos en web y no hay productos, agregar productos de ejemplo
    if (Platform.OS === 'web' && data.length === 0) {
      const sampleProducts: Product[] = [
        {
          id: 'sample-1',
          name: 'Arroz',
          quantity: 5,
          minQuantity: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-2',
          name: 'Leche',
          quantity: 3,
          minQuantity: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-3',
          name: 'Pan',
          quantity: 1,
          minQuantity: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-4',
          name: 'Huevos',
          quantity: 12,
          minQuantity: 6,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-5',
          name: 'Café',
          quantity: 0,
          minQuantity: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'sample-6',
          name: 'Azúcar',
          quantity: 8,
          minQuantity: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      // Guardar productos de ejemplo
      for (const product of sampleProducts) {
        await StorageService.saveProduct(product);
      }
      
      data = sampleProducts;
    }
    
    setProducts(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  const handleSortPress = (newSortBy: 'name' | 'quantity' | 'relative') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const handleResetDemo = async () => {
    if (Platform.OS !== 'web') return;
    
    Alert.alert(
      'Resetear Demo',
      '¿Estás seguro de que quieres resetear todos los productos y volver a cargar los datos de ejemplo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpiar AsyncStorage
              await AsyncStorage.clear();
              // Recargar productos (esto activará la carga de productos de ejemplo)
              await loadProducts();
            } catch (error) {
              Alert.alert('Error', 'No se pudo resetear la demo');
            }
          }
        }
      ]
    );
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
    .filter(p => !showLowStockOnly || p.quantity <= p.minQuantity)
    .sort((a, b) => {
      let aVal, bVal;
      if (sortBy === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === 'quantity') {
        aVal = a.quantity;
        bVal = b.quantity;
      } else { // relative
        aVal = a.quantity - a.minQuantity;
        bVal = b.quantity - b.minQuantity;
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const handleDecrease = async (id: string) => {
    const products = await StorageService.getProducts();
    const product = products.find(p => p.id === id);
    if (product && product.quantity > 0) {
      product.quantity -= 1;
      product.updatedAt = new Date().toISOString();
      await StorageService.saveProduct(product);
      loadProducts();
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const isLowStock = item.quantity <= item.minQuantity;
    
    return (
      <TouchableOpacity
        style={[styles.productItem, isLowStock && styles.lowStock]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>
              Cantidad: {item.quantity}
            </Text>
            <Text style={styles.minQuantity}>
              Mínimo: {item.minQuantity}
            </Text>
          </View>
          {isLowStock && (
            <Text style={styles.lowStockText}>⚠️ Stock bajo</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.decreaseButton}
          onPress={() => handleDecrease(item.id)}
        >
          <Text style={styles.decreaseButtonText}>-1</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/Pekzer');
  };

  const toggleLowStockFilter = () => {
    setShowLowStockOnly(!showLowStockOnly);
  };

  const lowStockCount = products.filter(p => p.quantity <= p.minQuantity).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, styles.githubButton]}
          onPress={handleGitHubPress}
        >
          <Text style={styles.githubButtonText}>?</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>HomeStock</Text>
          {lowStockCount > 0 && !showLowStockOnly && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{lowStockCount}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.sortContainer}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
          onPress={() => handleSortPress('name')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>Nombre {sortBy === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'quantity' && styles.sortButtonActive]}
          onPress={() => handleSortPress('quantity')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'quantity' && styles.sortButtonTextActive]}>Cantidad {sortBy === 'quantity' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, showLowStockOnly && styles.lowStockFilterActive]}
          onPress={toggleLowStockFilter}
        >
          <Text style={[styles.sortButtonText, showLowStockOnly && styles.lowStockFilterTextActive]}>
            📉 {showLowStockOnly ? 'Todos' : 'Stock Bajo'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {products.length === 0 
              ? 'No hay productos' 
              : showLowStockOnly 
                ? 'No hay productos con stock bajo' 
                : 'No hay productos que coincidan con la búsqueda'
            }
          </Text>
          <Text style={styles.emptySubText}>
            {products.length === 0 
              ? 'Toca el botón + para agregar tu primer producto'
              : showLowStockOnly
                ? 'Todos los productos tienen stock suficiente'
                : 'Intenta con otros términos de búsqueda'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {Platform.OS === 'web' && (
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetDemo}
        >
          <Text style={styles.resetButtonText}>🔄 Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  badge: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-around',
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#333',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  lowStock: {
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
  },
  minQuantity: {
    fontSize: 14,
    color: '#999',
  },
  lowStockText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '600',
    marginTop: 5,
  },
  decreaseButton: {
    width: 40,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  resetButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowStockFilterButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  headerButtonTextActive: {
    color: '#ff4444',
  },
  githubButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubButtonText: {
    fontSize: 16,
    color: '#333',
  },
  headerSpacer: {
    width: 36, // Same width as github button for balance
  },
  lowStockFilterActive: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  lowStockFilterTextActive: {
    color: '#fff',
  },
});
