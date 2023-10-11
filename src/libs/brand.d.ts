export interface createBrandParams {
    name: string,
    image: Express.Multer.File
}

export interface updateBrandParams {
    name?: string,
    image?: Express.Multer.File
}