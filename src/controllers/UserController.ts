/* eslint-disable no-invalid-regexp */
import {Request, Response} from "express";
import {AppError} from "../utils/AppError";
import {PrismaClient} from "@prisma/client";
import {hash} from "bcrypt";

const prisma = new PrismaClient();

class UserController{ 
	async create(request: Request, response: Response){
		const {username, password} = request.body;

		if(!username){
			throw new AppError("Insira o seu nome por favor!");
		}

		if(!password){
			throw new AppError("Insira a sua senha por favor!");
		}

		const checkUsername = String(username).length;

		if(checkUsername < 3){
			throw new AppError("O seu username deve ter pelo menos 3 caracteres");
		}

		const checkUserNameExist = await prisma.users.findFirst({
			where:{
				username
			}
		});

		if(checkUserNameExist){
			throw new AppError("Este username já esta em uso!");
		}

		const checkPassword = String(password).length;
        
		if(checkPassword < 8){
			console.log("here");
			throw new AppError("A sua senha deve ter pelo menos 8 caracteres");
		}

		const regexUpperCase = new RegExp(
			"^(?=.*[A-Z]).+$"
		);

		const regexHasNumber = new RegExp(
			"^(?=.*\\d).+$"  
		);

		if(!regexUpperCase.test(password)){
			throw new AppError("A senha deve conter pelo menos um caracter maiúsculo");
		}

		if(!regexHasNumber.test(password)){
			throw new AppError("A senha deve conter pelo menos um caracter numerico");
		}

		const hashedPassword = await hash(password, 8);

		try{
			const accountId = await prisma.accounts.create({
				data:{
					balance: 100.00,
				}
			});

			await prisma.users.create({
				data: {
					username,
					password: hashedPassword,
					accountId: String(accountId.id)
				}
			});

			return response.status(201).json();

		}catch(error){
			console.log(error);
			throw new AppError("Erro inesperado ao criar conta");
		}

	}
}

export {
	UserController
};