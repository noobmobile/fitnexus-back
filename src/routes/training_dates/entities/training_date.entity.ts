import { User } from 'src/routes/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TrainingDate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('date')
  date: Date;
  @ManyToOne(() => User, (user) => user.trainingDates)
  user: User;
}
