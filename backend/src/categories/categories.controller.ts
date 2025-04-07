import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category successfully created.', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean, description: 'Filter active categories only' })
  @ApiResponse({ status: 200, description: 'Return all categories.', type: [Category] })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async findAll(@Query('activeOnly') activeOnly?: boolean): Promise<Category[]> {
    if (activeOnly === true) {
      return this.categoriesService.findAllActive();
    }
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiResponse({ status: 200, description: 'Return the category.', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Get('uniqId/:uniqId')
  @ApiOperation({ summary: 'Get a category by uniqId' })
  @ApiParam({ name: 'uniqId', description: 'The unique identifier of the category' })
  @ApiResponse({ status: 200, description: 'Return the category.', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async findByUniqId(@Param('uniqId') uniqId: string): Promise<Category> {
    return this.categoriesService.findByUniqId(uniqId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiResponse({ status: 200, description: 'Category successfully updated.', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiResponse({ status: 200, description: 'Category successfully deleted.', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 503, description: 'Service unavailable. Database connection issues.' })
  async remove(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}