import { TrainingExercise } from 'src/routes/training/entities/training.exercise.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @OneToMany(() => TrainingExercise, (exercise) => exercise.exercise)
  trainings: TrainingExercise[];
}
