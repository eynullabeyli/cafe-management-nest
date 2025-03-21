import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './schemas/item.schema';

@ApiTags('items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item successfully created.', type: Item })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items to return' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Number of items to skip' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Filter active items only' })
  @ApiResponse({ status: 200, description: 'Return all items.', type: [Item] })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async findAll(
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
    @Query('activeOnly') activeOnly?: boolean | string,
  ): Promise<Item[]> {
    const options = { 
      limit: limit ? parseInt(limit.toString()) : undefined,
      skip: skip ? parseInt(skip.toString()) : undefined,
      activeOnly: activeOnly === true || activeOnly === 'true'
    };
    
    return this.itemsService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by id' })
  @ApiParam({ name: 'id', description: 'The id of the item' })
  @ApiResponse({ status: 200, description: 'Return the item.', type: Item })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async findOne(@Param('id') id: string): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Get('category/:categoryUniqId')
  @ApiOperation({ summary: 'Get items by category uniqId' })
  @ApiParam({ name: 'categoryUniqId', description: 'The unique identifier of the category' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Filter active items only' })
  @ApiResponse({ status: 200, description: 'Return the items.', type: [Item] })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async findByCategory(
    @Param('categoryUniqId') categoryUniqId: string,
    @Query('activeOnly') activeOnly?: boolean | string,
  ): Promise<Item[]> {
    return this.itemsService.findByCategory(
      categoryUniqId, 
      activeOnly === true || activeOnly === 'true'
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiParam({ name: 'id', description: 'The id of the item' })
  @ApiResponse({ status: 200, description: 'Item successfully updated.', type: Item })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiParam({ name: 'id', description: 'The id of the item' })
  @ApiResponse({ status: 200, description: 'Item successfully deleted.', type: Item })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async remove(@Param('id') id: string): Promise<Item> {
    return this.itemsService.remove(id);
  }
}