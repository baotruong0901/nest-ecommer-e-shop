export interface createCategoryParams {
    name: string,
    image: Express.Multer.File
}

export interface updateCategoryParams {
    name?: string,
    image?: Express.Multer.File
}