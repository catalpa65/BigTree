// 引入TypeORM装饰器，用于数据库操作
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn, // 更新时间装饰器，自动更新记录修改时间
} from "typeorm";

/**
 * 用户打卡记录实体类
 * @Entity('user_punch_records') 装饰器指定对应的数据库表名
 * 这个类的实例对应数据库表中的一行记录
 */
@Entity("user_punch_records")
export class PunchRecord {
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
   * TypeScript属性名用驼峰式命名，数据库列名用下划线命名
   */
  @Column({ name: "user_id" })
  userId: number;

  /**
   * 打卡时间
   * Postgres 不支持 'datetime'，使用 'timestamptz'（带时区的时间戳）
   */
  @Column({ name: "punch_time", type: "timestamptz" })
  punchTime: Date;

  /**
   * 记录创建时间
   */
  @CreateDateColumn({ name: "create_time", type: "timestamptz" })
  createTime: Date;

  /**
   * 记录更新时间
   */
  @UpdateDateColumn({ name: "update_time", type: "timestamptz" })
  updateTime: Date;
}
