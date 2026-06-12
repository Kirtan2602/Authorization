import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../redis.js";

// TOKEN GENERATORS

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

// REGISTER

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        console.log("REFRESH_SECRET:", process.env.REFRESH_SECRET);

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        //redis key
        await redisClient.set(
            `refresh_${user.id}`,
            refreshToken,
            "EX",
            7 * 24 * 60 * 60
        );

        // cookie
        res.cookie("refreshtoken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// REFRESH 
export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            return res.status(403).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );

        const storedToken = await redisClient.get(`refresh_${decoded.id}`);

        if (storedToken !== refreshToken) {
            return res.status(403).json({ message: "Token mismatch" });
        }

        const newAccessToken = generateAccessToken({
            id: decoded.id,
            email: decoded.email,
        });

        res.status(200).json({
            accessToken: newAccessToken,
        });

    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

// LOGOUT 

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_SECRET
                );

                await redisClient.del(`refresh_${decoded.id}`);
            } catch (err) { }
        }

        res.clearCookie("refreshtoken");

        res.status(200).json({
            message: "Logout successful",
        });

    } catch (error) {
        res.status(500).json({ message: "Logout error" });
    }
};