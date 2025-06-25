import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductVariants({ variants, selectedSize, selectedColor, onSizeSelect, onColorSelect }) {
  // Extract unique sizes from all variants
  const allSizes = [];
  variants.forEach(variant => {
    if (variant.sizes) {
      variant.sizes.forEach(size => {
        if (!allSizes.find(s => s.size === size.size)) {
          allSizes.push(size);
        }
      });
    }
  });

  // Get unique colors
  const colors = [...new Set(variants.map((v) => v.color))];

  const renderSizeOption = (sizeObj, index) => (
    <TouchableOpacity
      key={`size-${sizeObj.size}-${index}`}
      style={[styles.sizeOption, selectedSize === sizeObj.size && styles.selectedOption]}
      onPress={() => onSizeSelect(sizeObj.size)}
    >
      <Text style={[styles.sizeText, selectedSize === sizeObj.size && styles.selectedText]}>{sizeObj.size}</Text>
    </TouchableOpacity>
  )

  const renderColorOption = (color, index) => {
    const colorCode = getColorCode(color)
    return (
      <TouchableOpacity
        key={`color-${color}-${index}`}
        style={[styles.colorOption, selectedColor === color && styles.selectedOption]}
        onPress={() => onColorSelect(color)}
      >
        <View style={[styles.colorCircle, { backgroundColor: colorCode }]} />
        <Text style={[styles.colorText, selectedColor === color && styles.selectedText]}>{color}</Text>
      </TouchableOpacity>
    )
  }

  // Helper function to convert color names to color codes
  const getColorCode = (colorName) => {
    const colorMap = {
      White: "#ffffff",
      Black: "#000000",
      Red: "#ff0000",
      Blue: "#0000ff",
      Green: "#008000",
      Yellow: "#ffff00",
      Pink: "#ffc0cb",
      Purple: "#800080",
      Orange: "#ffa500",
      Brown: "#a52a2a",
      Gray: "#808080",
      Navy: "#000080",
      Beige: "#f5f5dc",
      "Xanh navy": "#000080",
      "Trắng": "#ffffff",
      "Xanh đậm": "#000080",
      "Be": "#f5f5dc",
    }
    return colorMap[colorName] || colorName
  }

  return (
    <View style={styles.container}>
      {/* Size Selection */}
      {allSizes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsContainer}>
            {allSizes.map((size, index) => renderSizeOption(size, index))}
          </View>
        </View>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Màu sắc</Text>
          <View style={styles.colorOptionsContainer}>
            {colors.map((color, index) => renderColorOption(color, index))}
          </View>
        </View>
      )}

      {/* Variant Info */}
      {(selectedSize || selectedColor) && (
        <View style={styles.variantInfo}>
          <Text style={styles.variantText}>
            Đã chọn: {selectedSize || 'Chưa chọn'} - {selectedColor || 'Chưa chọn'}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sizeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  sizeText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  selectedText: {
    color: "white",
  },
  colorOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "white",
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  colorText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  variantInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  variantText: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: "italic",
  },
})
