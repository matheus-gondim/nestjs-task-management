import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./task.model";

@Entity()
export class TaskEntity extends BaseEntity {
  // => indica que essa coluna é a primarykey e que deve ser gerado e incrementado automaticamente
  @PrimaryGeneratedColumn() 
  id:number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;
}
