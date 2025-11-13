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
  TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '../types/Product';
import { StorageService } from '../services/StorageService';

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'relative'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const loadProducts = async () => {
    const data = await StorageService.getProducts();
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

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
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

  const lowStockCount = products.filter(p => p.quantity <= p.minQuantity).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HomeStock</Text>
        {lowStockCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{lowStockCount}</Text>
          </View>
        )}
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
          style={[styles.sortButton, sortBy === 'relative' && styles.sortButtonActive]}
          onPress={() => handleSortPress('relative')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'relative' && styles.sortButtonTextActive]}>Stock {sortBy === 'relative' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</Text>
        </TouchableOpacity>
      </View>
      
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay productos</Text>
          <Text style={styles.emptySubText}>
            Toca el botón + para agregar tu primer producto
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
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 15,
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
});
