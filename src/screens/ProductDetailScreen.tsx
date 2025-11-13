import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { Product } from '../types/Product';
import { StorageService } from '../services/StorageService';

export default function ProductDetailScreen({ route, navigation }: any) {
  const { product } = route.params as { product: Product };
  
  const [name, setName] = useState(product.name);
  const [quantity, setQuantity] = useState(product.quantity.toString());
  const [minQuantity, setMinQuantity] = useState(product.minQuantity.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre');
      return;
    }

    const qty = parseInt(quantity) || 0;
    const minQty = parseInt(minQuantity) || 0;

    if (qty < 0 || minQty < 0) {
      Alert.alert('Error', 'Las cantidades no pueden ser negativas');
      return;
    }

    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      quantity: qty,
      minQuantity: minQty,
      updatedAt: new Date().toISOString(),
    };

    try {
      await StorageService.saveProduct(updatedProduct);
      setIsEditing(false);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el producto');
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de eliminar "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteProduct(id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleQuickUpdate = async (amount: number) => {
    const newQuantity = Math.max(0, parseInt(quantity) + amount);
    setQuantity(newQuantity.toString());
    
    const updatedProduct: Product = {
      ...product,
      name: name.trim(),
      quantity: newQuantity,
      minQuantity: parseInt(minQuantity) || 0,
      updatedAt: new Date().toISOString(),
    };

    try {
      await StorageService.saveProduct(updatedProduct);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el producto');
    }
  };

  const isLowStock = parseInt(quantity) <= parseInt(minQuantity);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {!isEditing ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>{product.name}</Text>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(product.id, product.name)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isLowStock && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>⚠️ Stock bajo</Text>
              </View>
            )}

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Cantidad Actual</Text>
              <Text style={styles.infoValue}>{quantity}</Text>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Cantidad Mínima</Text>
              <Text style={styles.infoValue}>{minQuantity}</Text>
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Actualización Rápida</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.decreaseButton]}
                  onPress={() => handleQuickUpdate(-1)}
                >
                  <Text style={styles.actionButtonText}>-1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.decreaseButton]}
                  onPress={() => handleQuickUpdate(-5)}
                >
                  <Text style={styles.actionButtonText}>-5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.increaseButton]}
                  onPress={() => handleQuickUpdate(1)}
                >
                  <Text style={styles.actionButtonText}>+1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.increaseButton]}
                  onPress={() => handleQuickUpdate(5)}
                >
                  <Text style={styles.actionButtonText}>+5</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Editar Producto</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del Producto</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cantidad</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cantidad Mínima</Text>
              <TextInput
                style={styles.input}
                value={minQuantity}
                onChangeText={setMinQuantity}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Actualización Rápida</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.decreaseButton]}
                  onPress={() => handleQuickUpdate(-1)}
                >
                  <Text style={styles.actionButtonText}>-1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.decreaseButton]}
                  onPress={() => handleQuickUpdate(-5)}
                >
                  <Text style={styles.actionButtonText}>-5</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.increaseButton]}
                  onPress={() => handleQuickUpdate(1)}
                >
                  <Text style={styles.actionButtonText}>+1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.increaseButton]}
                  onPress={() => handleQuickUpdate(5)}
                >
                  <Text style={styles.actionButtonText}>+5</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setName(product.name);
                  setQuantity(product.quantity.toString());
                  setMinQuantity(product.minQuantity.toString());
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  alertBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  alertText: {
    color: '#856404',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  quickActions: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseButton: {
    backgroundColor: '#ff6b6b',
  },
  increaseButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
