import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'products'})
export class Product {

    @ApiProperty({
        example: '0506bc9b-a52b-4bf1-a340-b38a03259c20',
        description: 'Product ID',
        uniqueItems:true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-shirt Teslo',
        description: 'Product Title',
        uniqueItems:true
    })
    @Column('text',{
        unique:true,
    })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product price',
        uniqueItems:true
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Una description xd',
        description: 'Product description',
        uniqueItems:true
    })
    @Column({
        type:'text',
        nullable:true
    })
    description: string;

    @ApiProperty({
        example: 'T_shirt_teslo',
        description: 'Product slug SEO',
        uniqueItems:true
    })
    @Column({
        type:'text',
        unique:true,
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product stock',
        default:0
    })
    @Column('int',{
        default:0,
    })
    stock: number;

    @ApiProperty({
        example: ['M','S','XL'],
        description: 'Product sizes',
        default:0
    })
    @Column('text', {
        array:true
    })
    sizes: string[];

    @ApiProperty({
        example: "women",
        description: 'Product gender',
    })
    @Column('text')
    gender:string

    @ApiProperty({
        example: ['test','test2'],
        description: 'Product tags',
        default:0
    })
    @Column({
        type:'text',
        array:true,
        default:[]
    })
    tags:string[]

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager:true}
    )
    images?: ProductImage[];

    @ApiProperty()
    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager:true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
}
