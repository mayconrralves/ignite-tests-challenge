import { v4 as uuidv4 } from 'uuid';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceError } from './GetBalanceError';
import { GetBalanceUseCase } from './GetBalanceUseCase';


let usersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createStatement: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalance: GetBalanceUseCase;


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
};
describe("Get Balance",()=>{
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
        getBalance = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            usersRepository,
        );
    });
    it("should be able to get Balance", async ()=> {
        const user =  await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
        });
        await createStatement.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100.59,
            description: "A deposit",
        });
        await createStatement.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100.59,
            description: "A withdraw",
        });
        const balance = await getBalance.execute({
            user_id: user.id as string,
        });
        expect(balance.statement.length).toBe(2);
        expect(balance.balance).toBe(0);
    });

    it("should not be able to get Balance if user not exists", async ()=> {
        const user_id = uuidv4();
        await expect(
            getBalance.execute({user_id})).rejects.toEqual(new GetBalanceError()
        );
    });
});