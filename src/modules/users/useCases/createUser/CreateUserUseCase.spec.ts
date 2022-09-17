
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
describe("Create User", ()=>{
    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(
            usersRepository,
        )
    });
    it("should be able to create a user", async()=>{
 
        const user = await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
           });
        expect(user).toHaveProperty("id");
        
    });
    it("should  not be able to create a new user, if email already exists", async ()=>{
        await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
           });

           await expect(createUserUseCase.execute({
            name: "Test2",
            email: "test@test.com",
            password: "123456"
           })).rejects.toEqual(new CreateUserError());
        
    });

})