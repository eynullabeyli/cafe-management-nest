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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const items_service_1 = require("./items.service");
const create_item_dto_1 = require("./dto/create-item.dto");
const update_item_dto_1 = require("./dto/update-item.dto");
const item_schema_1 = require("./schemas/item.schema");
let ItemsController = class ItemsController {
    constructor(itemsService) {
        this.itemsService = itemsService;
    }
    async create(createItemDto) {
        return this.itemsService.create(createItemDto);
    }
    async findAll(limit, skip, activeOnly) {
        const options = {
            limit: limit ? parseInt(limit.toString()) : undefined,
            skip: skip ? parseInt(skip.toString()) : undefined,
            activeOnly: activeOnly === true || activeOnly === 'true'
        };
        return this.itemsService.findAll(options);
    }
    async findOne(id) {
        return this.itemsService.findOne(id);
    }
    async findByCategory(categoryUniqId, activeOnly) {
        return this.itemsService.findByCategory(categoryUniqId, activeOnly === true || activeOnly === 'true');
    }
    async update(id, updateItemDto) {
        return this.itemsService.update(id, updateItemDto);
    }
    async remove(id) {
        return this.itemsService.remove(id);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new item' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Item successfully created.', type: item_schema_1.Item }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable. Database connection issues.' }),
    openapi.ApiResponse({ status: 201, type: require("./schemas/item.schema").Item }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all items' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of items to return' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of items to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'activeOnly', required: false, type: Boolean, description: 'Filter active items only' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all items.', type: [item_schema_1.Item] }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable. Database connection issues.' }),
    openapi.ApiResponse({ status: 200, type: [require("./schemas/item.schema").Item] }),
    __param(0, (0, common_1.Query)('limit')),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an item by id' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The id of the item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the item.', type: item_schema_1.Item }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable. Database connection issues.' }),
    openapi.ApiResponse({ status: 200, type: require("./schemas/item.schema").Item }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('category/:categoryUniqId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get items by category uniqId' }),
    (0, swagger_1.ApiParam)({ name: 'categoryUniqId', description: 'The unique identifier of the category' }),
    (0, swagger_1.ApiQuery)({ name: 'activeOnly', required: false, type: Boolean, description: 'Filter active items only' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the items.', type: [item_schema_1.Item] }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable. Database connection issues.' }),
    openapi.ApiResponse({ status: 200, type: [require("./schemas/item.schema").Item] }),
    __param(0, (0, common_1.Param)('categoryUniqId')),
    __param(1, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The id of the item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item successfully updated.', type: item_schema_1.Item }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable. Database connection issues.' }),
    openapi.ApiResponse({ status: 200, type: require("./schemas/item.schema").Item }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an item' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'The id of the item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Item successfully deleted.', type: item_schema_1.Item }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Item not found.' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service unavailable. Database connection issues.' }),
    openapi.ApiResponse({ status: 200, type: require("./schemas/item.schema").Item }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemsController.prototype, "remove", null);
exports.ItemsController = ItemsController = __decorate([
    (0, swagger_1.ApiTags)('items'),
    (0, common_1.Controller)('items'),
    __metadata("design:paramtypes", [items_service_1.ItemsService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map