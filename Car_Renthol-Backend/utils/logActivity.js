const logActivity = async ({ userId, email, activityType, status, message, req }) => {
  try {
    const ip = req?.ip || "N/A";
    const userAgent = req?.headers?.["user-agent"] || "N/A";
    const sessionId = req?.sessionID || "N/A";

    const logData = {
      userId,
      email,
      activityType,
      status,
      message,
      ip,
      userAgent,
      sessionId,              // ✅ Add sessionId here
      timestamp: new Date(),
    };

    // Save in activitylogs collection (Mongoose)
    await ActivityLog.create(logData);

    // Save in Winston (logs collection)
    logger.info(`📝 ${activityType.toUpperCase()} - ${status} - ${message}`, {
      metadata: logData,
    });
  } catch (error) {
    console.error("❌ Logging failed:", error.message);
  }
};
