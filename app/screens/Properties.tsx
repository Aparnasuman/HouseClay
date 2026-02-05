import {
    BALCONY_TYPE_OPTIONS,
    BATHROOM_TYPE_OPTIONS,
    BHK_TYPE_OPTIONS,
    FURNISHING_OPTIONS,
    getOptionLabel,
    PROPERTY_TYPE_OPTIONS,
    ROOM_TYPE_OPTIONS,
    TENANT_TYPE_OPTIONS,
} from "@/src/common/dataConstants/options";
import { BadgeType, PropertyCategory } from "@/src/common/enums";
import { formatINRCurrency, processPropertyImages } from "@/src/common/utils";
import { useShortlist } from "@/src/hooks/useShortlist";
import { PropertySearch } from "@/src/interfaces/PropertySearch";
import { PropertyCardWithImages } from "@/src/interfaces/User";
import { Crown, Heart, MapPin, Star } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface PropertiesProps {
  property: PropertySearch;
  badgeType?: string | null;
  autoplay?: boolean;
  autoplayInterval?: number;
  showCarouselDots?: boolean;
  onPress?: () => void;
}

const Properties: React.FC<PropertiesProps> = ({
  property,
  badgeType,
  autoplay = false,
  autoplayInterval = 3000,
  showCarouselDots = true,
  onPress,
}) => {
  // --- State ---
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleShortlist, isShortlisted } = useShortlist();
  const [isShortlistedProperty, setIsShortlistedProperty] = useState(
    isShortlisted(property.propertyID),
  );

  // --- Derived Values ---
  const propertyCategory = property?.propertyCategory ?? PropertyCategory.RENT;
  const propertyType = getOptionLabel(
    PROPERTY_TYPE_OPTIONS,
    property.propertyType,
  );
  const bhkType = getOptionLabel(BHK_TYPE_OPTIONS, property.bhkType);
  const furnishing = getOptionLabel(FURNISHING_OPTIONS, property.furnishing);
  const formattedPrice = formatINRCurrency(
    property?.price || property?.rent || 0,
  );
  const tenantType = getOptionLabel(TENANT_TYPE_OPTIONS, property.tenantType);
  const roomType = getOptionLabel(ROOM_TYPE_OPTIONS, property.roomType);
  const bathroomType = getOptionLabel(
    BATHROOM_TYPE_OPTIONS,
    property.bathroomType,
  );
  const balconyType = getOptionLabel(
    BALCONY_TYPE_OPTIONS,
    property.balconyType,
  );

  const bedrooms =
    bhkType === "Studio" || bhkType === "1 BHK"
      ? "1 Bed"
      : bhkType
        ? `${bhkType.split("BHK")[0]} Beds`
        : "N/A";

  const bathrooms = property.bathrooms
    ? `${property.bathrooms} ${property.bathrooms > 1 ? "Baths" : "Bath"}`
    : "N/A";

  const propertyImages = useMemo(
    () => processPropertyImages(property.images),
    [property.images],
  );

  // --- Carousel ---
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  }, [propertyImages.length]);

  useEffect(() => {
    if (autoplay && propertyImages.length > 1) {
      const interval = setInterval(nextImage, autoplayInterval);
      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayInterval, nextImage, propertyImages.length]);

  // --- Handlers ---
  const handleShortlist = async () => {
    const newStatus = await toggleShortlist(property as PropertyCardWithImages);
    setIsShortlistedProperty(newStatus);
  };

  // --- Render ---
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      android_ripple={{ color: "#ccc" }}
    >
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: propertyImages[currentImageIndex] }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badge */}
        {badgeType && (
          <View style={styles.badge}>
            <View style={styles.badgeContent}>
              <View
                style={[
                  styles.iconCircle,
                  badgeType === BadgeType.Featured
                    ? { backgroundColor: "#fee2e2" }
                    : { backgroundColor: "#fef3c7" },
                ]}
              >
                {badgeType === BadgeType.Featured ? (
                  <Star size={12} color="#dc2626" />
                ) : (
                  <Crown size={12} color="#d97706" />
                )}
              </View>
              <Text style={styles.badgeText}>
                {badgeType === BadgeType.Featured ? "Featured" : "Exclusive"}
              </Text>
            </View>
          </View>
        )}

        {/* Shortlist Button */}
        <Pressable style={styles.heartButton} onPress={handleShortlist}>
          <Heart
            size={20}
            fill={isShortlistedProperty ? "#ec4899" : "none"}
            color={isShortlistedProperty ? "#ec4899" : "#6b7280"}
          />
        </Pressable>

        {/* Carousel Dots */}
        {showCarouselDots && propertyImages.length > 1 && (
          <View style={styles.dotsContainer}>
            {propertyImages.map((_, index) => (
              <Pressable
                key={index}
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.activeDot,
                ]}
                onPress={() => setCurrentImageIndex(index)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Property Info */}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.categoryBadge}>
            {propertyCategory === PropertyCategory.RENT
              ? propertyType
              : propertyCategory === PropertyCategory.FLATMATE
                ? `${roomType} Room for ${tenantType}`
                : null}
          </Text>
          <Text style={styles.locationText}>
            {property.locationOrSocietyName}
          </Text>
        </View>

        <View style={[styles.row, styles.priceRow]}>
          <Text style={styles.detailsText}>
            {propertyCategory === PropertyCategory.RENT
              ? `${bedrooms} | ${bathrooms} | ${furnishing}`
              : propertyCategory === PropertyCategory.FLATMATE
                ? `${bhkType === "Studio" ? "1 RK" : bhkType} | ${bathroomType} | ${balconyType}`
                : ""}
          </Text>
          <Text style={styles.priceText}>{formattedPrice}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.areaText}>
            {propertyCategory === PropertyCategory.RENT
              ? `Buildup Area ${property.builtUpArea || "N/A"} Sq. Ft`
              : propertyCategory === PropertyCategory.FLATMATE
                ? furnishing
                : ""}
          </Text>
        </View>

        <View style={styles.landmarkRow}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.landmarkText}>
            {property.landmark || "No landmark"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  imageContainer: { width: "100%", height: 200 },
  image: { width: "100%", height: "100%" },
  badge: { position: "absolute", top: 10, left: 10 },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  iconCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "500" },
  heartButton: { position: "absolute", top: 10, right: 10 },
  dotsContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 3,
  },
  activeDot: { backgroundColor: "#fff" },
  infoContainer: { padding: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 12,
    color: "#000",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  locationText: { fontSize: 12, color: "#6b7280", flexShrink: 1 },
  priceRow: { alignItems: "center" },
  detailsText: { fontSize: 12, color: "#111" },
  priceText: { fontSize: 14, fontWeight: "bold" },
  areaText: { fontSize: 12, color: "#6b7280" },
  landmarkRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  landmarkText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 4,
    flexShrink: 1,
  },
});

export default Properties;
