import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Authenticate User", ()=>{
    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepository,
        );
        createUserUseCase = new CreateUserUseCase(
            usersRepository,
        );
    });
    it("should be able to authenticate, if received correct email and password",async()=>{
        const user = {
            name: "Test",
            email: "test@test.com",
            password: "123456",
        }
        await createUserUseCase.execute(user);
        const data = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

       expect(data).toHaveProperty("token");
    });
    
    it("should not be able to authenticate, if received incorrect email",async ()=> {
        const user = {
            name: "Test",
            email: "test@test.com",
            password: "123456",
        }
        await createUserUseCase.execute(user);
        await expect( authenticateUserUseCase.execute({
            email: "emailiswrong@test.com",
            password: user.password
        })).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });
    it("should not be able to authenticate, if received incorrect password",async ()=> {
        const user = {
            name: "Test",
            email: "test@test.com",
            password: "123456",
        }
        await createUserUseCase.execute(user);
        await expect( authenticateUserUseCase.execute({
            email: user.email,
            password: "password is wrong"
        })).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

});