import {v4 as uuidv4 } from 'uuid';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { StatementsRepository } from '../../repositories/StatementsRepository';
import { CreateStatementError } from './CreateStatementError';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let usersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createStatement: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create Statemeant",()=>{

    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        createStatement = new CreateStatementUseCase(
            usersRepository,
            inMemoryStatementsRepository,
        );
        createUserUseCase = new CreateUserUseCase(
            usersRepository,
        )
    })
    it("should be able to make a deposit or withdraw operation", async()=>{
        const statementOperation = jest.spyOn(inMemoryStatementsRepository, "create");
        const user =  await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
        });
        const statement = await createStatement.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100.59,
            description: "A deposit",
        });

        expect(statementOperation).toBeCalled();
        expect(statement.type).toBe(OperationType.DEPOSIT);

        const statement2 = await createStatement.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100.59,
            description: "A withdraw",
        });

        expect(statementOperation).toBeCalled();
        expect(statement2.type).toBe(OperationType.WITHDRAW);
    });

    it("should be able to make a deposit or withdraw operation", async()=>{
      
        const user =  await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
        });
       await expect(createStatement.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100.59,
            description: "A deposit",
        })).rejects.toEqual(new CreateStatementError.InsufficientFunds());
        
    });
});