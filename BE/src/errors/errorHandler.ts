import { DatabaseError } from "pg";
import { AppError } from "../controllers/error";

function extractField(error: DatabaseError): string | undefined {
  // Prefer explicit column
  if (error.column) return error.column;

  // Fallback to constraint name
  if (error.constraint) {
    const parts = error.constraint.split("_");
    if (parts.length > 2) {
      return parts.slice(1, -1).join("_");
    }
  }

  return undefined;
}

export function handleDBError(error: DatabaseError) {
  switch (error.code) {
    // ─────────────── Validation / Constraints ───────────────

    case "23502": // not_null_violation
      return {
        status: "fail",
        stack: error?.stack,
        code: 400,
        isAppError: false,
        message: "MANDATORY_FIELD_MISSING",
        innerMessage: error?.message,
        field: extractField(error),
      };

    case "23505": // unique_violation
      return {
        status: "fail",
        stack: error?.stack,
        code: 409,
        isAppError: false,
        message: "UNIQUE_FIELD_DUPLICATED",
        innerMessage: error?.message,
        field: extractField(error),
      };

    case "23503": // foreign_key_violation
      return {
        status: "fail",
        stack: error?.stack,
        code: 400,
        isAppError: false,
        message: "INVALID_REFERENCE",
        innerMessage: error?.message,
        field: extractField(error),
      };

    case "23514": // check_violation
      return {
        status: "fail",
        stack: error?.stack,
        code: 400,
        isAppError: false,
        innerMessage: error?.message,
        message: "CHECK_CONSTRAINT_FAILED",
        field: extractField(error),
      };

    // ─────────────── Data format errors ───────────────

    case "22P02": // invalid_text_representation
      return {
        status: "fail",
        stack: error?.stack,
        code: 400,
        isAppError: false,
        innerMessage: error?.message,
        message: "INVALID_FIELD_FORMAT",
        field: extractField(error),
      };

    case "22001": // string_data_right_truncation
      return {
        status: "fail",
        stack: error?.stack,
        code: 400,
        isAppError: false,
        innerMessage: error?.message,
        message: "FIELD_VALUE_TOO_LONG",
        field: extractField(error),
      };

    case "22007": // invalid_datetime_format
      return {
        status: "fail",
        stack: error?.stack,
        code: 400,
        isAppError: false,
        innerMessage: error?.message,
        message: "INVALID_DATE_FORMAT",
        field: extractField(error),
      };

    // ─────────────── Permission / Auth ───────────────

    case "42501": // insufficient_privilege
      return {
        status: "fail",
        stack: error?.stack,
        code: 403,
        isAppError: false,
        innerMessage: error?.message,
        message: "INSUFFICIENT_PRIVILEGES",
      };

    // ─────────────── Fallback ───────────────

    default:
      return {
        status: "error",
        stack: error?.stack,
        code: 500,
        isAppError: false,
        innerMessage: error?.message,
        message: "DATABASE_ERROR",
        meta: {
          code: error.code,
          table: error.table,
        },
      };
  }
}

export function debugModeErrorHandler(error: any) {
  let handledError: any;
  if (error instanceof DatabaseError) {
    handledError = handleDBError(error);
  } else if (error instanceof AppError) {
    handledError = {
      status: "fail",
      code: 400,
      isAppError: true,
      message: error.message,
      stack: error.stack,
    };
  } else {
    handledError = {
      status: "error",
      code: 500,
      isAppError: false,
      message: error.message,
      stack: error.stack,
    };
  }
  return handledError;
}
