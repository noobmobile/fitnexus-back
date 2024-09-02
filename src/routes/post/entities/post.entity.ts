import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  content: string;
  @Column()
  image: string;
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
  @ManyToMany(() => User)
  @JoinTable()
  likes: User[];
  @CreateDateColumn()
  createdAt: Date;
}
