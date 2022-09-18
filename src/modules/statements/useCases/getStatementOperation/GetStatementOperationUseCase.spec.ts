import { v4 as uuidv4 } from 'uuid';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

let usersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createStatement: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
};


describe("Get statement",()=>{
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        createStatement = new CreateStatementUseCase(
            usersRepository,
            inMemoryStatementsRepository,
        );
        createUserUseCase = new CreateUserUseCase(
            usersRepository,
        );
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            usersRepository,
            inMemoryStatementsRepository,
        );
    });
    it("should be able to get Operation Statement", async()=>{
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
        
       const getStatement = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string,
        });
        expect(getStatement).toHaveProperty("id");
    });

    it("should be able to get Operation Statement", async()=>{
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
        
       const getStatement = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string,
        });
        expect(getStatement).toHaveProperty("id");
    });

    it("should not be able to get statement if user not exists",async ()=>{
        await expect(getStatementOperationUseCase.execute({
            user_id: uuidv4(),
            statement_id: uuidv4(),
        })).rejects.toEqual(new GetStatementOperationError.UserNotFound());
    });

    it("should not be able to get statement if statement not exists",async ()=>{
        const user =  await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
        });
        await expect(getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: uuidv4(),
        })).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
    });
});