import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry, TechnicianInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { UseGuards, Logger } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { ShapeIntoMongoObjectId, getSerialForImage, validMimeTypes } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream, mkdirSync } from 'fs';
import sharp from 'sharp';
import { Message } from '../../libs/enums/common_enum';

const ALLOWED_UPLOAD_TARGETS = ['member', 'property', 'article', 'repair', 'review'];

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) { }//dpendensiy injekshen

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Mutation(() => Member)
    public async signup(@Args('input') input: MemberInput, @Context() ctx: any): Promise<Member> {
        const member = await this.memberService.signup(input);
        this.setAuthCookie(ctx.res, member.accessToken as string);
        return member;
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput, @Context() ctx: any): Promise<Member> {
        const member = await this.memberService.login(input);
        this.setAuthCookie(ctx.res, member.accessToken as string);
        return member;
    }

    /** Access token muddati tugaganda refresh token evaziga yangi juftlik olish (guard'siz) */
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @Mutation(() => Member)
    public async refreshToken(@Args('refreshToken') refreshToken: string, @Context() ctx: any): Promise<Member> {
        const member = await this.memberService.refreshToken(refreshToken);
        this.setAuthCookie(ctx.res, member.accessToken as string);
        return member;
    }

    @UseGuards(AuthGuard)
    @Query(() => Member)
    public async getMyProfile(@AuthMember('_id') memberId: ObjectId): Promise<Member> {
        return await this.memberService.getMyProfile(memberId);
    }

    private setAuthCookie(res: any, token: string): void {
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 60 * 60 * 1000, // 1 soat
        });
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
        return `Hi ${memberNick}`;
    }

    @Roles(MemberType.USER, MemberType.AGENT)
    @UseGuards(RolesGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember: Member): Promise<string> {
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args('input') input: MemberUpdate,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Member> {
        delete input._id;
        return await this.memberService.updateMember(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(
        @Args('memberId') input: string,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Member> {
        const targetId = ShapeIntoMongoObjectId(input)
        return await this.memberService.getMember(memberId, targetId);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getAgents(
        @Args('input') input: AgentsInquiry,
        @AuthMember('_id') memberId: ObjectId //
    ): Promise<Members> {
        return await this.memberService.getAgents(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getTechnicians(
        @Args('input') input: TechnicianInquiry,
        @AuthMember('_id') memberId: ObjectId //
    ): Promise<Members> {
        return await this.memberService.getTechnicians(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async likeTargetMember(
        @Args('memberId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Member> {
        const likeRefId = ShapeIntoMongoObjectId(input)
        return await this.memberService.likeTargetMember(memberId, likeRefId);
    }

    /** ADMIN **/

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query(() => Members)
    public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
        return await this.memberService.getAllMembersByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member)
    public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
        return await this.memberService.updateMemberByAdmin(input);
    }

    /** UPLOADER **/

    @UseGuards(AuthGuard)
    @Mutation((returns) => String)
    public async imageUploader(
        @Args({ name: 'file', type: () => GraphQLUpload })
        { createReadStream, filename, mimetype }: FileUpload,
        @Args('target') target: String,
    ): Promise<string> {

        if (!filename) throw new Error(Message.UPLOAD_FAILED);
        // Path traversal himoyasi — target faqat ruxsat etilgan papkalardan bo'lsin
        if (!ALLOWED_UPLOAD_TARGETS.includes(String(target))) throw new Error(Message.UPLOAD_FAILED);
        const validMime = validMimeTypes.includes(mimetype);
        if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

        // Sharp baribir JPEG'ga qayta kodlaydi — kengaytma doim .jpg
        const imageName = getSerialForImage(filename).replace(/\.[a-z0-9]+$/i, '') + '.jpg';
        mkdirSync(`uploads/${target}`, { recursive: true });
        const url = `uploads/${target}/${imageName}`;
        const stream = createReadStream();

        const transformer = sharp()
            .rotate()
            .resize({ width: 1400, withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true, mozjpeg: true });

        const result = await new Promise((resolve, reject) => {
            stream
                .pipe(transformer)
                .pipe(createWriteStream(url))
                .on('finish', async () => resolve(true))
                .on('error', () => reject(false));
        });
        if (!result) throw new Error(Message.UPLOAD_FAILED);

        return url;
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => [String])
    public async imagesUploader(
        @Args('files', { type: () => [GraphQLUpload] })
        files: Promise<FileUpload>[],
        @Args('target') target: String,
    ): Promise<string[]> {

        const uploadedImages: string[] = [];
        const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
            try {
                const { filename, mimetype, encoding, createReadStream } = await img;

                if (!ALLOWED_UPLOAD_TARGETS.includes(String(target))) throw new Error(Message.UPLOAD_FAILED);
                const validMime = validMimeTypes.includes(mimetype);
                if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

                const imageName = getSerialForImage(filename).replace(/\.[a-z0-9]+$/i, '') + '.jpg';
                mkdirSync(`uploads/${target}`, { recursive: true });
                const url = `uploads/${target}/${imageName}`;
                const stream = createReadStream();

                const transformer = sharp()
                    .rotate()
                    .resize({ width: 1400, withoutEnlargement: true })
                    .jpeg({ quality: 80, progressive: true, mozjpeg: true });

                const result = await new Promise((resolve, reject) => {
                    stream
                        .pipe(transformer)
                        .pipe(createWriteStream(url))
                        .on('finish', () => resolve(true))
                        .on('error', () => reject(false));
                });
                if (!result) throw new Error(Message.UPLOAD_FAILED);

                uploadedImages[index] = url;

            } catch (err) {
                Logger.error('Error, file missing!', err);
            }
        });

        await Promise.all(promisedList);
        return uploadedImages;
    }
}
