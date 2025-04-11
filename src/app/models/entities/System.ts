import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "systems" })
export class System {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 500 })
    logo!: string;
    
    @Column({ type: "varchar", length: 500 })
    qr_code!: string;
    
    @Column({ type: "varchar", length: 20 })
    phone!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    zalo?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    facebook?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    tiktok?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    youtube?: string;

    @CreateDateColumn({ type: "timestamp" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at?: Date;
}
