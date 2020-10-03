import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import {v4 as uuidv4} from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() : Task[] { 
    return this.tasks;
  }

  getTaskById( id: string ) : Task {
    return this.tasks.find(task => task.id === id); 
  }

  getTaskWithFilter( filterDto: GetTasksFilterDto ) : Task[] {

    const{ status, search } = filterDto;

    let tasks = this.getAllTasks();
    
    if(status) tasks = tasks.filter(task => task.status === status);

    if(search) tasks = tasks.filter(task => 
      task.title.includes(search) || task.description.includes(search)
    );

    return tasks;
  }
  
  createTask( createTaskDto: CreateTaskDto ) : Task {

    const { title, description } = createTaskDto;

    const task : Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    }

    this.tasks.push(task);

    return task;
  }
  
  deleteTask( id: string ) : void {
    // o metodo filter cria um novo array com todos os elementos que passaram no teste da função fornecida.
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updateTashStatus( id:string, status: TaskStatus ){
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

}
