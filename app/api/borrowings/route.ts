import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/utils/response";
import { requireAuth, requireRole } from "@/lib/auth";
import { getPaginationParams } from "@/lib/utils/pagination";
import { BorrowingService } from "@/lib/services/borrowing.service";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const { skip, take } = getPaginationParams(req.nextUrl.searchParams);
    const result = await BorrowingService.getAll(skip, take);

    return successResponse(result); 
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);

    const body = await req.json();
    const borrowing = await BorrowingService.create(user.userId, body);

    return successResponse(borrowing, 201);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRole(user, ["ADMIN", "PETUGAS"]);

    const { action, borrowingId } = await req.json();

    if (action === "APPROVE") {
      const result = await BorrowingService.approve(
        borrowingId,
        user.userId
      );
      return successResponse(result);
    }

    if (action === "REJECT") {
      const result = await BorrowingService.reject(
        borrowingId,
        user.userId
      );
      return successResponse(result);
    }

    if (action === "RETURN") {
      const result = await BorrowingService.returnBorrowing(
        borrowingId
      );
      return successResponse(result);
    }

    return errorResponse("Invalid action", 400);
  } catch (error: any) {
    return errorResponse(error.message, 400);
  }
}