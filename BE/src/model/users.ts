// import mongoose, { Query, Schema } from "mongoose";
// import type { UserType } from "../types/users.js";
// import { createHash } from "crypto";
// import bcrypt from "bcrypt";

// const userSchema = new Schema<UserType>(
//   {
//     name: {
//       type: String,
//       required: [true, "FIELD_REQUIRED>NAME"],
//       maxLength: [100, "MAX_LENGTH_EXCEEDED>NAME"],
//     },
//     email: {
//       type: String,
//       required: [true, "FIELD_REQUIRED>EMAIL"],
//       unique: [true, "UNIQUE_FIELD_VIOLATION>EMAIL"],
//       maxLength: [255, "MAX_LENGTH_EXCEEDED>EMAIL"],
//       lowercase: true,
//       trim: true,
//     },
//     imageUrl: String,
//     password: {
//       type: String,
//       required: function test(this: UserType) {
//         return this.provider === "local";
//       } as any,
//       select: false,
//     },
//     passwordChangedAt: {
//       type: Date,
//       validate: {
//         validator: function (value: Date) {
//           return !value || value.getTime() <= Date.now();
//         },
//         message: "INVALID_PASSWORD_CHANGE_TIME",
//       },
//     },

//     passwordResetToken: String,
//     passwordResetExpires: Date,
//     provider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//       required: true,
//     },
//     providerId: String,
//     status: {
//       type: String,
//       enum: ["active", "suspended", "pending", "deleted"],
//       default: "pending",
//     },

//     isEmailVerified: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     emailVerifiedAt: Date,
//     currentBalance: {
//       type: Number,
//       validate: function (this: UserType, val: number) {
//         return val >= 0;
//       },
//       default: 0,
//     },

//     lastLoginAt: Date,
//     failedLoginAttempts: {
//       type: Number,
//       default: 0,
//     },
//     accountLockedUntil: Date,
//     deletedAt: Date,
//   },
//   { timestamps: true }
// );

// userSchema.index(
//   { email: 1, deletedAt: 1 },
//   { unique: true, partialFilterExpression: { deletedAt: { $eq: null } } }
// );

// userSchema.index(
//   { provider: 1, providerId: 1 },
//   { unique: true, sparse: true }
// );

// userSchema.pre(/^find/, function (this: Query<any, UserType>) {
//   this.where({ deletedAt: { $eq: null } });
// });

// userSchema.pre("save", async function (next) {
//   if (
//     this.isModified("password") &&
//     this.provider === "local" &&
//     !!this.password
//   ) {
//     this.passwordChangedAt = new Date();
//     const hash = createHash("sha256").update(this.password).digest();
//     this.password = await bcrypt.hash(this.password, 12);
//   }
// });

// const UserModel = mongoose.model<UserType>("User", userSchema);

// export default UserModel;
