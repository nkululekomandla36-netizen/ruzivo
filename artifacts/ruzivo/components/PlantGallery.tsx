import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from "react-native";
import Colors from "@/constants/colors";

const GALLERY_HEIGHT = 218;
const AUTO_INTERVAL = 4200;
const RESUME_DELAY = 5000;

interface PlantSlide {
  id: string;
  uri: string;
  name: string;
  category: string;
}

const SLIDES: PlantSlide[] = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=75",
    name: "Forest Ecosystem",
    category: "African Biodiversity",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=75",
    name: "Aloe Species",
    category: "Medicinal Plant",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=75",
    name: "Tropical Leaves",
    category: "Indigenous Flora",
  },
  {
    id: "4",
    uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=75",
    name: "Wild Africa",
    category: "Savanna Ecosystem",
  },
  {
    id: "5",
    uri: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=75",
    name: "Healing Herbs",
    category: "Traditional Medicine",
  },
  {
    id: "6",
    uri: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=75",
    name: "Wildflower Meadow",
    category: "Pollinator Plants",
  },
  {
    id: "7",
    uri: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=75",
    name: "Medicinal Leaves",
    category: "Healing Plants",
  },
  {
    id: "8",
    uri: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=800&q=75",
    name: "Water Wetlands",
    category: "Wetland Plants",
  },
];

export default function PlantGallery() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAutoScrolling = useRef(false);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (resumeRef.current) {
      clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    if (!galleryWidth) return;
    stopAutoPlay();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        isAutoScrolling.current = true;
        scrollRef.current?.scrollTo({ x: next * galleryWidth, animated: true });
        return next;
      });
    }, AUTO_INTERVAL);
  }, [galleryWidth, stopAutoPlay]);

  useEffect(() => {
    if (galleryWidth > 0) startAutoPlay();
    return stopAutoPlay;
  }, [galleryWidth, startAutoPlay, stopAutoPlay]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0 && w !== galleryWidth) setGalleryWidth(w);
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!galleryWidth) return;
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / galleryWidth);
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    setCurrentIndex(clamped);
    isAutoScrolling.current = false;
  };

  const handleScrollBeginDrag = () => {
    stopAutoPlay();
  };

  const handleScrollEndDrag = () => {
    resumeRef.current = setTimeout(startAutoPlay, RESUME_DELAY);
  };

  if (galleryWidth === 0) {
    return (
      <View
        onLayout={handleLayout}
        style={[styles.container, { height: GALLERY_HEIGHT }]}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={handleLayout}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleScrollEnd}
          decelerationRate="fast"
        >
          {SLIDES.map((slide) => (
            <View
              key={slide.id}
              style={{ width: galleryWidth, height: GALLERY_HEIGHT }}
            >
              <Image
                source={{ uri: slide.uri }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.labelOverlay}>
                <Text style={styles.categoryText}>{slide.category}</Text>
                <Text style={styles.nameText}>{slide.name}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 10,
  },
  container: {
    width: "100%",
    height: GALLERY_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: Colors.primary.cardBg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  labelOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(0,0,0,0.48)",
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.primary.gold,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  nameText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.primary.white,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.separator,
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.gold,
  },
});
