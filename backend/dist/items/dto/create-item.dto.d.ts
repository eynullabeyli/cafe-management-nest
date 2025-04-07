export declare class CreateItemDto {
    readonly name: string;
    readonly description: string;
    readonly price: number;
    readonly categoryUniqId: string;
    readonly imageUrl?: string;
    readonly isNew?: boolean;
    readonly isActive?: boolean;
}
