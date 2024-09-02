import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Training } from './training.entity';
import { Exercise } from 'src/routes/exercise/entities/exercise.entity';

@Entity()
export class TrainingExercise {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  load: number;
  @Column()
  repetitions: number;
  @Column()
  series: number;
  @ManyToOne(() => Training, (training) => training.exercises)
  training: Training;
  @ManyToOne(() => Exercise, (exercise) => exercise.trainings)
  exercise: Exercise;
}
