import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection, getConnectionManager, getManager, In, Repository, UpdateResult } from 'typeorm'
import { CategoryEntity } from './category.entity'
import { CreateCategoryDto, UpdateCategoryDto } from './dto'

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {}

  public async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.manager.getTreeRepository(CategoryEntity).findTrees()
  }

  public async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return category
  }

  public findByIds(ids: number[]) {
    return this.categoryRepository.findBy({ id: In(ids) })
  }

  public findByTitle(title: string): Promise<CategoryEntity> {
    return this.categoryRepository.findOneBy({ title })
  }

  public findByTitles(titles: string[]) {
    return this.categoryRepository.findBy({ title: In(titles) })
  }

  public async findAncestorsTree(category: CategoryEntity) {
    return await this.categoryRepository.manager.getTreeRepository(CategoryEntity).findAncestors(category)
  }

  public async create(dto: CreateCategoryDto): Promise<CategoryEntity> {
    const existCategory = await this.categoryRepository.findOneBy({ title: dto.title })
    if (existCategory) {
      return existCategory
    }

    const category = this.categoryRepository.create({ title: dto.title })

    if (dto.parentId) {
      const parentCategory = await this.categoryRepository.findOneBy({ id: +dto.parentId })
      category.parent = parentCategory
    }

    return this.categoryRepository.save(category)
  }

  public async update(id: number, dto: UpdateCategoryDto): Promise<UpdateResult> {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return this.categoryRepository.update(id, dto)
  }

  public async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })

    if (!category) {
      throw new NotFoundException('Category not Found')
    }

    return this.categoryRepository.delete(id)
  }
}
