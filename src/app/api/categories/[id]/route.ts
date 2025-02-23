import {connectDB} from "@/app/models/connect";
import {Category} from "@/app/models/entities/Category";
import {NextResponse} from "next/server";
import {uploadFileToPinata} from "@/app/services/pinataService";

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const categoryId: string = params.id
        const categoryRepository = await connectDB(Category);
        const category: object | null = await categoryRepository.findOne({where: {id: Number(categoryId)}})
        if (!category) {
            return NextResponse.json({
                result: false,
                message: "Category not found server"
            }, {status: 400})
        }
        return NextResponse.json({category})
    } catch (e) {
        return NextResponse.json({
            result: false, message: (e as Error).message
        }, {status: 500})
    }
}

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const categoryRepo = await connectDB(Category);
        const formData = await req.formData();

        const newData: any = Object.fromEntries(formData.entries());

        if (!newData.name) return NextResponse.json({ result: false, message: "Invalid data" }, { status: 400 });


        if (newData.image instanceof Blob) {
            newData.image = await uploadFileToPinata(newData.image, newData.name);
        }
        await categoryRepo.update(params.id, newData);
        return NextResponse.json({ result: true, message: "Success", data: newData });

    } catch (e) {
        return NextResponse.json({ result: false, message: `Lỗi: ${(e as Error).message}` }, { status: 500 });
    }
};

export const DELETE = async (req:Request, {params} : {params: {id: string}}) => {
    try {
        const categoryRepo = await connectDB(Category);
        const categoryId = params.id
        await categoryRepo.softDelete(categoryId);
        return NextResponse.json({
            result: true,
            message: "Soft delete category successfully!"
        }, {status: 200})
    } catch (e) {
        return NextResponse.json({
            result: false,
            message: (e as Error).message
        }, {status: 500})
    }
}