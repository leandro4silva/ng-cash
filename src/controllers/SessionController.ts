import {Request, Response} from "express";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
import authConfig from "../configs/auth";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

class SessionController{
	async create(request: Request, response: Response){
		const {username, password} = request.body;

		const user = await prisma.users.findFirst({
			where: { username }
		});

		if(!user){
			throw new AppError("Username e/ou password incorretos!", 401);
		}

		const passwordMatched = await compare(password, user.password);

		if(!passwordMatched){
			throw new AppError("Username e/ou password incorretos!", 401);
		}

		const {secret, expiresIn} = authConfig.jwt;

		const token = sign({}, secret, {
			subject: String(user.id),
			expiresIn
		});

		response.json({user, token});
	}
}


export {
	SessionController
};