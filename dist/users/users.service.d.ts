import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    private readonly logger;
    private isDbConnected;
    constructor(userModel: Model<UserDocument>);
    private checkDbConnection;
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(options?: {
        limit?: number;
        skip?: number;
    }): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<User>;
    private checkDbConnectionStatus;
    private handleDatabaseError;
}
