import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../generated/prisma/enums";
import { CookieUtils } from "../app/utils/cookie";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../app/lib/prisma";
import { jwtUtils } from "../app/utils/jwt";
import { envVars } from "../app/config/env";
import { role } from "better-auth/client";

export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        //session token verification
        const sessionToken = CookieUtils.getCookie(req, 'better-auth.session_token');

        if (!sessionToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access ! no session token provided')
        }

        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date(),  // getter then new Date or present date.
                    }
                },
                include: {
                    user: true,
                }
            })

            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;

                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

                if (percentRemaining < 20) {
                    res.setHeader('x-session-Refresh', 'true');
                    res.setHeader('x-session-Expires-At', expiresAt.toISOString());
                    res.setHeader('s-Time-Remaining', timeRemaining.toString());

                    console.log('session expires soon!!');
                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access!! user is not active')
                }

                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access!! user deleted')
                }

                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, 'Forbidden access, you donot have permission to access this device')
                }


                req.user = {
                    userId: user.id,
                    role: user.role,
                    email: user.email,
                }
            }

            const accessToken = CookieUtils.getCookie(req, 'accessToken');

            if (!accessToken) {
                throw new AppError(status.UNAUTHORIZED, " Unauthorized access!! no access token provided");
            }
        }

        //access token verification
        const accessToken = CookieUtils.getCookie(req, 'accessToken');

        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! no access token provided.');
        }

        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized access! Invalid access token.")
        }

        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, 'You do not have permission to access this resorsuce');
        }

        next();

    } catch (error: any) {
        next(error);

    }
}