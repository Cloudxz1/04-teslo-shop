import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helpe';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination:'./static/products',
      filename:fileNamer
    })
  }))
  uploadFiles(@UploadedFile() file: Express.Multer.File
  ){
    console.log({fileInController: file})

    if(!file){
      throw new BadRequestException('Es una imagen?');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {
      secureUrl
    };
  }

  @Get('product/:imageName')
  findProductImage(@Param('imageName') imageName:string,
  @Res() res: Response){
    const path = this.filesService.getStaticProductImage(imageName);
    // res.status(403).json({
    //     ok:false,
    //     path: path 
    // })

    res.sendFile(path);
    
    return path;
  }
}
