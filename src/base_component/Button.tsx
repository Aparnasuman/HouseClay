import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  leftIcon,
  rightIcon,
  variant = "primary",
  size = "md",
  isLoading = false,
  isFullWidth = false,
  isDisabled = false,
  onPress,
}) => {
  const bgColors = {
    primary: "#ef4444",
    secondary: "#e5e7eb",
    outline: "transparent",
    ghost: "transparent",
    danger: "#b91c1c",
  };

  const textColors = {
    primary: "#fff",
    secondary: "#374151",
    outline: "#4b5563",
    ghost: "#4b5563",
    danger: "#fff",
  };

  const paddingSizes = {
    sm: 8,
    md: 12,
    lg: 16,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled || isLoading}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: paddingSizes[size],
        backgroundColor: bgColors[variant],
        opacity: isDisabled || isLoading ? 0.6 : 1,
        width: isFullWidth ? "100%" : undefined,
        borderRadius: 8,
        gap: 8,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text
            style={{ color: textColors[variant], fontSize: paddingSizes[size] }}
          >
            {children}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
