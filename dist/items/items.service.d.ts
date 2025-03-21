import { Model } from 'mongoose';
import { Item, ItemDocument } from './schemas/item.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemsService {
    private itemModel;
    private readonly logger;
    private isDbConnected;
    constructor(itemModel: Model<ItemDocument>);
    private checkDbConnection;
    create(createItemDto: CreateItemDto): Promise<Item>;
    findAll(options?: {
        limit?: number;
        skip?: number;
        activeOnly?: boolean;
    }): Promise<Item[]>;
    findOne(id: string): Promise<Item>;
    findByCategory(categoryUniqId: string, activeOnly?: boolean): Promise<Item[]>;
    searchByName(nameQuery: string, options?: {
        limit?: number;
        skip?: number;
        activeOnly?: boolean;
    }): Promise<Item[]>;
    update(id: string, updateItemDto: UpdateItemDto): Promise<Item>;
    remove(id: string): Promise<Item>;
    private checkDbConnectionStatus;
    private handleDatabaseError;
}
