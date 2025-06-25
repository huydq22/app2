// components/common/LoginModal.js
import { Colors } from "@/constants/Colors";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const LoginModal = ({ 
  visible, 
  onClose, 
  onLogin, 
  onLoginPress,
  action = "tiếp tục" 
}) => {
  const handleLogin = () => {
    if (onLoginPress) {
      onLoginPress();
    } else if (onLogin) {
      onLogin();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Yêu cầu đăng nhập</Text>
          <Text style={styles.modalMessage}>
            Vui lòng đăng nhập để {action}.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.loginButton]}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.text,
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
  },
  loginButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});