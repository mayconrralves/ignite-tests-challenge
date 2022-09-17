import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfile: ShowUserProfileUseCase;

describe("Show user Profile", ()=>{

    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepository,
        );
        createUserUseCase = new CreateUserUseCase(
            usersRepository,
        );
        showUserProfile = new ShowUserProfileUseCase(
            usersRepository
        );
    });

    it("should be able to return a user profile by id", async()=>{
        const returnUser = jest.spyOn(usersRepository, "findById");
        const { id }  = await createUserUseCase.execute({
            name: "Test",
            email: "test@test.com",
            password: "123456",
        });
        await showUserProfile.execute(id as string);

        expect(returnUser).toBeCalled();
    });

});