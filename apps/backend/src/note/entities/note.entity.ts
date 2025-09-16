// 引入TypeORM装饰器，用于数据库操作
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * 用户笔记实体类
 * @Entity('user_notes') 装饰器指定对应的数据库表名
 * 这个类的实例对应数据库表中的一行笔记记录
 */
@Entity("user_notes")
export class Note {
  /**
   * 主键ID
   * @PrimaryGeneratedColumn() 装饰器表示这是一个自增主键
   * 数据库会自动为每条记录生成唯一的ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户ID（外键）
   * @Column 装饰器定义数据库列
   * name: 指定数据库中的实际列名为 'user_id'
   */
  @Column({ name: "user_id" })
  userId: number;

  /**
   * 笔记内容
   * type: 'text' 支持长文本内容
   */
  @Column({ type: "text" })
  note: string;

  /**
   * 记录创建时间
   * @CreateDateColumn 装饰器自动管理创建时间
   * 使用 timestamptz（带时区的时间戳）类型
   */
  @CreateDateColumn({ name: "create_time", type: "timestamptz" })
  createTime: Date;

  /**
   * 记录更新时间
   * @UpdateDateColumn 装饰器自动管理更新时间
   * 每次保存记录时都会自动更新这个字段
   */
  @UpdateDateColumn({ name: "update_time", type: "timestamptz" })
  updateTime: Date;
}
