import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DropdownOption {
  value: string | number | boolean;
  label: string;
}

interface MultiSelectDropdownProps {
  label?: string;
  value: (string | number | boolean)[];
  onChange: (values: (string | number | boolean)[]) => void;
  options: DropdownOption[];
  placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select options",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleValue = (val: string | number | boolean) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const displayText =
    value.length === 0
      ? placeholder
      : options
          .filter((o) => value.includes(o.value))
          .map((o) => o.label)
          .join(", ");

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen(true)}>
        <Text>{displayText}</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => {
                const selected = value.includes(item.value);
                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      selected && { backgroundColor: "#fee2e2" },
                    ]}
                    onPress={() => toggleValue(item.value)}
                  >
                    <Text style={{ color: selected ? "#b91c1c" : "#111" }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setIsOpen(false)}
            >
              <Text style={{ color: "#fff" }}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 4 },
  button: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  option: { padding: 12 },
  applyButton: {
    marginTop: 12,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default MultiSelectDropdown;
