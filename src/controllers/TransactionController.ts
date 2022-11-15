import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {addDays, formatISO} from "date-fns";
import { AppError } from "../utils/AppError";

const prisma = new PrismaClient();

class TransactionController{
	async create(request: Request, response: Response){
		const { user_id } = request.user;

		const {username, value} = request.body;

		const userCashOut = await prisma.users.findFirst({
			where: {
				id: String(user_id)
			}
		});

		if(!userCashOut){
			throw new AppError("Erro inexperado ao realizar transação");
		}

		if(userCashOut.username === username){
			throw new AppError("Não é possivel realizar uma transferência para si mesmo");
		}

		const accountUserCashOut = await prisma.accounts.findFirst({
			where: {
				id: userCashOut?.accountId
			}
		});

		if(!accountUserCashOut){
			throw new AppError("Erro inexperado ao realizar transação");
		}

		const checkEnoughBalance = accountUserCashOut && accountUserCashOut.balance > value ? true : false;
            
		if(!checkEnoughBalance){
			throw new AppError("Saldo insuficiente para realizar transação"); 
		}

		
		const userCashIn = await prisma.users.findFirst({
			where:{
				username
			}
		});

		if(!userCashIn){
			throw new AppError("O usuario informado não existe");
		}
		
		const accountUserCashIn = await prisma.accounts.findFirst({
			where: {
				id: userCashIn?.accountId
			}
		});

		if(!accountUserCashIn){
			throw new AppError("Erro inexperado ao realizar transação");
		}
		
		const balanceUserCashOut = accountUserCashOut.balance - value;
		const balanceUserCashIn = accountUserCashIn.balance + value;


		const transaction = await prisma.transactions.create({
			data: {
				value,
				creditedAccountId: String(userCashIn.accountId),
				debitedAccountId: String(userCashOut.accountId)
			}
		});

		await prisma.accounts.update({
			where: {
				id: userCashIn.accountId
			},
			data:{
				balance: balanceUserCashIn
			}
		});

		await prisma.accounts.update({
			where: {
				id: userCashOut.accountId
			},
			data:{
				balance: balanceUserCashOut
			}
		});
    
		return response.status(201).json({
			transaction
		});
	}


	async index(request: Request, response: Response){
		const {user_id} = request.user;

		const {date, transaction} = request.query;

		const user = await prisma.users.findFirst({
			where: {
				id: user_id
			}
		});

		
		let filterTransaction;

		if(date || transaction){
			if(date && transaction){
				if(String(transaction).toLocaleLowerCase() === "cash-in"){
					filterTransaction = await prisma.transactions.findMany({
						where:{
							createdAt: {
								gte: String(date),
								lt: formatISO(addDays(new Date(String(date)), 1))
							},
							creditedAccountId: user?.accountId
						}
					});
				}

				if(String(transaction).toLocaleLowerCase() === "cash-out"){
					filterTransaction = await prisma.transactions.findMany({
						where:{
							createdAt: {
								gte: String(date),
								lt: formatISO(addDays(new Date(String(date)), 1))
							},
							debitedAccountId: user?.accountId
						}
					});
				}
			}else{
				if(String(transaction).toLocaleLowerCase() === "cash-in"){
					filterTransaction = await prisma.transactions.findMany({
						where:{
							creditedAccountId: user?.accountId
						}
					});
				}else if(String(transaction).toLocaleLowerCase() === "cash-out"){
					filterTransaction = await prisma.transactions.findMany({
						where:{
							debitedAccountId: user?.accountId
						}
					});
	
				}else{
					filterTransaction = await prisma.transactions.findMany({
						where:{
							createdAt: {
								gte: String(date),
								lt: formatISO(addDays(new Date(String(date)), 1))
							}
						}
					});
				}
			}

			return response.json(filterTransaction);
			
		}else{
			const transactionCashIn = await prisma.transactions.findMany({
				where: {
					creditedAccountId: user?.accountId
				}
			}); 
	
			const transactionCashOut = await prisma.transactions.findMany({
				where: {
					debitedAccountId: user?.accountId
				}
			});
	
			return response.json({
				"cash-in": transactionCashIn,
				"cash-out": transactionCashOut
			});
		}

	}
}


export {
	TransactionController
};