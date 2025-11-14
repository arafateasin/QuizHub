import { Request, Response, NextFunction } from "express";
import {
  successResponse,
  NotFoundError,
  paginatedResponse,
} from "@quizhub/shared";
import { userService } from "../services/user.service";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await userService.findById(userId!);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json(successResponse(userService.toJSON(user)));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               avatar:
 *                 type: string
 *               bio:
 *                 type: string
 *               institution:
 *                 type: string
 *               grade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, avatar, bio, institution, grade } = req.body;

    const user = await userService.findById(userId!);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update profile fields
    const profileUpdates: any = { profile: { ...user.profile } };
    if (firstName !== undefined) profileUpdates.profile.firstName = firstName;
    if (lastName !== undefined) profileUpdates.profile.lastName = lastName;
    if (avatar !== undefined) profileUpdates.profile.avatar = avatar;
    if (bio !== undefined) profileUpdates.profile.bio = bio;
    if (institution !== undefined)
      profileUpdates.profile.institution = institution;
    if (grade !== undefined) profileUpdates.profile.grade = grade;

    const updatedUser = await userService.update(userId!, profileUpdates);

    res.json(
      successResponse(
        userService.toJSON(updatedUser!),
        "Profile updated successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await userService.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.json(successResponse(userService.toJSON(user)));
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, teacher, admin]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    // Note: Firestore pagination is simplified for now
    const users = await userService.getAllUsers(limit);
    const totalCount = users.length;

    res.json(
      successResponse(
        paginatedResponse(
          users.map((u) => userService.toJSON(u)),
          page,
          limit,
          totalCount
        )
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await userService.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await userService.delete(id);

    res.json(successResponse(null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};
