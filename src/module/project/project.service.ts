import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    return await this.projectRepo.save(
      this.projectRepo.create(createProjectDto),
    );
  }

  async findAll() {
    return await this.projectRepo.find();
  }

  async findOne(id: string) {
    const project = this.projectRepo.findOneBy({ id });

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await this.findOne(id);
    await this.projectRepo.update(id, updateProjectDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const project = await this.findOne(id);
    await this.projectRepo.delete(id);
    return `Delete project success`;
  }
}
