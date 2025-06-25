import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ProductReviews({ reviews, rating, showMore, onShowMore }) {
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={Colors.secondary}
          style={styles.star}
        />,
      )
    }
    return stars
  }

  const renderReview = (review, index) => (
    <View key={index} style={styles.reviewItemContainer}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: review.avatar }} style={styles.avatar} />
        <View style={styles.reviewInfo}>
          <Text style={styles.reviewerName}>{review.name}</Text>
          <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
        </View>
      </View>
      <Text style={styles.reviewText}>{review.comment}</Text>
    </View>
  )

  // Determine how many reviews to show
  const displayReviews = showMore ? reviews.slice(0, 6) : reviews.slice(0, 3)
  const hasMoreReviews = reviews.length > displayReviews.length

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá</Text>

      {/* Rating Overview - No Frame */}
      <View style={styles.ratingOverview}>
        <Text style={styles.ratingNumber}>{rating}</Text>
        <Text style={styles.ratingLabel}>of 5</Text>
        <View style={styles.ratingStars}>{renderStars(Math.floor(rating))}</View>
      </View>

      {/* Reviews Container - With Frame */}
      <View style={styles.reviewsContainer}>
        {displayReviews.map(renderReview)}

        {hasMoreReviews && (
          <TouchableOpacity style={styles.showAllButton} onPress={onShowMore}>
            <Text style={styles.showAllText}>Hiển thị tất cả đánh giá</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  ratingOverview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginRight: 4,
  },
  ratingLabel: {
    fontSize: 16,
    color: Colors.gray,
    marginRight: 12,
  },
  ratingStars: {
    flexDirection: "row",
  },
  reviewsContainer: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  reviewItemContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  reviewStars: {
    flexDirection: "row",
  },
  star: {
    marginRight: 2,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 18,
  },
  showAllButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  showAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
})
