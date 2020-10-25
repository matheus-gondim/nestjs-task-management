import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {
  id: 1,
  username: 'Test user',
};

const mockTask = {
  title: 'Test task',
  description: 'Test desc',
};

const mockFilters = {
  status: TaskStatus.IN_PROGRESS,
  search: 'Some search query',
};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('TaskServices', () => {
  let taskServices;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskServices = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const result = await taskServices.getTasks(mockFilters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRespository.findOne() and succesffuly retrieve and return the task', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskServices.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(taskServices.getTaskById(1, mockUser)).rejects.toThrow();
    });
  });

  describe('createTesk', () => {
    it('calls taskRepository.create() and return the result', async () => {
      taskRepository.createTask.mockResolvedValue('some Task');

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const result = await taskRepository.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockTask,
        mockUser,
      );
      expect(result).toEqual('some Task');
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await taskServices.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('throws an error as task could not be found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      expect(taskServices.deleteTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      taskServices.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(taskServices.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await taskServices.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockTask,
      );
      expect(taskServices.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
