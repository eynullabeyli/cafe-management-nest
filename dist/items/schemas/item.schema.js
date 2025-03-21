"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemSchema = exports.Item = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
let Item = class Item {
};
exports.Item = Item;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The name of the item' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Item.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The description of the item' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Item.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The price of the item' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The unique identifier of the category this item belongs to' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Item.prototype, "categoryUniqId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'The URL of the item image' }),
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Item.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the item is new or not' }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Item.prototype, "isNew", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the item is active or not' }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Item.prototype, "isActive", void 0);
exports.Item = Item = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Item);
exports.ItemSchema = mongoose_1.SchemaFactory.createForClass(Item);
//# sourceMappingURL=item.schema.js.map