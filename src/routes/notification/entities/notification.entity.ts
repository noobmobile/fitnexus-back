import { User } from 'src/routes/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notification' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column({ default: false })
  readed: boolean;
  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
