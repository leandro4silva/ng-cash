import { Request, Response } from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

class AccountsController{
	async show(request: Request, response: Response){

		const { user_id } = request.user;
        
		const user = await prisma.users.findFirst({
			where:{
				id: user_id
			}
		});

		const account = await prisma.accounts.findFirst({
			where: {
				id: user?.accountId
			}
		});

		return response.json(account);
	}
}

export {
	AccountsController
};