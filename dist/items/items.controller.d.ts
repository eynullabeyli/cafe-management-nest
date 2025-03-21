import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './schemas/item.schema';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    create(createItemDto: CreateItemDto): Promise<Item>;
    findAll(limit?: number, skip?: number, activeOnly?: boolean | string): Promise<Item[]>;
    findOne(id: string): Promise<Item>;
    findByCategory(categoryUniqId: string, activeOnly?: boolean | string): Promise<Item[]>;
    update(id: string, updateItemDto: UpdateItemDto): Promise<Item>;
    remove(id: string): Promise<Item>;
}
