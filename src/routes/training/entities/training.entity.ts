import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TrainingExercise } from './training.exercise.entity';
import { User } from 'src/routes/user/entities/user.entity';

@Entity()
export class Training {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ nullable: true })
  image: string;
  @OneToMany(() => TrainingExercise, (exercise) => exercise.training, {
    eager: true,
    cascade: true,
  })
  exercises: TrainingExercise[];
  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
