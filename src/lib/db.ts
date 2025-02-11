const connectDB = async () => {
    if (typeof window !== "undefined") return; // 确保只在服务器端运行

    try {
        const mongoose = await import("mongoose"); // 使用动态 import 代替 require
        await mongoose.default.connect(process.env.MONGO_URI!);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export default connectDB;