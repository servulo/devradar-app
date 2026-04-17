import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('search_history')
export class SearchHistory {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    city!: string;
    
    @Column()
    country!: string;

    @Column('decimal', {precision: 5, scale: 2})
    temperature!: number;

    @Column()
    description!: string;

    @Column('decimal', {precision: 5, scale: 2})
    humidity!: number;

    @Column('decimal', {precision: 5, scale: 2})
    windSpeed!: number;

    @CreateDateColumn()
    searchedAt!: Date;

}