import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/routes/auth/models/UserRole';
import { Challenge } from 'src/routes/challenge/entities/challenge.entity';
import { Notification } from 'src/routes/notification/entities/notification.entity';
import { Post } from 'src/routes/post/entities/post.entity';
import { TrainingDate } from 'src/routes/training_dates/entities/training_date.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  goal: string;

  @Column()
  workouts_per_week: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ unique: true })
  login: string;

  @Column()
  @ApiHideProperty()
  @Exclude({ toPlainOnly: true })
  password: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @ManyToMany(() => User)
  @JoinTable()
  friendRequests: User[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => TrainingDate, (trainingDate) => trainingDate.user)
  trainingDates: TrainingDate[];

  @OneToMany(() => Challenge, (challenge) => challenge.requester)
  requesterChallenges: Challenge[];

  @OneToMany(() => Challenge, (challenge) => challenge.requested)
  requestedChallenges: Challenge[];
}
