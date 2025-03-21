import { Document, Schema as MongooseSchema } from 'mongoose';
export type ItemDocument = Item & Document;
export declare class Item {
    name: string;
    description: string;
    price: number;
    categoryUniqId: string;
    imageUrl: string;
    isNew: boolean;
    isActive: boolean;
}
export declare const ItemSchema: MongooseSchema<Item, import("mongoose").Model<Item, any, any, any, Document<unknown, any, Item> & Item & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Item, Document<unknown, {}, import("mongoose").FlatRecord<Item>> & import("mongoose").FlatRecord<Item> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
