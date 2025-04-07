import { Document } from 'mongoose';
export type CategoryDocument = Category & Document;
export declare class Category {
    _id?: string;
    name: string;
    uniqId: string;
    isActive: boolean;
}
export declare const CategorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, Document<unknown, any, Category> & Category & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, Document<unknown, {}, import("mongoose").FlatRecord<Category>> & import("mongoose").FlatRecord<Category> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
