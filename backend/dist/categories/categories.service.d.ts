import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private categoryModel;
    private readonly logger;
    private isDbConnected;
    constructor(categoryModel: Model<CategoryDocument>);
    private checkDbConnection;
    create(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAll(): Promise<Category[]>;
    findAllActive(): Promise<Category[]>;
    private getSampleCategories;
    findOne(id: string): Promise<Category>;
    findByUniqId(uniqId: string): Promise<Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    remove(id: string): Promise<Category>;
    private checkDbConnectionStatus;
    private handleDatabaseError;
}
