import { View, Text, Image, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Button from "@/components/core/Button";
import Input from "@/components/core/input";
import { Link } from "expo-router";
import axiosInstance from "@/config/axiosConfig";
import axios from "axios";
import { useTheme } from "@/context/ThemeContext";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentTheme } = useTheme();

    const handleSignup = async () => {
        const { currentTheme } = useTheme();
        const [data, setData] = useState({
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        });
        const [errors, setErrors] = useState({
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        });
        const [loading, setLoading] = useState(false);
        const [successMessage, setSuccessMessage] = useState("");

    }

}