import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ColorService } from './color.service';
import { CreateColorDto, UpdateColorDto } from './dto';
import { Roles } from 'src/decorator/roles.decorator';
import { UserType } from 'src/user/schema/user.schema';

@Controller('color')
export class ColorController {
    constructor(
        private readonly colorService: ColorService
    ) { }

    @Roles([UserType.ADMIN])
    @Post()
    createColor(
        @Body() body: CreateColorDto
    ) {
        return this.colorService.createColor(body)
    }

    @Roles([UserType.ADMIN])
    @Patch(':id')
    updateColor(
        @Param('id') colorId: string,
        @Body() body: UpdateColorDto
    ) {
        return this.colorService.updateColor(colorId, body)
    }

    @Roles([UserType.ADMIN])
    @Delete(':id')
    deteledColor(
        @Param('id') colorId: string
    ) {
        return this.colorService.deteledColor(colorId)
    }
}
