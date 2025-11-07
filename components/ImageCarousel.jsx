import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  Pressable,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = Math.round(SCREEN_WIDTH * 0.85);
const ITEM_SPACING = Math.round((SCREEN_WIDTH - ITEM_WIDTH) / 2);

export default function ImageCarousel({ images = [], height = 160 }) {
  const flatRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setFullscreenVisible(true)}
      style={[styles.itemContainer, { height }]}
    >
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { height: height + 40 }]}>
      <FlatList
        ref={flatRef}
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => item + i}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: ITEM_SPACING }}
        snapToInterval={ITEM_WIDTH + 12}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, i) => ({
          length: ITEM_WIDTH + 12,
          offset: (ITEM_WIDTH + 12) * i,
          index: i,
        })}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />

      {/* Pagination dots */}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View key={i} style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]} />
        ))}
      </View>

      {/* Fullscreen Modal */}
      <Modal visible={fullscreenVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.closeButton} onPress={() => setFullscreenVisible(false)}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
          <Image
            source={{ uri: images[index] }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  dotActive: { backgroundColor: '#111' },
  dotInactive: { backgroundColor: '#ccc' },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
  },
  closeText: {
    color: 'white',
    fontSize: 14,
  },
});
