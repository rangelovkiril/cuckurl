CREATE TABLE users (
    import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";

    @Entity()
    export class User {
        @PrimaryGeneratedColumn("increment")
        id: number;

        @Column({ type: "varchar", length: 50, unique: true })
        username: string;

        @Column({ type: "varchar", length: 100, unique: true })
        email: string;

        @Column({ type: "varchar", length: 255 })
        passwordHash: string;

        @CreateDateColumn()
        createdAt: Date;

        @Column({ type: "timestamp", nullable: true })
        lastLogin: Date | null;

        @Column({ type: "enum", enum: ["active", "suspended", "deleted"], default: "active" })
        status: "active" | "suspended" | "deleted";

        @OneToMany(() => Link, (link) => link.user)
        links: Link[];
    }

    @Entity()
    export class Link {
        @PrimaryGeneratedColumn("increment")
        id: number;

        @ManyToOne(() => User, (user) => user.links, { onDelete: "CASCADE" })
        user: User;

        @Column({ type: "text" })
        originalUrl: string;

        @Column({ type: "varchar", length: 50, unique: true })
        shortUrl: string;

        @CreateDateColumn()
        createdAt: Date;

        @Column({ type: "timestamp", nullable: true })
        expiresAt: Date | null;

        @Column({ type: "int", default: 0 })
        visitCount: number;

        @Column({ type: "varchar", length: 255, nullable: true })
        title: string | null;
    }
);