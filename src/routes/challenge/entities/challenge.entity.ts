import { User } from 'src/routes/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChallengeStatus } from './challenge.status';

@Entity()
export class Challenge {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  workouts_goal: number;
  @Column()
  weeks_duration: number;
  @Column()
  start_date: Date;
  @Column()
  end_date: Date;
  @ManyToOne(() => User, (user) => user.requesterChallenges)
  requester: User;
  @ManyToOne(() => User, (user) => user.requestedChallenges)
  requested: User;
  @Column({
    type: 'enum',
    enum: ChallengeStatus,
    default: ChallengeStatus.Pending,
  })
  status: ChallengeStatus;
}
