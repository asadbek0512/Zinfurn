/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const app_controller_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(5);
const config_1 = __webpack_require__(6);
const graphql_1 = __webpack_require__(7);
const apollo_1 = __webpack_require__(8);
const app_resolver_1 = __webpack_require__(9);
const components_module_1 = __webpack_require__(10);
const database_module_1 = __webpack_require__(105);
const socket_module_1 = __webpack_require__(57);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                playground: true,
                uploads: false,
                autoSchemaFile: true,
                formatError: (error) => {
                    const graphQLFormattedError = {
                        code: error?.extensions.code,
                        message: error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
                    };
                    console.log("GRAPHQL GLOBAL ERR:", graphQLFormattedError);
                    return graphQLFormattedError;
                },
            }),
            components_module_1.ComponentsModule,
            database_module_1.DatabaseModule, socket_module_1.SocketModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_resolver_1.AppResolver],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(5);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Welcome to Nestar API Server!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppResolver = void 0;
const graphql_1 = __webpack_require__(7);
let AppResolver = class AppResolver {
    sayHello() {
        return 'GraphQl API Server';
    }
};
exports.AppResolver = AppResolver;
__decorate([
    (0, graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppResolver.prototype, "sayHello", null);
exports.AppResolver = AppResolver = __decorate([
    (0, graphql_1.Resolver)()
], AppResolver);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentsModule = void 0;
const common_1 = __webpack_require__(3);
const member_module_1 = __webpack_require__(11);
const property_module_1 = __webpack_require__(63);
const auth_module_1 = __webpack_require__(49);
const board_article_module_1 = __webpack_require__(70);
const comment_module_1 = __webpack_require__(76);
const follow_module_1 = __webpack_require__(92);
const like_module_1 = __webpack_require__(53);
const view_module_1 = __webpack_require__(51);
const repair_property_module_1 = __webpack_require__(86);
const notification_module_1 = __webpack_require__(55);
const notice_module_1 = __webpack_require__(96);
let ComponentsModule = class ComponentsModule {
};
exports.ComponentsModule = ComponentsModule;
exports.ComponentsModule = ComponentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            member_module_1.MemberModule,
            auth_module_1.AuthModule,
            property_module_1.PropertyModule,
            board_article_module_1.BoardArticleModule,
            comment_module_1.CommentModule,
            like_module_1.LikeModule,
            view_module_1.ViewModule,
            follow_module_1.FollowModule,
            repair_property_module_1.RepairPropertyModule,
            notification_module_1.NotificationModule,
            notice_module_1.NoticeModule,
        ],
    })
], ComponentsModule);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberModule = void 0;
const common_1 = __webpack_require__(3);
const member_resolver_1 = __webpack_require__(12);
const member_service_1 = __webpack_require__(13);
const mongoose_1 = __webpack_require__(14);
const Member_model_1 = __webpack_require__(48);
const auth_module_1 = __webpack_require__(49);
const view_module_1 = __webpack_require__(51);
const like_module_1 = __webpack_require__(53);
const Follow_model_1 = __webpack_require__(62);
let MemberModule = class MemberModule {
};
exports.MemberModule = MemberModule;
exports.MemberModule = MemberModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Member', schema: Member_model_1.default }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Follow', schema: Follow_model_1.default }]),
            auth_module_1.AuthModule,
            view_module_1.ViewModule,
            like_module_1.LikeModule,
        ],
        providers: [member_resolver_1.MemberResolver, member_service_1.MemberService],
        exports: [member_service_1.MemberService]
    })
], MemberModule);


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberResolver = void 0;
const graphql_1 = __webpack_require__(7);
const member_service_1 = __webpack_require__(13);
const member_input_1 = __webpack_require__(35);
const member_1 = __webpack_require__(37);
const common_1 = __webpack_require__(3);
const auth_guard_1 = __webpack_require__(40);
const authMember_decorator_1 = __webpack_require__(41);
const mongoose_1 = __webpack_require__(15);
const roles_decorator_1 = __webpack_require__(42);
const member_enum_1 = __webpack_require__(16);
const roles_guard_1 = __webpack_require__(43);
const member_update_1 = __webpack_require__(44);
const config_1 = __webpack_require__(21);
const without_guard_1 = __webpack_require__(45);
const graphql_upload_1 = __webpack_require__(46);
const fs_1 = __webpack_require__(47);
const common_enum_1 = __webpack_require__(17);
let MemberResolver = class MemberResolver {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    async signup(input) {
        console.log('Mutation: signup');
        return await this.memberService.signup(input);
    }
    async login(input) {
        console.log('Mutation: login');
        return await this.memberService.login(input);
    }
    async checkAuth(memberNick) {
        console.log('Query: checkAuth');
        console.log("memberNick:", memberNick);
        return `Hi ${memberNick}`;
    }
    async checkAuthRoles(authMember) {
        console.log('Query: checkAuth');
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }
    async updateMember(input, memberId) {
        console.log('Mutation: updateMember');
        delete input._id;
        return await this.memberService.updateMember(memberId, input);
    }
    async getMember(input, memberId) {
        console.log('Query: getMember');
        const targetId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.memberService.getMember(memberId, targetId);
    }
    async getAgents(input, memberId) {
        console.log('Query: getMember');
        return await this.memberService.getAgents(memberId, input);
    }
    async getTechnicians(input, memberId) {
        console.log('Query: getMember');
        return await this.memberService.getTechnicians(memberId, input);
    }
    async likeTargetMember(input, memberId) {
        console.log('Mutation: likeTargetMember');
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.memberService.likeTargetMember(memberId, likeRefId);
    }
    async getAllMembersByAdmin(input) {
        console.log('Mutation: getAllMembersByAdmin');
        return await this.memberService.getAllMembersByAdmin(input);
    }
    async updateMemberByAdmin(input) {
        console.log('Mutation: updateMemberByAdmin');
        return await this.memberService.updateMemberByAdmin(input);
    }
    async imageUploader({ createReadStream, filename, mimetype }, target) {
        console.log('Mutation: imageUploader');
        if (!filename)
            throw new Error(common_enum_1.Message.UPLOAD_FAILED);
        const validMime = config_1.validMimeTypes.includes(mimetype);
        if (!validMime)
            throw new Error(common_enum_1.Message.PROVIDE_ALLOWED_FORMAT);
        const imageName = (0, config_1.getSerialForImage)(filename);
        const url = `uploads/${target}/${imageName}`;
        const stream = createReadStream();
        const result = await new Promise((resolve, reject) => {
            stream
                .pipe((0, fs_1.createWriteStream)(url))
                .on('finish', async () => resolve(true))
                .on('error', () => reject(false));
        });
        if (!result)
            throw new Error(common_enum_1.Message.UPLOAD_FAILED);
        return url;
    }
    async imagesUploader(files, target) {
        console.log('Mutation: imagesUploader');
        const uploadedImages = [];
        const promisedList = files.map(async (img, index) => {
            try {
                const { filename, mimetype, encoding, createReadStream } = await img;
                const validMime = config_1.validMimeTypes.includes(mimetype);
                if (!validMime)
                    throw new Error(common_enum_1.Message.PROVIDE_ALLOWED_FORMAT);
                const imageName = (0, config_1.getSerialForImage)(filename);
                const url = `uploads/${target}/${imageName}`;
                const stream = createReadStream();
                const result = await new Promise((resolve, reject) => {
                    stream
                        .pipe((0, fs_1.createWriteStream)(url))
                        .on('finish', () => resolve(true))
                        .on('error', () => reject(false));
                });
                if (!result)
                    throw new Error(common_enum_1.Message.UPLOAD_FAILED);
                uploadedImages[index] = url;
            }
            catch (err) {
                console.log('Error, file missing!');
            }
        });
        await Promise.all(promisedList);
        return uploadedImages;
    }
};
exports.MemberResolver = MemberResolver;
__decorate([
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof member_input_1.MemberInput !== "undefined" && member_input_1.MemberInput) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], MemberResolver.prototype, "signup", null);
__decorate([
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof member_input_1.LoginInput !== "undefined" && member_input_1.LoginInput) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], MemberResolver.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => String),
    __param(0, (0, authMember_decorator_1.AuthMember)('memberNick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], MemberResolver.prototype, "checkAuth", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.USER, member_enum_1.MemberType.AGENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => String),
    __param(0, (0, authMember_decorator_1.AuthMember)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], MemberResolver.prototype, "checkAuthRoles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof member_update_1.MemberUpdate !== "undefined" && member_update_1.MemberUpdate) === "function" ? _j : Object, typeof (_k = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], MemberResolver.prototype, "updateMember", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('memberId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _m : Object]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], MemberResolver.prototype, "getMember", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => member_1.Members),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof member_input_1.AgentsInquiry !== "undefined" && member_input_1.AgentsInquiry) === "function" ? _p : Object, typeof (_q = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], MemberResolver.prototype, "getAgents", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => member_1.Members),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof member_input_1.TechnicianInquiry !== "undefined" && member_input_1.TechnicianInquiry) === "function" ? _s : Object, typeof (_t = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _t : Object]),
    __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
], MemberResolver.prototype, "getTechnicians", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('memberId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_v = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _v : Object]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], MemberResolver.prototype, "likeTargetMember", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => member_1.Members),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_x = typeof member_input_1.MembersInquiry !== "undefined" && member_input_1.MembersInquiry) === "function" ? _x : Object]),
    __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
], MemberResolver.prototype, "getAllMembersByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_z = typeof member_update_1.MemberUpdate !== "undefined" && member_update_1.MemberUpdate) === "function" ? _z : Object]),
    __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
], MemberResolver.prototype, "updateMemberByAdmin", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => String),
    __param(0, (0, graphql_1.Args)({ name: 'file', type: () => graphql_upload_1.GraphQLUpload })),
    __param(1, (0, graphql_1.Args)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_1 = typeof graphql_upload_1.FileUpload !== "undefined" && graphql_upload_1.FileUpload) === "function" ? _1 : Object, typeof (_2 = typeof String !== "undefined" && String) === "function" ? _2 : Object]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], MemberResolver.prototype, "imageUploader", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => [String]),
    __param(0, (0, graphql_1.Args)('files', { type: () => [graphql_upload_1.GraphQLUpload] })),
    __param(1, (0, graphql_1.Args)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, typeof (_4 = typeof String !== "undefined" && String) === "function" ? _4 : Object]),
    __metadata("design:returntype", typeof (_5 = typeof Promise !== "undefined" && Promise) === "function" ? _5 : Object)
], MemberResolver.prototype, "imagesUploader", null);
exports.MemberResolver = MemberResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _a : Object])
], MemberResolver);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const member_enum_1 = __webpack_require__(16);
const common_enum_1 = __webpack_require__(17);
const auth_service_1 = __webpack_require__(18);
const view_service_1 = __webpack_require__(25);
const view_enum_1 = __webpack_require__(26);
const like_enum_1 = __webpack_require__(27);
const like_service_1 = __webpack_require__(28);
const config_1 = __webpack_require__(21);
let MemberService = class MemberService {
    memberModel;
    followModel;
    authService;
    viewService;
    likeService;
    repairPropertyStatsEditor(arg0) {
        throw new Error('Method not implemented.');
    }
    constructor(memberModel, followModel, authService, viewService, likeService) {
        this.memberModel = memberModel;
        this.followModel = followModel;
        this.authService = authService;
        this.viewService = viewService;
        this.likeService = likeService;
    }
    async signup(input) {
        input.memberPassword = await this.authService.hashPassword(input.memberPassword);
        try {
            const result = await this.memberModel.create(input);
            result.accessToken = await this.authService.createToken(result);
            return result;
        }
        catch (err) {
            console.log('Error, Service.model:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.USED_MEMBER_NICK_OR_PHONE);
        }
    }
    async login(input) {
        const { memberNick, memberPassword, memberEmail } = input;
        const response = await this.memberModel
            .findOne({
            $or: [
                memberNick ? { memberNick } : null,
                memberEmail ? { memberEmail } : null,
            ].filter(Boolean),
        })
            .select('+memberPassword')
            .exec();
        if (!response || response.memberStatus === member_enum_1.MemberStatus.DELETE) {
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_MEMBER_NICK);
        }
        else if (response.memberStatus === member_enum_1.MemberStatus.BLOCK) {
            throw new common_1.InternalServerErrorException(common_enum_1.Message.BLOCKED_USER);
        }
        const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword || '');
        if (!isMatch)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.WRONG_PASSWORD);
        response.accessToken = await this.authService.createToken(response);
        return response;
    }
    async updateMember(memberId, input) {
        const result = await this.memberModel
            .findOneAndUpdate({
            _id: memberId,
            memberStatus: member_enum_1.MemberStatus.ACTIVE
        }, input, { new: true })
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        result.accessToken = await this.authService.createToken(result);
        return result;
    }
    async getMember(memberId, targetId) {
        const search = {
            _id: targetId,
            memberStatus: {
                $in: [member_enum_1.MemberStatus.ACTIVE, member_enum_1.MemberStatus.BLOCK],
            },
        };
        const targetMember = await this.memberModel.findOne(search).lean().exec();
        if (!targetMember)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: targetId, viewGroup: view_enum_1.ViewGroup.MEMBER };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.memberModel.findOneAndUpdate(search, { $inc: { memberViews: 1 } }, { new: true }).exec();
                targetMember.memberViews++;
            }
            const LikeInput = { memberId: memberId, likeRefId: targetId, likeGroup: like_enum_1.LikeGroup.MEMBER };
            targetMember.meLiked = await this.likeService.checkLikeExistence(LikeInput);
            targetMember.meFollowed = await this.checkSubscription(memberId, targetId);
        }
        return targetMember;
    }
    async checkSubscription(followerId, followingId) {
        const result = await this.followModel.findOne({ followingId: followingId, followerId: followerId }).exec();
        return result ? [{ followerId: followerId, followingId: followingId, myFollowing: true }] : [];
    }
    async getAgents(memberId, input) {
        const { text } = input.search;
        const match = { memberType: member_enum_1.MemberType.AGENT, memberStatus: member_enum_1.MemberStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        if (text)
            match.memberNick = { $regex: new RegExp(text, 'i') };
        console.log('match: ', match);
        const result = await this.memberModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId),
                    ],
                    metaCounter: [{ $count: 'total' }],
                }
            }
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async getTechnicians(memberId, input) {
        const { text } = input.search;
        const match = { memberType: member_enum_1.MemberType.TECHNICIAN, memberStatus: member_enum_1.MemberStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        if (text)
            match.memberNick = { $regex: new RegExp(text, 'i') };
        console.log('match: ', match);
        const result = await this.memberModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId),
                    ],
                    metaCounter: [{ $count: 'total' }],
                }
            }
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async likeTargetMember(memberId, likeRefId) {
        const target = await this.memberModel.findOne({ _id: likeRefId, memberStatus: member_enum_1.MemberStatus.ACTIVE }).exec();
        if (!target)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        const input = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: like_enum_1.LikeGroup.MEMBER
        };
        const modifier = await this.likeService.toggleLike(input);
        const result = await this.memberStatsEditor({ _id: likeRefId, targetKey: 'memberLikes', modifier: modifier });
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.SOMETHING_WENT_WRONG);
        return result;
    }
    async getAllMembersByAdmin(input) {
        const { memberStatus, memberType, text } = input.search;
        const match = {};
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        console.log("input", input);
        if (memberStatus)
            match.memberStatus = memberStatus;
        if (memberType)
            match.memberType = memberType;
        if (text)
            match.memberNick = { $regex: new RegExp(text, 'i') };
        console.log('match: ', match);
        const result = await this.memberModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
                    metaCounter: [{ $count: 'total' }],
                }
            }
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async updateMemberByAdmin(input) {
        const result = await this.memberModel.findOneAndUpdate({ _id: input._id }, input, { new: true }).exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        return result;
    }
    async memberStatsEditor(input) {
        const { _id, targetKey, modifier } = input;
        return await this.memberModel
            .findByIdAndUpdate(_id, {
            $inc: { [targetKey]: modifier },
        }, { new: true }).exec();
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Member')),
    __param(1, (0, mongoose_1.InjectModel)('Follow')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _c : Object, typeof (_d = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _d : Object, typeof (_e = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _e : Object])
], MemberService);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberAuthType = exports.MemberStatus = exports.MemberType = void 0;
const graphql_1 = __webpack_require__(7);
var MemberType;
(function (MemberType) {
    MemberType["USER"] = "USER";
    MemberType["AGENT"] = "AGENT";
    MemberType["ADMIN"] = "ADMIN";
    MemberType["TECHNICIAN"] = "TECHNICIAN";
})(MemberType || (exports.MemberType = MemberType = {}));
(0, graphql_1.registerEnumType)(MemberType, {
    name: "MemberType",
});
var MemberStatus;
(function (MemberStatus) {
    MemberStatus["ACTIVE"] = "ACTIVE";
    MemberStatus["BLOCK"] = "BLOCK";
    MemberStatus["DELETE"] = "DELETE";
})(MemberStatus || (exports.MemberStatus = MemberStatus = {}));
(0, graphql_1.registerEnumType)(MemberStatus, {
    name: "MemberStatus",
});
var MemberAuthType;
(function (MemberAuthType) {
    MemberAuthType["PHONE"] = "PHONE";
    MemberAuthType["EMAIL"] = "EMAIL";
    MemberAuthType["TELEGRAM"] = "TELEGRAM";
})(MemberAuthType || (exports.MemberAuthType = MemberAuthType = {}));
(0, graphql_1.registerEnumType)(MemberAuthType, {
    name: "MemberAuthType",
});


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Direction = exports.Message = void 0;
const graphql_1 = __webpack_require__(7);
var Message;
(function (Message) {
    Message["SOMETHING_WENT_WRONG"] = "Something went wrong!";
    Message["NO_DATA_FOUND"] = "No data found!";
    Message["CREATE_FAILED"] = "Create failed!";
    Message["UPDATE_FAILED"] = "Update failed!";
    Message["REMOVE_FAILED"] = "Remove failed!";
    Message["UPLOAD_FAILED"] = "Upload failed!";
    Message["BAD_REQUEST"] = "Bad Request";
    Message["USED_MEMBER_NICK_OR_PHONE"] = "Already used member nick or phone!";
    Message["NO_MEMBER_NICK"] = "No member with that member nick!";
    Message["BLOCKED_USER"] = "You have been blocked!";
    Message["WRONG_PASSWORD"] = "Wrong password, try again!";
    Message["NOT_AUTHENTICATED"] = "You are not authenticated, please login first!";
    Message["TOKEN_NOT_EXIST"] = "Bearer Token is not provided!";
    Message["ONLY_SPECIFIC_ROLES_ALLOWED"] = "Allowed only for members with specific roles!";
    Message["NOT_ALLOWED_REQUEST"] = "Not Allowed Request!";
    Message["PROVIDE_ALLOWED_FORMAT"] = "Please provide jpg, jpeg or png images!";
    Message["SELF_SUBSCRIPTION_DENIED"] = "Self subscription is denied!";
})(Message || (exports.Message = Message = {}));
var Direction;
(function (Direction) {
    Direction[Direction["ASC"] = 1] = "ASC";
    Direction[Direction["DESC"] = -1] = "DESC";
})(Direction || (exports.Direction = Direction = {}));
(0, graphql_1.registerEnumType)(Direction, {
    name: 'Direction',
});


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(19);
const bcrypt = __webpack_require__(20);
const config_1 = __webpack_require__(21);
let AuthService = class AuthService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async hashPassword(memberPassword) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(memberPassword, salt);
    }
    async comparePasswords(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    async createToken(member) {
        const payload = {};
        Object.keys(member['_doc'] ? member['_doc'] : member).map((ele) => {
            payload[`${ele}`] = member[`${ele}`];
        });
        delete payload.memberPassword;
        return await this.jwtService.signAsync(payload);
    }
    async verifyToken(token) {
        const member = await this.jwtService.verifyAsync(token);
        member._id = (0, config_1.ShapeIntoMongoObjectId)(member._id);
        return member;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object])
], AuthService);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lookupRepairVisit = exports.lookupVisit = exports.lookupRepairFavorite = exports.lookupFavorite = exports.lookupFollowerData = exports.lookupFollowingData = exports.lookupMember = exports.lookupAuthMemberFollowed = exports.lookupAuthMemberLiked = exports.ShapeIntoMongoObjectId = exports.getSerialForImage = exports.validMimeTypes = exports.availableCommentSorts = exports.availableBoardArticleSorts = exports.availableRepairPropertySorts = exports.availablePropertySorts = exports.availableOptions = exports.availableMemberSorts = exports.availableTechnician = exports.availableAgentSorts = void 0;
const bson_1 = __webpack_require__(22);
exports.availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
exports.availableTechnician = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
exports.availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];
exports.availableOptions = ['propertyBarter', 'propertyRent'];
exports.availablePropertySorts = [
    'createdAt',
    'updatedAt',
    'propertyLikes',
    'propertyViews',
    'propertyRank',
    'propertyPrice',
];
exports.availableRepairPropertySorts = [
    'createdAt',
    'updatedAt',
    'propertyLikes',
    'propertyViews',
    'propertyRank',
    'propertyPrice',
];
exports.availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];
exports.availableCommentSorts = ['createdAt', 'updatedAt'];
const uuid_1 = __webpack_require__(23);
const path = __webpack_require__(24);
exports.validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
const getSerialForImage = (filename) => {
    const ext = path.parse(filename).ext;
    return (0, uuid_1.v4)() + ext;
};
exports.getSerialForImage = getSerialForImage;
const ShapeIntoMongoObjectId = (target) => {
    return typeof target === 'string' ? new bson_1.ObjectId(target) : target;
};
exports.ShapeIntoMongoObjectId = ShapeIntoMongoObjectId;
const lookupAuthMemberLiked = (memberId, targetRefId = "$_id") => {
    return {
        $lookup: {
            from: 'likes',
            let: {
                localLikeRefId: targetRefId,
                localMemberId: memberId,
                localMyFavorite: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ['$likeRefId', '$$localLikeRefId'] }, { $eq: ['$memberId', '$$localMemberId'] }],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        myFavorite: '$$localMyFavorite',
                    },
                },
            ],
            as: 'meLiked',
        },
    };
};
exports.lookupAuthMemberLiked = lookupAuthMemberLiked;
const lookupAuthMemberFollowed = (input) => {
    const { followerId, followingId } = input;
    return {
        $lookup: {
            from: 'follows',
            let: {
                localFollowerId: followerId,
                localFollowingId: followingId,
                localMyFavorite: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [{ $eq: ['$followerId', '$$localFollowerId'] }, { $eq: ['$followingId', '$$localFollowingId'] }],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        followerId: 1,
                        followingId: 1,
                        myFollowing: '$$localMyFavorite',
                    },
                },
            ],
            as: 'meFollowed',
        },
    };
};
exports.lookupAuthMemberFollowed = lookupAuthMemberFollowed;
exports.lookupMember = {
    $lookup: {
        from: 'members',
        localField: 'memberId',
        foreignField: '_id',
        as: 'memberData',
    }
};
exports.lookupFollowingData = {
    $lookup: {
        from: 'members',
        localField: 'followingId',
        foreignField: '_id',
        as: 'followingData',
    },
};
exports.lookupFollowerData = {
    $lookup: {
        from: 'members',
        localField: 'followerId',
        foreignField: '_id',
        as: 'followerData',
    },
};
exports.lookupFavorite = {
    $lookup: {
        from: 'members',
        localField: 'favoriteProperty.memberId',
        foreignField: '_id',
        as: 'favoriteProperty.memberData',
    },
};
exports.lookupRepairFavorite = {
    $lookup: {
        from: 'members',
        localField: 'favoriteRepairProperty.memberId',
        foreignField: '_id',
        as: 'favoriteRepairProperty.memberData',
    },
};
exports.lookupVisit = {
    $lookup: {
        from: 'members',
        localField: 'visitedProperty.memberId',
        foreignField: '_id',
        as: 'visitedProperty.memberData',
    },
};
exports.lookupRepairVisit = {
    $lookup: {
        from: 'members',
        localField: 'visitedRepairProperty.memberId',
        foreignField: '_id',
        as: 'visitedRepairProperty.memberData',
    },
};


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("bson");

/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),
/* 24 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const view_enum_1 = __webpack_require__(26);
const config_1 = __webpack_require__(21);
let ViewService = class ViewService {
    viewModel;
    constructor(viewModel) {
        this.viewModel = viewModel;
    }
    async recordView(input) {
        const viewExist = await this.checkViewExistence(input);
        if (!viewExist) {
            console.log('- New View Insert -');
            return await this.viewModel.create(input);
        }
        else
            return null;
    }
    async checkViewExistence(input) {
        const { memberId, viewRefId } = input;
        const search = { memberId: memberId, viewRefId: viewRefId };
        return await this.viewModel.findOne(search).exec();
    }
    async getVisitedProperties(memberId, input) {
        const { page, limit } = input;
        const match = { viewGroup: view_enum_1.ViewGroup.PROPERTY, memberId: memberId };
        const data = await this.viewModel
            .aggregate([
            { $match: match },
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'viewRefId',
                    foreignField: '_id',
                    as: 'visitedProperty',
                },
            },
            { $unwind: '$visitedProperty' },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupVisit,
                        { $unwind: '$visitedProperty.memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        const result = { list: [], metaCounter: data[0].metaCounter };
        result.list = data[0].list.map((ele) => ele.visitedProperty);
        return result;
    }
    async getVisitedRepairProperties(memberId, input) {
        const { page, limit } = input;
        const match = { viewGroup: view_enum_1.ViewGroup.REPAIR_PROPERTY, memberId: memberId };
        const data = await this.viewModel
            .aggregate([
            { $match: match },
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: 'repair_requests',
                    localField: 'viewRefId',
                    foreignField: '_id',
                    as: 'visitedRepairProperty',
                },
            },
            { $unwind: '$visitedRepairProperty' },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupRepairVisit,
                        { $unwind: '$visitedRepairProperty.memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        const result = { list: [], metaCounter: data[0].metaCounter };
        result.list = data[0].list.map((ele) => ele.visitedRepairProperty);
        return result;
    }
};
exports.ViewService = ViewService;
exports.ViewService = ViewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('View')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ViewService);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewGroup = void 0;
const graphql_1 = __webpack_require__(7);
var ViewGroup;
(function (ViewGroup) {
    ViewGroup["MEMBER"] = "MEMBER";
    ViewGroup["ARTICLE"] = "ARTICLE";
    ViewGroup["PROPERTY"] = "PROPERTY";
    ViewGroup["REPAIR_PROPERTY"] = "REPAIR_PROPERTY";
})(ViewGroup || (exports.ViewGroup = ViewGroup = {}));
(0, graphql_1.registerEnumType)(ViewGroup, {
    name: 'ViewGroup',
});


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikeGroup = void 0;
const graphql_1 = __webpack_require__(7);
var LikeGroup;
(function (LikeGroup) {
    LikeGroup["MEMBER"] = "MEMBER";
    LikeGroup["PROPERTY"] = "PROPERTY";
    LikeGroup["ARTICLE"] = "ARTICLE";
    LikeGroup["REPAIR_PROPERTY"] = "REPAIR_PROPERTY";
})(LikeGroup || (exports.LikeGroup = LikeGroup = {}));
(0, graphql_1.registerEnumType)(LikeGroup, {
    name: 'LikeGroup',
});


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikeService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const common_enum_1 = __webpack_require__(17);
const like_enum_1 = __webpack_require__(27);
const config_1 = __webpack_require__(21);
const notification_service_1 = __webpack_require__(29);
const notification_enum_1 = __webpack_require__(30);
let LikeService = class LikeService {
    likeModel;
    notificationService;
    propertyModel;
    boardArticleModel;
    memberModel;
    constructor(likeModel, notificationService, propertyModel, boardArticleModel, memberModel) {
        this.likeModel = likeModel;
        this.notificationService = notificationService;
        this.propertyModel = propertyModel;
        this.boardArticleModel = boardArticleModel;
        this.memberModel = memberModel;
    }
    async toggleLike(input) {
        const search = { memberId: input.memberId, likeRefId: input.likeRefId }, exist = await this.likeModel.findOne(search).exec();
        let modifier = 1;
        if (exist) {
            await this.likeModel.findOneAndDelete(search).exec();
            modifier = -1;
        }
        else {
            try {
                await this.likeModel.create(input);
                let receiverId = input.likeRefId.toString();
                let notificationDesc = '';
                const liker = await this.memberModel.findById(input.memberId).exec();
                const likerName = liker ? liker.memberNick : 'Someone';
                if (input.likeGroup === like_enum_1.LikeGroup.PROPERTY) {
                    const property = await this.propertyModel.findById(input.likeRefId).exec();
                    if (property) {
                        receiverId = property.memberId.toString();
                        notificationDesc = `${likerName} liked your property "${property.propertyTitle}"`;
                    }
                }
                else if (input.likeGroup === like_enum_1.LikeGroup.ARTICLE) {
                    const article = await this.boardArticleModel.findById(input.likeRefId).exec();
                    if (article) {
                        receiverId = article.memberId.toString();
                        notificationDesc = `${likerName} liked your article "${article.articleTitle}"`;
                    }
                }
                else if (input.likeGroup === like_enum_1.LikeGroup.MEMBER) {
                    notificationDesc = `${likerName} liked your profile`;
                }
                else if (input.likeGroup === like_enum_1.LikeGroup.REPAIR_PROPERTY) {
                    notificationDesc = `${likerName} liked your Repair Property`;
                }
                await this.notificationService.createNotification({
                    notificationType: notification_enum_1.NotificationType.LIKE,
                    notificationGroup: this.mapLikeGroupToNotificationGroup(input.likeGroup),
                    notificationTitle: 'New Like',
                    notificationDesc: notificationDesc,
                    authorId: input.memberId.toString(),
                    receiverId: receiverId,
                });
            }
            catch (err) {
                console.log('Error, Service.model: ', err.message);
                throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
            }
        }
        console.log(`- Like modifier ${modifier} -`);
        return modifier;
    }
    mapLikeGroupToNotificationGroup(likeGroup) {
        switch (likeGroup) {
            case like_enum_1.LikeGroup.PROPERTY:
                return notification_enum_1.NotificationGroup.PROPERTY;
            case like_enum_1.LikeGroup.ARTICLE:
                return notification_enum_1.NotificationGroup.ARTICLE;
            case like_enum_1.LikeGroup.MEMBER:
                return notification_enum_1.NotificationGroup.MEMBER;
            case like_enum_1.LikeGroup.REPAIR_PROPERTY:
                return notification_enum_1.NotificationGroup.REPAIR_PROPERTY;
            default:
                return notification_enum_1.NotificationGroup.MEMBER;
        }
    }
    async checkLikeExistence(input) {
        const { memberId, likeRefId } = input;
        const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
        return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
    }
    async getFavoriteProperties(memberId, input) {
        const { page, limit } = input;
        const match = { likeGroup: like_enum_1.LikeGroup.PROPERTY, memberId: memberId };
        const data = await this.likeModel
            .aggregate([
            { $match: match },
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: 'properties',
                    localField: 'likeRefId',
                    foreignField: '_id',
                    as: 'favoriteProperty',
                },
            },
            { $unwind: '$favoriteProperty' },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupFavorite,
                        { $unwind: '$favoriteProperty.memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        const result = { list: [], metaCounter: data[0].metaCounter };
        result.list = data[0].list.map((ele) => ele.favoriteProperty);
        return result;
    }
    async getFavoriteRepairProperties(memberId, input) {
        const { page, limit } = input;
        const match = {
            likeGroup: like_enum_1.LikeGroup.REPAIR_PROPERTY,
            memberId: memberId,
        };
        const data = await this.likeModel
            .aggregate([
            { $match: match },
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: 'repair_requests',
                    localField: 'likeRefId',
                    foreignField: '_id',
                    as: 'favoriteRepairProperty',
                },
            },
            { $unwind: '$favoriteRepairProperty' },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupRepairFavorite,
                        { $unwind: '$favoriteRepairProperty.memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        const result = { list: [], metaCounter: data[0].metaCounter };
        result.list = data[0].list.map((ele) => ele.favoriteRepairProperty);
        return result;
    }
};
exports.LikeService = LikeService;
exports.LikeService = LikeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Like')),
    __param(2, (0, mongoose_1.InjectModel)('Property')),
    __param(3, (0, mongoose_1.InjectModel)('BoardArticle')),
    __param(4, (0, mongoose_1.InjectModel)('Member')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _d : Object, typeof (_e = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _e : Object])
], LikeService);


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const notification_enum_1 = __webpack_require__(30);
const socket_gateway_1 = __webpack_require__(31);
let NotificationService = class NotificationService {
    notificationModel;
    socketGateway;
    constructor(notificationModel, socketGateway) {
        this.notificationModel = notificationModel;
        this.socketGateway = socketGateway;
    }
    async createNotification(input) {
        const notification = await this.notificationModel.create({
            ...input,
            notificationStatus: notification_enum_1.NotificationStatus.WAIT,
        });
        this.socketGateway.sendNotification(notification.receiverId.toString(), {
            id: notification._id.toString(),
            title: notification.notificationTitle,
            desc: notification.notificationDesc,
            type: notification.notificationType,
            status: notification.notificationStatus,
            createdAt: notification.createdAt,
        });
        return notification;
    }
    async getUnreadNotifications(userId) {
        return this.notificationModel
            .find({
            receiverId: userId,
            notificationStatus: notification_enum_1.NotificationStatus.WAIT,
        })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getNotificationsByIds(notificationIds, userId) {
        return this.notificationModel
            .find({
            _id: { $in: notificationIds },
            receiverId: userId,
            notificationStatus: notification_enum_1.NotificationStatus.WAIT,
        })
            .exec();
    }
    async markAsRead(notificationId, userId) {
        try {
            const notification = await this.notificationModel.findOneAndUpdate({
                _id: notificationId,
                receiverId: userId,
                notificationStatus: notification_enum_1.NotificationStatus.WAIT,
            }, {
                notificationStatus: notification_enum_1.NotificationStatus.READ,
            }, { new: true });
            if (notification) {
                this.socketGateway.sendNotification(userId, {
                    id: notification._id.toString(),
                    title: notification.notificationTitle,
                    desc: notification.notificationDesc,
                    type: notification.notificationType,
                    status: notification_enum_1.NotificationStatus.READ,
                    createdAt: notification.createdAt,
                });
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async markMultipleAsRead(userId, notifications) {
        try {
            const notificationIds = notifications.map((n) => n._id);
            await this.notificationModel.updateMany({
                _id: { $in: notificationIds },
                receiverId: userId,
                notificationStatus: notification_enum_1.NotificationStatus.WAIT,
            }, {
                notificationStatus: notification_enum_1.NotificationStatus.READ,
            });
            for (const notification of notifications) {
                this.socketGateway.sendNotification(userId, {
                    id: notification._id.toString(),
                    title: notification.notificationTitle,
                    desc: notification.notificationDesc,
                    type: notification.notificationType,
                    status: notification_enum_1.NotificationStatus.READ,
                    createdAt: notification.createdAt,
                });
            }
        }
        catch (error) {
            throw error;
        }
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notification')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => socket_gateway_1.SocketGateway))),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof socket_gateway_1.SocketGateway !== "undefined" && socket_gateway_1.SocketGateway) === "function" ? _b : Object])
], NotificationService);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationGroup = exports.NotificationStatus = exports.NotificationType = void 0;
const graphql_1 = __webpack_require__(7);
var NotificationType;
(function (NotificationType) {
    NotificationType["LIKE"] = "LIKE";
    NotificationType["COMMENT"] = "COMMENT";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
(0, graphql_1.registerEnumType)(NotificationType, {
    name: 'NotificationType',
});
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["WAIT"] = "WAIT";
    NotificationStatus["READ"] = "READ";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
(0, graphql_1.registerEnumType)(NotificationStatus, {
    name: 'NotificationStatus',
});
var NotificationGroup;
(function (NotificationGroup) {
    NotificationGroup["MEMBER"] = "MEMBER";
    NotificationGroup["ARTICLE"] = "ARTICLE";
    NotificationGroup["PROPERTY"] = "PROPERTY";
    NotificationGroup["REPAIR_PROPERTY"] = "REPAIR_PROPERTY";
})(NotificationGroup || (exports.NotificationGroup = NotificationGroup = {}));
(0, graphql_1.registerEnumType)(NotificationGroup, {
    name: 'NotificationGroup',
});


/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketGateway = void 0;
const common_1 = __webpack_require__(3);
const websockets_1 = __webpack_require__(32);
const ws_1 = __webpack_require__(33);
const WebSocket = __webpack_require__(33);
const auth_service_1 = __webpack_require__(18);
const url = __webpack_require__(34);
const notification_service_1 = __webpack_require__(29);
let SocketGateway = class SocketGateway {
    authService;
    notificationService;
    logger = new common_1.Logger('SocketEventsGateway');
    summaryClient = 0;
    clientsAuthMap = new Map();
    messagesList = [];
    constructor(authService, notificationService) {
        this.authService = authService;
        this.notificationService = notificationService;
    }
    server;
    afterInit(server) {
        this.logger.verbose(`WebSocket Server Initialized total: [${this.summaryClient}]`);
    }
    async retrieveAuth(req) {
        try {
            const parseUrl = url.parse(req.url, true);
            const { token } = parseUrl.query;
            return await this.authService.verifyToken(token);
        }
        catch (err) {
            return null;
        }
    }
    async handleConnection(client, req) {
        const authMember = await this.retrieveAuth(req);
        if (!authMember) {
            client.close();
            return;
        }
        this.summaryClient++;
        this.clientsAuthMap.set(client, authMember);
        const clientNick = authMember.memberNick;
        this.logger.verbose(`Connection [${clientNick}] & total: [${this.summaryClient}]`);
        const infoMsg = {
            event: 'info',
            totalClients: this.summaryClient,
            memberData: authMember,
            action: 'joined',
        };
        this.emitMessage(infoMsg);
        client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
        await this.handleGetNotifications(client);
    }
    async handleGetNotifications(client) {
        try {
            const authMember = this.clientsAuthMap.get(client);
            if (!authMember)
                return;
            const unreadNotifications = await this.notificationService.getUnreadNotifications(authMember._id.toString());
            if (unreadNotifications.length > 0) {
                client.send(JSON.stringify({
                    event: 'notifications_list',
                    data: unreadNotifications.map((notification) => ({
                        id: notification._id.toString(),
                        title: notification.notificationTitle,
                        desc: notification.notificationDesc,
                        type: notification.notificationType,
                        status: notification.notificationStatus,
                        createdAt: notification.createdAt,
                    })),
                }));
            }
        }
        catch (error) {
            this.logger.error('Error in handleGetNotifications:', error);
        }
    }
    async handleGetNotificationsEvent(client) {
        await this.handleGetNotifications(client);
    }
    async handleMarkNotificationsAsRead(client, data) {
        try {
            const authMember = this.clientsAuthMap.get(client);
            if (!authMember)
                return;
            const notificationIds = Array.isArray(data) ? data : [data];
            if (!notificationIds.length)
                return;
            const notifications = await this.notificationService.getNotificationsByIds(notificationIds, authMember._id.toString());
            if (notifications.length > 0) {
                await this.notificationService.markMultipleAsRead(authMember._id.toString(), notifications);
                notifications.forEach((notification) => {
                    client.send(JSON.stringify({
                        event: 'notificationStatus',
                        payload: {
                            id: notification._id.toString(),
                            status: 'READ',
                        },
                    }));
                });
            }
        }
        catch (error) {
            this.logger.error('Error in handleMarkNotificationsAsRead:', error);
        }
    }
    handleDisconnect(client) {
        const authMember = this.clientsAuthMap.get(client);
        this.summaryClient--;
        this.clientsAuthMap.delete(client);
        const clientNick = authMember?.memberNick ?? 'Guest';
        this.logger.verbose(`Disconnected [${clientNick}] & total  [${this.summaryClient}]`);
        const infoMsg = {
            event: 'info',
            totalClients: this.summaryClient,
            memberData: authMember ?? null,
            action: 'left',
        };
        this.broadcastMessage(client, infoMsg);
    }
    async handleMessage(client, payload) {
        const authMember = this.clientsAuthMap.get(client);
        const newMessage = { event: 'message', text: payload, memberData: authMember ?? null };
        const clientNick = authMember?.memberNick ?? 'Guest';
        this.logger.verbose(`NEW MESSAGE [${clientNick}] : ${payload}`);
        this.messagesList.push(newMessage);
        if (this.messagesList.length >= 5)
            this.messagesList.splice(0, this.messagesList.length - 5);
        this.emitMessage(newMessage);
    }
    broadcastMessage(sender, message) {
        this.server.clients.forEach((client) => {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    emitMessage(message) {
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    }
    sendNotification(userId, notification) {
        let notificationsSent = 0;
        this.server.clients.forEach((client) => {
            const authMember = this.clientsAuthMap.get(client);
            if (client.readyState === WebSocket.OPEN) {
                if (authMember && authMember._id.toString() === userId) {
                    client.send(JSON.stringify({
                        event: 'notification',
                        payload: notification,
                    }));
                    notificationsSent++;
                }
            }
        });
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _c : Object)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('get_notifications'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof WebSocket !== "undefined" && WebSocket) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], SocketGateway.prototype, "handleGetNotificationsEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('markNotificationsAsRead'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof WebSocket !== "undefined" && WebSocket) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], SocketGateway.prototype, "handleMarkNotificationsAsRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof WebSocket !== "undefined" && WebSocket) === "function" ? _h : Object, String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], SocketGateway.prototype, "handleMessage", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ transport: ['websocket'], secure: false }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], SocketGateway);


/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 33 */
/***/ ((module) => {

module.exports = require("ws");

/***/ }),
/* 34 */
/***/ ((module) => {

module.exports = require("url");

/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MembersInquiry = exports.TechnicianInquiry = exports.AgentsInquiry = exports.LoginInput = exports.MemberInput = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const member_enum_1 = __webpack_require__(16);
const config_1 = __webpack_require__(21);
const common_enum_1 = __webpack_require__(17);
let MemberInput = class MemberInput {
    memberNick;
    memberPassword;
    memberPhone;
    memberType;
    memberAuthType;
    memberEmail;
};
exports.MemberInput = MemberInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 12),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MemberInput.prototype, "memberNick", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 12),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MemberInput.prototype, "memberPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], MemberInput.prototype, "memberPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => member_enum_1.MemberType, { nullable: true }),
    __metadata("design:type", typeof (_a = typeof member_enum_1.MemberType !== "undefined" && member_enum_1.MemberType) === "function" ? _a : Object)
], MemberInput.prototype, "memberType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => member_enum_1.MemberAuthType, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof member_enum_1.MemberAuthType !== "undefined" && member_enum_1.MemberAuthType) === "function" ? _b : Object)
], MemberInput.prototype, "memberAuthType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberInput.prototype, "memberEmail", void 0);
exports.MemberInput = MemberInput = __decorate([
    (0, graphql_1.InputType)()
], MemberInput);
let LoginInput = class LoginInput {
    memberNick;
    memberEmail;
    memberPassword;
};
exports.LoginInput = LoginInput;
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.memberEmail),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 12),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginInput.prototype, "memberNick", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => !o.memberNick),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Length)(5, 30),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], LoginInput.prototype, "memberEmail", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 12),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], LoginInput.prototype, "memberPassword", void 0);
exports.LoginInput = LoginInput = __decorate([
    (0, graphql_1.InputType)()
], LoginInput);
let AISearch = class AISearch {
    text;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AISearch.prototype, "text", void 0);
AISearch = __decorate([
    (0, graphql_1.InputType)()
], AISearch);
let AgentsInquiry = class AgentsInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.AgentsInquiry = AgentsInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AgentsInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AgentsInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableAgentSorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AgentsInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _c : Object)
], AgentsInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => AISearch),
    __metadata("design:type", AISearch)
], AgentsInquiry.prototype, "search", void 0);
exports.AgentsInquiry = AgentsInquiry = __decorate([
    (0, graphql_1.InputType)()
], AgentsInquiry);
let TechnicianInquiry = class TechnicianInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.TechnicianInquiry = TechnicianInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TechnicianInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TechnicianInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableTechnician),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], TechnicianInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _d : Object)
], TechnicianInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => AISearch),
    __metadata("design:type", AISearch)
], TechnicianInquiry.prototype, "search", void 0);
exports.TechnicianInquiry = TechnicianInquiry = __decorate([
    (0, graphql_1.InputType)()
], TechnicianInquiry);
let MISearch = class MISearch {
    memberStatus;
    memberType;
    text;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => member_enum_1.MemberStatus, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof member_enum_1.MemberStatus !== "undefined" && member_enum_1.MemberStatus) === "function" ? _e : Object)
], MISearch.prototype, "memberStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => member_enum_1.MemberType, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof member_enum_1.MemberType !== "undefined" && member_enum_1.MemberType) === "function" ? _f : Object)
], MISearch.prototype, "memberType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MISearch.prototype, "text", void 0);
MISearch = __decorate([
    (0, graphql_1.InputType)()
], MISearch);
let MembersInquiry = class MembersInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.MembersInquiry = MembersInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MembersInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MembersInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableMemberSorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MembersInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _g : Object)
], MembersInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => MISearch),
    __metadata("design:type", MISearch)
], MembersInquiry.prototype, "search", void 0);
exports.MembersInquiry = MembersInquiry = __decorate([
    (0, graphql_1.InputType)()
], MembersInquiry);


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Members = exports.TotalCounter = exports.Member = void 0;
const graphql_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(15);
const member_enum_1 = __webpack_require__(16);
const like_1 = __webpack_require__(38);
const follow_1 = __webpack_require__(39);
let Member = class Member {
    _id;
    memberType;
    memberStatus;
    memberAuthType;
    memberPhone;
    memberNick;
    memberPassword;
    memberFullName;
    memberImage;
    memberAddress;
    memberDesc;
    memberProperties;
    memberArticles;
    memberFollowers;
    memberEmail;
    memberFollowings;
    memberPoints;
    memberLikes;
    memberViews;
    memberComments;
    memberRank;
    memberWarnings;
    memberBlocks;
    deletedAt;
    createdAt;
    updatedAt;
    accessToken;
    meLiked;
    meFollowed;
};
exports.Member = Member;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Member.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_enum_1.MemberType),
    __metadata("design:type", typeof (_b = typeof member_enum_1.MemberType !== "undefined" && member_enum_1.MemberType) === "function" ? _b : Object)
], Member.prototype, "memberType", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_enum_1.MemberStatus),
    __metadata("design:type", typeof (_c = typeof member_enum_1.MemberStatus !== "undefined" && member_enum_1.MemberStatus) === "function" ? _c : Object)
], Member.prototype, "memberStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_enum_1.MemberAuthType),
    __metadata("design:type", typeof (_d = typeof member_enum_1.MemberAuthType !== "undefined" && member_enum_1.MemberAuthType) === "function" ? _d : Object)
], Member.prototype, "memberAuthType", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Member.prototype, "memberPhone", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Member.prototype, "memberNick", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberFullName", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberImage", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberAddress", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberDesc", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberProperties", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberArticles", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberFollowers", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberEmail", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberFollowings", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberPoints", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberLikes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberViews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberComments", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberRank", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberWarnings", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Member.prototype, "memberBlocks", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Member.prototype, "deletedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Member.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Member.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "accessToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => [like_1.MeLiked], { nullable: true }),
    __metadata("design:type", Array)
], Member.prototype, "meLiked", void 0);
__decorate([
    (0, graphql_1.Field)(() => [follow_1.MeFollowed], { nullable: true }),
    __metadata("design:type", Array)
], Member.prototype, "meFollowed", void 0);
exports.Member = Member = __decorate([
    (0, graphql_1.ObjectType)()
], Member);
let TotalCounter = class TotalCounter {
    total;
};
exports.TotalCounter = TotalCounter;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], TotalCounter.prototype, "total", void 0);
exports.TotalCounter = TotalCounter = __decorate([
    (0, graphql_1.ObjectType)()
], TotalCounter);
let Members = class Members {
    list;
    metaCounter;
};
exports.Members = Members;
__decorate([
    (0, graphql_1.Field)(() => [Member]),
    __metadata("design:type", Array)
], Members.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Members.prototype, "metaCounter", void 0);
exports.Members = Members = __decorate([
    (0, graphql_1.ObjectType)()
], Members);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Like = exports.MeLiked = void 0;
const graphql_1 = __webpack_require__(7);
const like_enum_1 = __webpack_require__(27);
const mongoose_1 = __webpack_require__(15);
let MeLiked = class MeLiked {
    memberId;
    likeRefId;
    myFavorite;
};
exports.MeLiked = MeLiked;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], MeLiked.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], MeLiked.prototype, "likeRefId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], MeLiked.prototype, "myFavorite", void 0);
exports.MeLiked = MeLiked = __decorate([
    (0, graphql_1.ObjectType)()
], MeLiked);
let Like = class Like {
    _id;
    likeGroup;
    likeRefId;
    memberId;
    createdAt;
    updatedAt;
};
exports.Like = Like;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], Like.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => like_enum_1.LikeGroup),
    __metadata("design:type", typeof (_d = typeof like_enum_1.LikeGroup !== "undefined" && like_enum_1.LikeGroup) === "function" ? _d : Object)
], Like.prototype, "likeGroup", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_e = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _e : Object)
], Like.prototype, "likeRefId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_f = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _f : Object)
], Like.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Like.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], Like.prototype, "updatedAt", void 0);
exports.Like = Like = __decorate([
    (0, graphql_1.ObjectType)()
], Like);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Followers = exports.Followings = exports.Following = exports.Follower = exports.MeFollowed = void 0;
const graphql_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(15);
const member_1 = __webpack_require__(37);
const like_1 = __webpack_require__(38);
let MeFollowed = class MeFollowed {
    followingId;
    followerId;
    myFollowing;
};
exports.MeFollowed = MeFollowed;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], MeFollowed.prototype, "followingId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], MeFollowed.prototype, "followerId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], MeFollowed.prototype, "myFollowing", void 0);
exports.MeFollowed = MeFollowed = __decorate([
    (0, graphql_1.ObjectType)()
], MeFollowed);
let Follower = class Follower {
    _id;
    followingId;
    followerId;
    createdAt;
    updatedAt;
    meLiked;
    meFollowed;
    followerData;
};
exports.Follower = Follower;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], Follower.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], Follower.prototype, "followingId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_e = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _e : Object)
], Follower.prototype, "followerId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Follower.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Follower.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [like_1.MeLiked], { nullable: true }),
    __metadata("design:type", Array)
], Follower.prototype, "meLiked", void 0);
__decorate([
    (0, graphql_1.Field)(() => [MeFollowed], { nullable: true }),
    __metadata("design:type", Array)
], Follower.prototype, "meFollowed", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _h : Object)
], Follower.prototype, "followerData", void 0);
exports.Follower = Follower = __decorate([
    (0, graphql_1.ObjectType)()
], Follower);
let Following = class Following {
    _id;
    followingId;
    followerId;
    createdAt;
    updatedAt;
    meLiked;
    meFollowed;
    followingData;
};
exports.Following = Following;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object)
], Following.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_k = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _k : Object)
], Following.prototype, "followingId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_l = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _l : Object)
], Following.prototype, "followerId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_m = typeof Date !== "undefined" && Date) === "function" ? _m : Object)
], Following.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_o = typeof Date !== "undefined" && Date) === "function" ? _o : Object)
], Following.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [like_1.MeLiked], { nullable: true }),
    __metadata("design:type", Array)
], Following.prototype, "meLiked", void 0);
__decorate([
    (0, graphql_1.Field)(() => [MeFollowed], { nullable: true }),
    __metadata("design:type", Array)
], Following.prototype, "meFollowed", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_p = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _p : Object)
], Following.prototype, "followingData", void 0);
exports.Following = Following = __decorate([
    (0, graphql_1.ObjectType)()
], Following);
let Followings = class Followings {
    list;
    metaCounter;
};
exports.Followings = Followings;
__decorate([
    (0, graphql_1.Field)(() => [Following]),
    __metadata("design:type", Array)
], Followings.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Followings.prototype, "metaCounter", void 0);
exports.Followings = Followings = __decorate([
    (0, graphql_1.ObjectType)()
], Followings);
let Followers = class Followers {
    list;
    metaCounter;
};
exports.Followers = Followers;
__decorate([
    (0, graphql_1.Field)(() => [Follower]),
    __metadata("design:type", Array)
], Followers.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Followers.prototype, "metaCounter", void 0);
exports.Followers = Followers = __decorate([
    (0, graphql_1.ObjectType)()
], Followers);


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthGuard = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(18);
const common_enum_1 = __webpack_require__(17);
let AuthGuard = class AuthGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        console.info('--- @guard() Authentication [AuthGuard] ---');
        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const bearerToken = request.headers.authorization;
            if (!bearerToken)
                throw new common_1.BadRequestException(common_enum_1.Message.TOKEN_NOT_EXIST);
            const token = bearerToken.split(' ')[1], authMember = await this.authService.verifyToken(token);
            if (!authMember)
                throw new common_1.UnauthorizedException(common_enum_1.Message.NOT_AUTHENTICATED);
            console.log('memberNick[auth] =>', authMember.memberNick);
            request.body.authMember = authMember;
            return true;
        }
        return false;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthGuard);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthMember = void 0;
const common_1 = __webpack_require__(3);
exports.AuthMember = (0, common_1.createParamDecorator)((data, context) => {
    let request;
    if (context.contextType === 'graphql') {
        request = context.getArgByIndex(2).req;
        if (request.body.authMember) {
            request.body.authMember.authorization = request.headers?.authorization;
        }
    }
    else
        request = context.switchToHttp().getRequest();
    const member = request.body.authMember;
    if (member)
        return data ? member?.[data] : member;
    else
        return null;
});


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(3);
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(3);
const core_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(18);
const common_enum_1 = __webpack_require__(17);
let RolesGuard = class RolesGuard {
    reflector;
    authService;
    constructor(reflector, authService) {
        this.reflector = reflector;
        this.authService = authService;
    }
    async canActivate(context) {
        const roles = this.reflector.get('roles', context.getHandler());
        if (!roles)
            return true;
        console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);
        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const bearerToken = request.headers.authorization;
            if (!bearerToken)
                throw new common_1.BadRequestException(common_enum_1.Message.TOKEN_NOT_EXIST);
            const token = bearerToken.split(' ')[1], authMember = await this.authService.verifyToken(token), hasRole = () => roles.indexOf(authMember.memberType) > -1, hasPermission = hasRole();
            if (!authMember || !hasPermission)
                throw new common_1.ForbiddenException(common_enum_1.Message.ONLY_SPECIFIC_ROLES_ALLOWED);
            console.log('memberNick[roles] =>', authMember.memberNick);
            request.body.authMember = authMember;
            return true;
        }
        return false;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object, typeof (_b = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _b : Object])
], RolesGuard);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberUpdate = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const member_enum_1 = __webpack_require__(16);
const mongoose_1 = __webpack_require__(15);
let MemberUpdate = class MemberUpdate {
    _id;
    memberType;
    memberStatus;
    memberPhone;
    memberNick;
    memberEmail;
    memberPassword;
    memberFullName;
    memberImage;
    memberAddress;
    memberDesc;
    deletedAt;
};
exports.MemberUpdate = MemberUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], MemberUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => member_enum_1.MemberType, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof member_enum_1.MemberType !== "undefined" && member_enum_1.MemberType) === "function" ? _b : Object)
], MemberUpdate.prototype, "memberType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => member_enum_1.MemberStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof member_enum_1.MemberStatus !== "undefined" && member_enum_1.MemberStatus) === "function" ? _c : Object)
], MemberUpdate.prototype, "memberStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 12),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberNick", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 12),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 100),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberFullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberImage", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], MemberUpdate.prototype, "memberDesc", void 0);
exports.MemberUpdate = MemberUpdate = __decorate([
    (0, graphql_1.InputType)()
], MemberUpdate);


/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WithoutGuard = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(18);
let WithoutGuard = class WithoutGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        console.info('--- @guard() Authentication [WithoutGuard] ---');
        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req, bearerToken = request.headers.authorization;
            if (bearerToken) {
                try {
                    const token = bearerToken.split(' ')[1], authMember = await this.authService.verifyToken(token);
                    request.body.authMember = authMember;
                }
                catch (err) {
                    request.body.authMember = null;
                }
            }
            else
                request.body.authMember = null;
            console.log('memberNick[without] =>', request.body.authMember?.memberNick ?? 'none');
            return true;
        }
        return false;
    }
};
exports.WithoutGuard = WithoutGuard;
exports.WithoutGuard = WithoutGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], WithoutGuard);


/***/ }),
/* 46 */
/***/ ((module) => {

module.exports = require("graphql-upload");

/***/ }),
/* 47 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const member_enum_1 = __webpack_require__(16);
const MemberSchema = new mongoose_1.Schema({
    memberType: {
        type: String,
        enum: Object.values(member_enum_1.MemberType),
        default: member_enum_1.MemberType.USER,
    },
    memberStatus: {
        type: String,
        enum: Object.values(member_enum_1.MemberStatus),
        default: member_enum_1.MemberStatus.ACTIVE,
    },
    memberAuthType: {
        type: String,
        enum: Object.values(member_enum_1.MemberAuthType),
        default: member_enum_1.MemberAuthType.PHONE,
    },
    memberPhone: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
    },
    memberNick: {
        type: String,
        index: { unique: true, sparse: true },
        required: true,
    },
    memberEmail: {
        type: String,
        index: { unique: true, sparse: true },
    },
    memberPassword: {
        type: String,
        select: false,
        required: true,
    },
    memberFullName: {
        type: String,
    },
    memberImage: {
        type: String,
        default: '',
    },
    memberAddress: {
        type: String,
    },
    memberDesc: {
        type: String,
    },
    memberProperties: {
        type: Number,
        default: 0,
    },
    memberArticles: {
        type: Number,
        default: 0,
    },
    memberFollowers: {
        type: Number,
        default: 0,
    },
    memberFollowings: {
        type: Number,
        default: 0,
    },
    memberPoints: {
        type: Number,
        default: 0,
    },
    memberLikes: {
        type: Number,
        default: 0,
    },
    memberViews: {
        type: Number,
        default: 0,
    },
    memberComments: {
        type: Number,
        default: 0,
    },
    memberRank: {
        type: Number,
        default: 0,
    },
    memberWarnings: {
        type: Number,
        default: 0,
    },
    memberBlocks: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date
    },
}, { timestamps: true, collection: 'members' });
exports["default"] = MemberSchema;


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const auth_service_1 = __webpack_require__(18);
const axios_1 = __webpack_require__(50);
const jwt_1 = __webpack_require__(19);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            jwt_1.JwtModule.register({
                secret: `${process.env.SECRET_TOKEN}`,
                signOptions: { expiresIn: '30d' }
            }),
        ],
        providers: [auth_service_1.AuthService],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewModule = void 0;
const common_1 = __webpack_require__(3);
const view_service_1 = __webpack_require__(25);
const mongoose_1 = __webpack_require__(14);
const View_model_1 = __webpack_require__(52);
let ViewModule = class ViewModule {
};
exports.ViewModule = ViewModule;
exports.ViewModule = ViewModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'View', schema: View_model_1.default }])],
        providers: [view_service_1.ViewService],
        exports: [view_service_1.ViewService],
    })
], ViewModule);


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const view_enum_1 = __webpack_require__(26);
const ViewSchema = new mongoose_1.Schema({
    viewGroup: {
        type: String,
        enum: view_enum_1.ViewGroup,
        required: true,
    },
    viewRefId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
}, { timestamps: true, collection: 'views' });
ViewSchema.index({ memberId: 1, viewRefId: 1 }, { unique: true });
exports["default"] = ViewSchema;


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikeModule = void 0;
const common_1 = __webpack_require__(3);
const like_service_1 = __webpack_require__(28);
const mongoose_1 = __webpack_require__(14);
const Like_model_1 = __webpack_require__(54);
const notification_module_1 = __webpack_require__(55);
const BoardArticle_model_1 = __webpack_require__(58);
const Member_model_1 = __webpack_require__(48);
const Property_model_1 = __webpack_require__(60);
let LikeModule = class LikeModule {
};
exports.LikeModule = LikeModule;
exports.LikeModule = LikeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Like', schema: Like_model_1.default },
                { name: 'Property', schema: Property_model_1.default },
                { name: 'BoardArticle', schema: BoardArticle_model_1.default },
                { name: 'Member', schema: Member_model_1.default },
            ]),
            notification_module_1.NotificationModule,
        ],
        providers: [like_service_1.LikeService],
        exports: [like_service_1.LikeService],
    })
], LikeModule);


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const view_enum_1 = __webpack_require__(26);
const LikeSchema = new mongoose_1.Schema({
    likeGroup: {
        type: String,
        enum: view_enum_1.ViewGroup,
        required: true,
    },
    likeRefId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
}, { timestamps: true, collection: 'likes' });
LikeSchema.index({ memberId: 1, likeRefId: 1 }, { unique: true });
exports["default"] = LikeSchema;


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const Notification_model_1 = __webpack_require__(56);
const notification_service_1 = __webpack_require__(29);
const socket_module_1 = __webpack_require__(57);
let NotificationModule = class NotificationModule {
};
exports.NotificationModule = NotificationModule;
exports.NotificationModule = NotificationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Notification', schema: Notification_model_1.default }]),
            (0, common_1.forwardRef)(() => socket_module_1.SocketModule),
        ],
        providers: [notification_service_1.NotificationService],
        exports: [notification_service_1.NotificationService],
    })
], NotificationModule);


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const notification_enum_1 = __webpack_require__(30);
const NotificationSchema = new mongoose_1.Schema({
    notificationType: {
        type: String,
        enum: notification_enum_1.NotificationType,
        required: true,
    },
    notificationStatus: {
        type: String,
        enum: notification_enum_1.NotificationStatus,
        default: notification_enum_1.NotificationStatus.WAIT,
    },
    notificationGroup: {
        type: String,
        enum: notification_enum_1.NotificationGroup,
        required: true,
    },
    notificationTitle: {
        type: String,
        required: true,
    },
    notificationDesc: {
        type: String,
    },
    authorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
    propertyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Property',
    },
    articleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'BoardArticle',
    },
}, { timestamps: true, collection: 'notifications' });
exports["default"] = NotificationSchema;


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketModule = void 0;
const common_1 = __webpack_require__(3);
const socket_gateway_1 = __webpack_require__(31);
const auth_module_1 = __webpack_require__(49);
const notification_module_1 = __webpack_require__(55);
let SocketModule = class SocketModule {
};
exports.SocketModule = SocketModule;
exports.SocketModule = SocketModule = __decorate([
    (0, common_1.Module)({
        providers: [socket_gateway_1.SocketGateway],
        imports: [auth_module_1.AuthModule, (0, common_1.forwardRef)(() => notification_module_1.NotificationModule)],
        exports: [socket_gateway_1.SocketGateway],
    })
], SocketModule);


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const board_article_enum_1 = __webpack_require__(59);
const BoardArticleSchema = new mongoose_1.Schema({
    articleCategory: {
        type: String,
        enum: board_article_enum_1.BoardArticleCategory,
        required: true,
    },
    articleStatus: {
        type: String,
        enum: board_article_enum_1.BoardArticleStatus,
        default: board_article_enum_1.BoardArticleStatus.ACTIVE,
    },
    articleTitle: {
        type: String,
        required: true,
    },
    articleContent: {
        type: String,
        required: true,
    },
    articleImage: {
        type: String,
    },
    articleLikes: {
        type: Number,
        default: 0,
    },
    articleViews: {
        type: Number,
        default: 0,
    },
    articleComments: {
        type: Number,
        default: 0,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
}, { timestamps: true, collection: 'boardArticles' });
exports["default"] = BoardArticleSchema;


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleStatus = exports.BoardArticleCategory = void 0;
const graphql_1 = __webpack_require__(7);
var BoardArticleCategory;
(function (BoardArticleCategory) {
    BoardArticleCategory["FREE"] = "FREE";
    BoardArticleCategory["RECOMMEND"] = "RECOMMEND";
    BoardArticleCategory["NEWS"] = "NEWS";
    BoardArticleCategory["HUMOR"] = "HUMOR";
})(BoardArticleCategory || (exports.BoardArticleCategory = BoardArticleCategory = {}));
(0, graphql_1.registerEnumType)(BoardArticleCategory, {
    name: 'BoardArticleCategory',
});
var BoardArticleStatus;
(function (BoardArticleStatus) {
    BoardArticleStatus["ACTIVE"] = "ACTIVE";
    BoardArticleStatus["DELETE"] = "DELETE";
})(BoardArticleStatus || (exports.BoardArticleStatus = BoardArticleStatus = {}));
(0, graphql_1.registerEnumType)(BoardArticleStatus, {
    name: 'BoardArticleStatus',
});


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const property_enum_1 = __webpack_require__(61);
const PropertySchema = new mongoose_1.Schema({
    propertyType: {
        type: String,
        enum: property_enum_1.PropertyType,
        required: true,
    },
    propertyStatus: {
        type: String,
        enum: property_enum_1.PropertyStatus,
        default: property_enum_1.PropertyStatus.ACTIVE,
    },
    propertyCategory: {
        type: String,
        enum: property_enum_1.PropertyCategory,
        required: true,
    },
    propertyMaterial: {
        type: String,
        enum: property_enum_1.PropertyMaterial,
        required: true,
    },
    propertyColor: {
        type: String,
        enum: property_enum_1.PropertyColor,
        required: true,
    },
    propertySize: {
        type: String,
    },
    propertyTitle: {
        type: String,
        required: true,
    },
    propertyPrice: {
        type: Number,
        required: true,
    },
    propertySalePrice: {
        type: Number,
    },
    propertyIsOnSale: {
        type: Boolean,
        default: false,
    },
    propertySaleExpiresAt: {
        type: Date,
    },
    propertyViews: {
        type: Number,
        default: 0,
    },
    propertyLikes: {
        type: Number,
        default: 0,
    },
    propertyComments: {
        type: Number,
        default: 0,
    },
    propertyRank: {
        type: Number,
        default: 0,
    },
    propertyImages: {
        type: [String],
        required: true,
    },
    propertyDesc: {
        type: String,
    },
    propertyBarter: {
        type: Boolean,
        default: false,
    },
    propertyRent: {
        type: Boolean,
        default: false,
    },
    propertyInStock: {
        type: Boolean,
        default: true,
    },
    propertyCondition: {
        type: String,
        enum: property_enum_1.PropertyCondition,
        required: true,
    },
    propertyBrand: {
        type: String,
    },
    propertyOriginCountry: {
        type: String,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
    soldAt: {
        type: Date,
    },
    deletedAt: {
        type: Date,
    },
}, { timestamps: true, collection: 'properties' });
PropertySchema.index({
    propertyType: 1,
    propertyCategory: 1,
    propertyTitle: 1,
    propertyPrice: 1,
}, { unique: true });
exports["default"] = PropertySchema;


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyCondition = exports.PropertyColor = exports.PropertyMaterial = exports.PropertyCategory = exports.PropertyStatus = exports.PropertyType = void 0;
const graphql_1 = __webpack_require__(7);
var PropertyType;
(function (PropertyType) {
    PropertyType["STOOL"] = "STOOL";
    PropertyType["TABLE"] = "TABLE";
    PropertyType["BED"] = "BED";
    PropertyType["SOFA"] = "SOFA";
    PropertyType["CABINET"] = "CABINET";
    PropertyType["CHAIR"] = "CHAIR";
    PropertyType["SHELF"] = "SHELF";
    PropertyType["OTHER"] = "OTHER";
})(PropertyType || (exports.PropertyType = PropertyType = {}));
(0, graphql_1.registerEnumType)(PropertyType, {
    name: 'PropertyType',
});
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["HOLD"] = "HOLD";
    PropertyStatus["ACTIVE"] = "ACTIVE";
    PropertyStatus["SOLD"] = "SOLD";
    PropertyStatus["DELETE"] = "DELETE";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
(0, graphql_1.registerEnumType)(PropertyStatus, {
    name: 'PropertyStatus',
});
var PropertyCategory;
(function (PropertyCategory) {
    PropertyCategory["HOME"] = "HOME";
    PropertyCategory["OFFICE"] = "OFFICE";
    PropertyCategory["OUTDOOR"] = "OUTDOOR";
    PropertyCategory["KITCHEN"] = "KITCHEN";
    PropertyCategory["BATHROOM"] = "BATHROOM";
})(PropertyCategory || (exports.PropertyCategory = PropertyCategory = {}));
(0, graphql_1.registerEnumType)(PropertyCategory, {
    name: 'PropertyCategory',
});
var PropertyMaterial;
(function (PropertyMaterial) {
    PropertyMaterial["WOOD"] = "WOOD";
    PropertyMaterial["METAL"] = "METAL";
    PropertyMaterial["PLASTIC"] = "PLASTIC";
    PropertyMaterial["GLASS"] = "GLASS";
})(PropertyMaterial || (exports.PropertyMaterial = PropertyMaterial = {}));
(0, graphql_1.registerEnumType)(PropertyMaterial, {
    name: 'PropertyMaterial',
});
var PropertyColor;
(function (PropertyColor) {
    PropertyColor["WHITE"] = "WHITE";
    PropertyColor["BLACK"] = "BLACK";
    PropertyColor["BROWN"] = "BROWN";
    PropertyColor["GRAY"] = "GRAY";
    PropertyColor["BEIGE"] = "BEIGE";
    PropertyColor["BLUE"] = "BLUE";
    PropertyColor["GREEN"] = "GREEN";
})(PropertyColor || (exports.PropertyColor = PropertyColor = {}));
(0, graphql_1.registerEnumType)(PropertyColor, {
    name: 'PropertyColor',
});
var PropertyCondition;
(function (PropertyCondition) {
    PropertyCondition["NEW"] = "NEW";
    PropertyCondition["USED"] = "USED";
})(PropertyCondition || (exports.PropertyCondition = PropertyCondition = {}));
(0, graphql_1.registerEnumType)(PropertyCondition, {
    name: 'PropertyCondition',
});


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const FollowSchema = new mongoose_1.Schema({
    followingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    followerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true, collection: "follows" });
FollowSchema.index({ followingId: 1, followerId: 1 }, { unique: true });
exports["default"] = FollowSchema;


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyModule = void 0;
const common_1 = __webpack_require__(3);
const property_resolver_1 = __webpack_require__(64);
const property_service_1 = __webpack_require__(65);
const mongoose_1 = __webpack_require__(14);
const Property_model_1 = __webpack_require__(60);
const auth_module_1 = __webpack_require__(49);
const view_module_1 = __webpack_require__(51);
const member_module_1 = __webpack_require__(11);
const like_module_1 = __webpack_require__(53);
let PropertyModule = class PropertyModule {
};
exports.PropertyModule = PropertyModule;
exports.PropertyModule = PropertyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Property',
                    schema: Property_model_1.default,
                },
            ]),
            auth_module_1.AuthModule,
            view_module_1.ViewModule,
            member_module_1.MemberModule,
            like_module_1.LikeModule,
        ],
        providers: [property_resolver_1.PropertyResolver, property_service_1.PropertyService],
        exports: [property_service_1.PropertyService],
    })
], PropertyModule);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyResolver = void 0;
const graphql_1 = __webpack_require__(7);
const property_service_1 = __webpack_require__(65);
const roles_decorator_1 = __webpack_require__(42);
const member_enum_1 = __webpack_require__(16);
const common_1 = __webpack_require__(3);
const roles_guard_1 = __webpack_require__(43);
const property_1 = __webpack_require__(67);
const property_input_1 = __webpack_require__(68);
const authMember_decorator_1 = __webpack_require__(41);
const mongoose_1 = __webpack_require__(15);
const without_guard_1 = __webpack_require__(45);
const config_1 = __webpack_require__(21);
const property_update_1 = __webpack_require__(69);
const auth_guard_1 = __webpack_require__(40);
let PropertyResolver = class PropertyResolver {
    propertyService;
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async createProperty(input, memberId) {
        console.log('Mutation: createProperty');
        input.memberId = memberId;
        return await this.propertyService.createProperty(input);
    }
    async getProperty(input, memberId) {
        console.log('Query: getProperty');
        const propertyId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.propertyService.getProperty(memberId, propertyId);
    }
    async updateProperty(input, memberId) {
        console.log('Mutation: updateProperty');
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.propertyService.updateProperty(memberId, input);
    }
    async getProperties(input, memberId) {
        console.log('Mutation: getProperties');
        return await this.propertyService.getProperties(memberId, input);
    }
    async getFavorites(input, memberId) {
        console.log('Query: getFavorites');
        return await this.propertyService.getFavorites(memberId, input);
    }
    async getVisited(input, memberId) {
        console.log('Query: getVisited');
        return await this.propertyService.getVisited(memberId, input);
    }
    async getAgentProperties(input, memberId) {
        console.log('Mutation: getAgentProperties');
        return await this.propertyService.getAgentProperties(memberId, input);
    }
    async likeTargetProperty(input, memberId) {
        console.log('Mutation: likeTargetProperty');
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.propertyService.likeTargetProperty(memberId, likeRefId);
    }
    async getAllPropertiesByAdmin(input, memberId) {
        console.log('Query: getAllPropertiesByAdmin');
        return await this.propertyService.getAllPropertiesByAdmin(input);
    }
    async updatePropertyByAdmin(input) {
        console.log('Mutation: updatePropertyByAdmin');
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.propertyService.updatePropertyByAdmin(input);
    }
    async removePropertyByAdmin(input) {
        console.log('Mutation: removePropertyByAdmin');
        const propertyId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.propertyService.removePropertyByAdmin(propertyId);
    }
};
exports.PropertyResolver = PropertyResolver;
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.AGENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => property_1.Property),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof property_input_1.PropertyInput !== "undefined" && property_input_1.PropertyInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], PropertyResolver.prototype, "createProperty", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => property_1.Property),
    __param(0, (0, graphql_1.Args)('propertyId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], PropertyResolver.prototype, "getProperty", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.AGENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => property_1.Property),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof property_update_1.PropertyUpdate !== "undefined" && property_update_1.PropertyUpdate) === "function" ? _g : Object, typeof (_h = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], PropertyResolver.prototype, "updateProperty", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => property_1.Properties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof property_input_1.PropertiesInquiry !== "undefined" && property_input_1.PropertiesInquiry) === "function" ? _k : Object, typeof (_l = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], PropertyResolver.prototype, "getProperties", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)((returns) => property_1.Properties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof property_input_1.OrdinaryInquiry !== "undefined" && property_input_1.OrdinaryInquiry) === "function" ? _o : Object, typeof (_p = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _p : Object]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], PropertyResolver.prototype, "getFavorites", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)((returns) => property_1.Properties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof property_input_1.OrdinaryInquiry !== "undefined" && property_input_1.OrdinaryInquiry) === "function" ? _r : Object, typeof (_s = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _s : Object]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], PropertyResolver.prototype, "getVisited", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.AGENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)((returns) => property_1.Properties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof property_input_1.AgentPropertiesInquiry !== "undefined" && property_input_1.AgentPropertiesInquiry) === "function" ? _u : Object, typeof (_v = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _v : Object]),
    __metadata("design:returntype", typeof (_w = typeof Promise !== "undefined" && Promise) === "function" ? _w : Object)
], PropertyResolver.prototype, "getAgentProperties", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => property_1.Property),
    __param(0, (0, graphql_1.Args)('propertyId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_x = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _x : Object]),
    __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
], PropertyResolver.prototype, "likeTargetProperty", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)((returns) => property_1.Properties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_z = typeof property_input_1.AllPropertiesInquiry !== "undefined" && property_input_1.AllPropertiesInquiry) === "function" ? _z : Object, typeof (_0 = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _0 : Object]),
    __metadata("design:returntype", typeof (_1 = typeof Promise !== "undefined" && Promise) === "function" ? _1 : Object)
], PropertyResolver.prototype, "getAllPropertiesByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => property_1.Property),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_2 = typeof property_update_1.PropertyUpdate !== "undefined" && property_update_1.PropertyUpdate) === "function" ? _2 : Object]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], PropertyResolver.prototype, "updatePropertyByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => property_1.Property),
    __param(0, (0, graphql_1.Args)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_4 = typeof Promise !== "undefined" && Promise) === "function" ? _4 : Object)
], PropertyResolver.prototype, "removePropertyByAdmin", null);
exports.PropertyResolver = PropertyResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof property_service_1.PropertyService !== "undefined" && property_service_1.PropertyService) === "function" ? _a : Object])
], PropertyResolver);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const common_enum_1 = __webpack_require__(17);
const member_service_1 = __webpack_require__(13);
const view_service_1 = __webpack_require__(25);
const property_enum_1 = __webpack_require__(61);
const view_enum_1 = __webpack_require__(26);
const moment = __webpack_require__(66);
const config_1 = __webpack_require__(21);
const like_enum_1 = __webpack_require__(27);
const like_service_1 = __webpack_require__(28);
let PropertyService = class PropertyService {
    propertyModel;
    memberService;
    viewService;
    likeService;
    constructor(propertyModel, memberService, viewService, likeService) {
        this.propertyModel = propertyModel;
        this.memberService = memberService;
        this.viewService = viewService;
        this.likeService = likeService;
    }
    async createProperty(input) {
        try {
            console.log('executed');
            const propertyData = {
                ...input,
                propertyInStock: true,
            };
            const result = await this.propertyModel.create(propertyData);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: 1,
            });
            return result;
        }
        catch (err) {
            console.log("Error, Service.model:", err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async getProperty(memberId, propertyId) {
        const search = {
            _id: propertyId,
            propertyStatus: property_enum_1.PropertyStatus.ACTIVE,
        };
        const targetProperty = await this.propertyModel.findOne(search).lean().exec();
        if (!targetProperty)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: propertyId, viewGroup: view_enum_1.ViewGroup.PROPERTY };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.propertyStatsEditor({ _id: propertyId, targetKey: 'propertyViews', modifier: 1 });
                targetProperty.propertyViews++;
            }
            const LikeInput = { memberId: memberId, likeRefId: propertyId, likeGroup: like_enum_1.LikeGroup.PROPERTY };
            targetProperty.meLiked = await this.likeService.checkLikeExistence(LikeInput);
        }
        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        return targetProperty;
    }
    async updateProperty(memberId, input) {
        let { propertyStatus, soldAt, deletedAt } = input;
        const search = {
            _id: input._id,
            memberId: memberId,
            propertyStatus: property_enum_1.PropertyStatus.ACTIVE,
        };
        if (propertyStatus === property_enum_1.PropertyStatus.SOLD)
            soldAt = moment().toDate();
        else if (propertyStatus === property_enum_1.PropertyStatus.DELETE)
            deletedAt = moment().toDate();
        const result = await this.propertyModel
            .findOneAndUpdate(search, input, {
            new: true,
        })
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }
        return result;
    }
    async getProperties(memberId, input) {
        const match = { propertyStatus: property_enum_1.PropertyStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        this.shapeMatchQuery(match, input);
        console.log('match:', match);
        const result = await this.propertyModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId),
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    shapeMatchQuery(match, input) {
        const { memberId, categoryList, typeList, conditionList, materialList, colorList, pricesRange, options, text, } = input.search;
        if (memberId)
            match.memberId = (0, config_1.ShapeIntoMongoObjectId)(memberId);
        if (categoryList && categoryList.length)
            match.propertyCategory = { $in: categoryList };
        if (typeList && typeList.length)
            match.propertyType = { $in: typeList };
        if (conditionList && conditionList.length)
            match.propertyCondition = { $in: conditionList };
        if (materialList && materialList.length)
            match.propertyMaterial = { $in: materialList };
        if (colorList && colorList.length)
            match.propertyColor = { $in: colorList };
        if (pricesRange) {
            match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
        }
        if (text) {
            match.propertyTitle = { $regex: new RegExp(text, 'i') };
        }
        if (options && options.length) {
            match['$or'] = options.map((ele) => ({ [ele]: true }));
        }
    }
    async getFavorites(memberId, input) {
        return await this.likeService.getFavoriteProperties(memberId, input);
    }
    async getVisited(memberId, input) {
        return await this.viewService.getVisitedProperties(memberId, input);
    }
    async getAgentProperties(memberId, input) {
        const { propertyStatus } = input.search;
        if (propertyStatus === property_enum_1.PropertyStatus.DELETE)
            throw new common_1.BadRequestException(common_enum_1.Message.NOT_ALLOWED_REQUEST);
        const match = {
            memberId: memberId,
            propertyStatus: propertyStatus ?? { $ne: property_enum_1.PropertyStatus.DELETE },
        };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        const result = await this.propertyModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async likeTargetProperty(memberId, likeRefId) {
        const target = await this.propertyModel
            .findOne({ _id: likeRefId, propertyStatus: property_enum_1.PropertyStatus.ACTIVE })
            .exec();
        if (!target)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        const input = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: like_enum_1.LikeGroup.PROPERTY
        };
        const modifier = await this.likeService.toggleLike(input);
        const result = await this.propertyStatsEditor({ _id: likeRefId, targetKey: 'propertyLikes', modifier: modifier });
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.SOMETHING_WENT_WRONG);
        return result;
    }
    async getAllPropertiesByAdmin(input) {
        const { propertyStatus, propertyCategory } = input.search;
        const match = {};
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        if (propertyStatus)
            match.propertyStatus = propertyStatus;
        if (propertyCategory)
            match.propertyLocation = { $in: propertyCategory };
        const result = await this.propertyModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async updatePropertyByAdmin(input) {
        let { propertyStatus, soldAt, deletedAt } = input;
        const search = {
            _id: input._id,
            propertyStatus: property_enum_1.PropertyStatus.ACTIVE,
        };
        if (propertyStatus === property_enum_1.PropertyStatus.SOLD)
            soldAt = moment().toDate();
        else if (propertyStatus === property_enum_1.PropertyStatus.DELETE)
            deletedAt = moment().toDate();
        const result = await this.propertyModel
            .findOneAndUpdate(search, input, {
            new: true,
        })
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        if (soldAt || deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }
        return result;
    }
    async removePropertyByAdmin(propertyId) {
        const search = { _id: propertyId, propertyStatus: property_enum_1.PropertyStatus.DELETE };
        const result = await this.propertyModel.findOneAndDelete(search).exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.REMOVE_FAILED);
        return result;
    }
    async propertyStatsEditor(input) {
        const { _id, targetKey, modifier } = input;
        return await this.propertyModel
            .findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, {
            new: true,
        })
            .exec();
    }
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Property')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _c : Object, typeof (_d = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _d : Object])
], PropertyService);


/***/ }),
/* 66 */
/***/ ((module) => {

module.exports = require("moment");

/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Properties = exports.Property = void 0;
const graphql_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(15);
const property_enum_1 = __webpack_require__(61);
const member_1 = __webpack_require__(37);
const like_1 = __webpack_require__(38);
let Property = class Property {
    _id;
    propertyType;
    propertyStatus;
    propertyCategory;
    propertyMaterial;
    propertyColor;
    propertySize;
    propertyTitle;
    propertyPrice;
    propertySalePrice;
    propertyIsOnSale;
    propertySaleExpiresAt;
    propertyImages;
    propertyDesc;
    propertyBarter;
    propertyRent;
    propertyInStock;
    propertyCondition;
    propertyBrand;
    propertyOriginCountry;
    propertyAddress;
    propertyViews;
    propertyLikes;
    propertyComments;
    propertyRank;
    memberId;
    soldAt;
    deletedAt;
    constructedAt;
    createdAt;
    updatedAt;
    meLiked;
    memberData;
};
exports.Property = Property;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Property.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => property_enum_1.PropertyType),
    __metadata("design:type", typeof (_b = typeof property_enum_1.PropertyType !== "undefined" && property_enum_1.PropertyType) === "function" ? _b : Object)
], Property.prototype, "propertyType", void 0);
__decorate([
    (0, graphql_1.Field)(() => property_enum_1.PropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof property_enum_1.PropertyStatus !== "undefined" && property_enum_1.PropertyStatus) === "function" ? _c : Object)
], Property.prototype, "propertyStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => property_enum_1.PropertyCategory),
    __metadata("design:type", typeof (_d = typeof property_enum_1.PropertyCategory !== "undefined" && property_enum_1.PropertyCategory) === "function" ? _d : Object)
], Property.prototype, "propertyCategory", void 0);
__decorate([
    (0, graphql_1.Field)(() => property_enum_1.PropertyMaterial),
    __metadata("design:type", typeof (_e = typeof property_enum_1.PropertyMaterial !== "undefined" && property_enum_1.PropertyMaterial) === "function" ? _e : Object)
], Property.prototype, "propertyMaterial", void 0);
__decorate([
    (0, graphql_1.Field)(() => property_enum_1.PropertyColor),
    __metadata("design:type", typeof (_f = typeof property_enum_1.PropertyColor !== "undefined" && property_enum_1.PropertyColor) === "function" ? _f : Object)
], Property.prototype, "propertyColor", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Property.prototype, "propertySize", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Property.prototype, "propertyTitle", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], Property.prototype, "propertyPrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "propertySalePrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], Property.prototype, "propertyIsOnSale", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Property.prototype, "propertySaleExpiresAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Property.prototype, "propertyImages", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyDesc", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], Property.prototype, "propertyBarter", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], Property.prototype, "propertyRent", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], Property.prototype, "propertyInStock", void 0);
__decorate([
    (0, graphql_1.Field)(() => property_enum_1.PropertyCondition),
    __metadata("design:type", typeof (_h = typeof property_enum_1.PropertyCondition !== "undefined" && property_enum_1.PropertyCondition) === "function" ? _h : Object)
], Property.prototype, "propertyCondition", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyBrand", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyOriginCountry", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "propertyAddress", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Property.prototype, "propertyViews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "propertyLikes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "propertyComments", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "propertyRank", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object)
], Property.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], Property.prototype, "soldAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_l = typeof Date !== "undefined" && Date) === "function" ? _l : Object)
], Property.prototype, "deletedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_m = typeof Date !== "undefined" && Date) === "function" ? _m : Object)
], Property.prototype, "constructedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_o = typeof Date !== "undefined" && Date) === "function" ? _o : Object)
], Property.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_p = typeof Date !== "undefined" && Date) === "function" ? _p : Object)
], Property.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [like_1.MeLiked], { nullable: true }),
    __metadata("design:type", Array)
], Property.prototype, "meLiked", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_q = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _q : Object)
], Property.prototype, "memberData", void 0);
exports.Property = Property = __decorate([
    (0, graphql_1.ObjectType)()
], Property);
let Properties = class Properties {
    list;
    metaCounter;
};
exports.Properties = Properties;
__decorate([
    (0, graphql_1.Field)(() => [Property]),
    __metadata("design:type", Array)
], Properties.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Properties.prototype, "metaCounter", void 0);
exports.Properties = Properties = __decorate([
    (0, graphql_1.ObjectType)()
], Properties);


/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrdinaryInquiry = exports.AllPropertiesInquiry = exports.AgentPropertiesInquiry = exports.PropertiesInquiry = exports.PISearch = exports.PeriodsRange = exports.SquaresRange = exports.PricesRange = exports.PropertyInput = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const property_enum_1 = __webpack_require__(61);
const mongoose_1 = __webpack_require__(15);
const config_1 = __webpack_require__(21);
const common_enum_1 = __webpack_require__(17);
let PropertyInput = class PropertyInput {
    propertyType;
    propertyStatus;
    propertyCategory;
    propertyMaterial;
    propertyColor;
    propertySize;
    propertyTitle;
    propertyPrice;
    propertySalePrice;
    propertyIsOnSale;
    propertySaleExpiresAt;
    propertyImages;
    propertyDesc;
    propertyBarter;
    propertyRent;
    propertyInStock;
    propertyCondition;
    propertyBrand;
    propertyOriginCountry;
    soldAt;
    memberId;
    constructedAt;
};
exports.PropertyInput = PropertyInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyType),
    __metadata("design:type", typeof (_a = typeof property_enum_1.PropertyType !== "undefined" && property_enum_1.PropertyType) === "function" ? _a : Object)
], PropertyInput.prototype, "propertyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof property_enum_1.PropertyStatus !== "undefined" && property_enum_1.PropertyStatus) === "function" ? _b : Object)
], PropertyInput.prototype, "propertyStatus", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyCategory),
    __metadata("design:type", typeof (_c = typeof property_enum_1.PropertyCategory !== "undefined" && property_enum_1.PropertyCategory) === "function" ? _c : Object)
], PropertyInput.prototype, "propertyCategory", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyMaterial),
    __metadata("design:type", typeof (_d = typeof property_enum_1.PropertyMaterial !== "undefined" && property_enum_1.PropertyMaterial) === "function" ? _d : Object)
], PropertyInput.prototype, "propertyMaterial", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyColor),
    __metadata("design:type", typeof (_e = typeof property_enum_1.PropertyColor !== "undefined" && property_enum_1.PropertyColor) === "function" ? _e : Object)
], PropertyInput.prototype, "propertyColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PropertyInput.prototype, "propertySize", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 100),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PropertyInput.prototype, "propertyTitle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], PropertyInput.prototype, "propertyPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], PropertyInput.prototype, "propertySalePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyInput.prototype, "propertyIsOnSale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], PropertyInput.prototype, "propertySaleExpiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PropertyInput.prototype, "propertyImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 500),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyInput.prototype, "propertyDesc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyInput.prototype, "propertyBarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyInput.prototype, "propertyRent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyInput.prototype, "propertyInStock", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyCondition),
    __metadata("design:type", typeof (_g = typeof property_enum_1.PropertyCondition !== "undefined" && property_enum_1.PropertyCondition) === "function" ? _g : Object)
], PropertyInput.prototype, "propertyCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyInput.prototype, "propertyBrand", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyInput.prototype, "propertyOriginCountry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], PropertyInput.prototype, "soldAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_j = typeof Date !== "undefined" && Date) === "function" ? _j : Object)
], PropertyInput.prototype, "constructedAt", void 0);
exports.PropertyInput = PropertyInput = __decorate([
    (0, graphql_1.InputType)()
], PropertyInput);
let PricesRange = class PricesRange {
    start;
    end;
};
exports.PricesRange = PricesRange;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PricesRange.prototype, "start", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PricesRange.prototype, "end", void 0);
exports.PricesRange = PricesRange = __decorate([
    (0, graphql_1.InputType)()
], PricesRange);
let SquaresRange = class SquaresRange {
    start;
    end;
};
exports.SquaresRange = SquaresRange;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SquaresRange.prototype, "start", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SquaresRange.prototype, "end", void 0);
exports.SquaresRange = SquaresRange = __decorate([
    (0, graphql_1.InputType)()
], SquaresRange);
let PeriodsRange = class PeriodsRange {
    start;
    end;
};
exports.PeriodsRange = PeriodsRange;
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], PeriodsRange.prototype, "start", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_l = typeof Date !== "undefined" && Date) === "function" ? _l : Object)
], PeriodsRange.prototype, "end", void 0);
exports.PeriodsRange = PeriodsRange = __decorate([
    (0, graphql_1.InputType)()
], PeriodsRange);
let PISearch = class PISearch {
    memberId;
    categoryList;
    typeList;
    conditionList;
    materialList;
    colorList;
    pricesRange;
    options;
    text;
};
exports.PISearch = PISearch;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_m = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _m : Object)
], PISearch.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [property_enum_1.PropertyCategory], { nullable: true }),
    __metadata("design:type", Array)
], PISearch.prototype, "categoryList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [property_enum_1.PropertyType], { nullable: true }),
    __metadata("design:type", Array)
], PISearch.prototype, "typeList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [property_enum_1.PropertyCondition], { nullable: true }),
    __metadata("design:type", Array)
], PISearch.prototype, "conditionList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PISearch.prototype, "materialList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PISearch.prototype, "colorList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => PricesRange, { nullable: true }),
    __metadata("design:type", PricesRange)
], PISearch.prototype, "pricesRange", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableOptions, { each: true }),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PISearch.prototype, "options", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PISearch.prototype, "text", void 0);
exports.PISearch = PISearch = __decorate([
    (0, graphql_1.InputType)()
], PISearch);
let PropertiesInquiry = class PropertiesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.PropertiesInquiry = PropertiesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PropertiesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], PropertiesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availablePropertySorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertiesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_o = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _o : Object)
], PropertiesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => PISearch),
    __metadata("design:type", PISearch)
], PropertiesInquiry.prototype, "search", void 0);
exports.PropertiesInquiry = PropertiesInquiry = __decorate([
    (0, graphql_1.InputType)()
], PropertiesInquiry);
let APISearch = class APISearch {
    propertyStatus;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_p = typeof property_enum_1.PropertyStatus !== "undefined" && property_enum_1.PropertyStatus) === "function" ? _p : Object)
], APISearch.prototype, "propertyStatus", void 0);
APISearch = __decorate([
    (0, graphql_1.InputType)()
], APISearch);
let AgentPropertiesInquiry = class AgentPropertiesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.AgentPropertiesInquiry = AgentPropertiesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AgentPropertiesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AgentPropertiesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availablePropertySorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AgentPropertiesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_q = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _q : Object)
], AgentPropertiesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => APISearch),
    __metadata("design:type", APISearch)
], AgentPropertiesInquiry.prototype, "search", void 0);
exports.AgentPropertiesInquiry = AgentPropertiesInquiry = __decorate([
    (0, graphql_1.InputType)()
], AgentPropertiesInquiry);
let ALPISearch = class ALPISearch {
    propertyStatus;
    propertyCategory;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_r = typeof property_enum_1.PropertyStatus !== "undefined" && property_enum_1.PropertyStatus) === "function" ? _r : Object)
], ALPISearch.prototype, "propertyStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [property_enum_1.PropertyCategory], { nullable: true }),
    __metadata("design:type", Array)
], ALPISearch.prototype, "propertyCategory", void 0);
ALPISearch = __decorate([
    (0, graphql_1.InputType)()
], ALPISearch);
let AllPropertiesInquiry = class AllPropertiesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.AllPropertiesInquiry = AllPropertiesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AllPropertiesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AllPropertiesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availablePropertySorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AllPropertiesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_s = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _s : Object)
], AllPropertiesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => ALPISearch),
    __metadata("design:type", ALPISearch)
], AllPropertiesInquiry.prototype, "search", void 0);
exports.AllPropertiesInquiry = AllPropertiesInquiry = __decorate([
    (0, graphql_1.InputType)()
], AllPropertiesInquiry);
let OrdinaryInquiry = class OrdinaryInquiry {
    page;
    limit;
};
exports.OrdinaryInquiry = OrdinaryInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrdinaryInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrdinaryInquiry.prototype, "limit", void 0);
exports.OrdinaryInquiry = OrdinaryInquiry = __decorate([
    (0, graphql_1.InputType)()
], OrdinaryInquiry);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyUpdate = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const mongoose_1 = __webpack_require__(15);
const property_enum_1 = __webpack_require__(61);
let PropertyUpdate = class PropertyUpdate {
    _id;
    propertyType;
    propertyStatus;
    propertyCategory;
    propertyMaterial;
    propertyColor;
    propertySize;
    propertyTitle;
    propertyPrice;
    propertySalePrice;
    propertyIsOnSale;
    propertySaleExpiresAt;
    propertyImages;
    propertyDesc;
    propertyBarter;
    propertyRent;
    propertyInStock;
    propertyCondition;
    propertyBrand;
    propertyOriginCountry;
    soldAt;
    deletedAt;
    constructedAt;
};
exports.PropertyUpdate = PropertyUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], PropertyUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyType, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof property_enum_1.PropertyType !== "undefined" && property_enum_1.PropertyType) === "function" ? _b : Object)
], PropertyUpdate.prototype, "propertyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof property_enum_1.PropertyStatus !== "undefined" && property_enum_1.PropertyStatus) === "function" ? _c : Object)
], PropertyUpdate.prototype, "propertyStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyCategory, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof property_enum_1.PropertyCategory !== "undefined" && property_enum_1.PropertyCategory) === "function" ? _d : Object)
], PropertyUpdate.prototype, "propertyCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyMaterial, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof property_enum_1.PropertyMaterial !== "undefined" && property_enum_1.PropertyMaterial) === "function" ? _e : Object)
], PropertyUpdate.prototype, "propertyMaterial", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyColor, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof property_enum_1.PropertyColor !== "undefined" && property_enum_1.PropertyColor) === "function" ? _f : Object)
], PropertyUpdate.prototype, "propertyColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyUpdate.prototype, "propertySize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 100),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyUpdate.prototype, "propertyTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], PropertyUpdate.prototype, "propertyPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], PropertyUpdate.prototype, "propertySalePrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyUpdate.prototype, "propertyIsOnSale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], PropertyUpdate.prototype, "propertySaleExpiresAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], PropertyUpdate.prototype, "propertyImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(5, 500),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyUpdate.prototype, "propertyDesc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyUpdate.prototype, "propertyBarter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyUpdate.prototype, "propertyRent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PropertyUpdate.prototype, "propertyInStock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => property_enum_1.PropertyCondition, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof property_enum_1.PropertyCondition !== "undefined" && property_enum_1.PropertyCondition) === "function" ? _h : Object)
], PropertyUpdate.prototype, "propertyCondition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyUpdate.prototype, "propertyBrand", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyUpdate.prototype, "propertyOriginCountry", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_j = typeof Date !== "undefined" && Date) === "function" ? _j : Object)
], PropertyUpdate.prototype, "constructedAt", void 0);
exports.PropertyUpdate = PropertyUpdate = __decorate([
    (0, graphql_1.InputType)()
], PropertyUpdate);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleModule = void 0;
const common_1 = __webpack_require__(3);
const board_article_resolver_1 = __webpack_require__(71);
const board_article_service_1 = __webpack_require__(74);
const mongoose_1 = __webpack_require__(14);
const BoardArticle_model_1 = __webpack_require__(58);
const auth_module_1 = __webpack_require__(49);
const member_module_1 = __webpack_require__(11);
const view_module_1 = __webpack_require__(51);
const like_module_1 = __webpack_require__(53);
let BoardArticleModule = class BoardArticleModule {
};
exports.BoardArticleModule = BoardArticleModule;
exports.BoardArticleModule = BoardArticleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'BoardArticle',
                    schema: BoardArticle_model_1.default,
                },
            ]),
            auth_module_1.AuthModule,
            member_module_1.MemberModule,
            view_module_1.ViewModule,
            like_module_1.LikeModule,
        ],
        providers: [board_article_resolver_1.BoardArticleResolver, board_article_service_1.BoardArticleService],
        exports: [board_article_service_1.BoardArticleService]
    })
], BoardArticleModule);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleResolver = void 0;
const common_1 = __webpack_require__(3);
const graphql_1 = __webpack_require__(7);
const auth_guard_1 = __webpack_require__(40);
const board_article_1 = __webpack_require__(72);
const board_article_input_1 = __webpack_require__(73);
const authMember_decorator_1 = __webpack_require__(41);
const mongoose_1 = __webpack_require__(15);
const board_article_service_1 = __webpack_require__(74);
const without_guard_1 = __webpack_require__(45);
const config_1 = __webpack_require__(21);
const board_article_update_1 = __webpack_require__(75);
const roles_decorator_1 = __webpack_require__(42);
const member_enum_1 = __webpack_require__(16);
const roles_guard_1 = __webpack_require__(43);
let BoardArticleResolver = class BoardArticleResolver {
    boardArticleService;
    constructor(boardArticleService) {
        this.boardArticleService = boardArticleService;
    }
    async createBoardArticle(input, memberId) {
        console.log('Mutation: createBoardArticle');
        return await this.boardArticleService.createBoardArticle(memberId, input);
    }
    async getBoardArticle(input, memberId) {
        console.log('Query: getProperty');
        const articleId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.boardArticleService.getBoardArticle(memberId, articleId);
    }
    async updateBoardArticle(input, memberId) {
        console.log('Mutation: updateBoardArticle');
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.boardArticleService.updateBoardArticle(memberId, input);
    }
    async getBoardArticles(input, memberId) {
        console.log('Query: getBoardArticles');
        return await this.boardArticleService.getBoardArticles(memberId, input);
    }
    async likeTargetBoardArticle(input, memberId) {
        console.log('Mutation: likeTargetBoardArticle');
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.boardArticleService.likeTargetBoardArticle(memberId, likeRefId);
    }
    async getAllBoardArticlesByAdmin(input, memberId) {
        console.log('Query: getAllBoardArticlesByAdmin');
        return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
    }
    async updateBoardArticleByAdmin(input, memberId) {
        console.log('Mutation: updateBoardArticleByAdmin');
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.boardArticleService.updateBoardArticleByAdmin(input);
    }
    async removeBoardArticleByAdmin(input, memberId) {
        console.log('Mutation: removeBoardArticleByAdmin');
        const articleId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.boardArticleService.removeBoardArticleByAdmin(articleId);
    }
};
exports.BoardArticleResolver = BoardArticleResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => board_article_1.BoardArticle),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof board_article_input_1.BoardArticleInput !== "undefined" && board_article_input_1.BoardArticleInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], BoardArticleResolver.prototype, "createBoardArticle", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => board_article_1.BoardArticle),
    __param(0, (0, graphql_1.Args)('articleId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], BoardArticleResolver.prototype, "getBoardArticle", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => board_article_1.BoardArticle),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof board_article_update_1.BoardArticleUpdate !== "undefined" && board_article_update_1.BoardArticleUpdate) === "function" ? _g : Object, typeof (_h = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], BoardArticleResolver.prototype, "updateBoardArticle", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => board_article_1.BoardArticles),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof board_article_input_1.BoardArticlesInquiry !== "undefined" && board_article_input_1.BoardArticlesInquiry) === "function" ? _k : Object, typeof (_l = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], BoardArticleResolver.prototype, "getBoardArticles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => board_article_1.BoardArticle),
    __param(0, (0, graphql_1.Args)('articleId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_o = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], BoardArticleResolver.prototype, "likeTargetBoardArticle", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)((returns) => board_article_1.BoardArticles),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_q = typeof board_article_input_1.AllBoardArticlesInquiry !== "undefined" && board_article_input_1.AllBoardArticlesInquiry) === "function" ? _q : Object, typeof (_r = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _r : Object]),
    __metadata("design:returntype", typeof (_s = typeof Promise !== "undefined" && Promise) === "function" ? _s : Object)
], BoardArticleResolver.prototype, "getAllBoardArticlesByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => board_article_1.BoardArticle),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_t = typeof board_article_update_1.BoardArticleUpdate !== "undefined" && board_article_update_1.BoardArticleUpdate) === "function" ? _t : Object, typeof (_u = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], BoardArticleResolver.prototype, "updateBoardArticleByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => board_article_1.BoardArticle),
    __param(0, (0, graphql_1.Args)('articleId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_w = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], BoardArticleResolver.prototype, "removeBoardArticleByAdmin", null);
exports.BoardArticleResolver = BoardArticleResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof board_article_service_1.BoardArticleService !== "undefined" && board_article_service_1.BoardArticleService) === "function" ? _a : Object])
], BoardArticleResolver);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticles = exports.BoardArticle = void 0;
const graphql_1 = __webpack_require__(7);
const board_article_enum_1 = __webpack_require__(59);
const mongoose_1 = __webpack_require__(15);
const member_1 = __webpack_require__(37);
const like_1 = __webpack_require__(38);
let BoardArticle = class BoardArticle {
    _id;
    articleCategory;
    articleStatus;
    articleTitle;
    articleContent;
    articleImage;
    articleViews;
    articleLikes;
    articleComments;
    memberId;
    createdAt;
    updatedAt;
    meLiked;
    memberData;
};
exports.BoardArticle = BoardArticle;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], BoardArticle.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleCategory),
    __metadata("design:type", typeof (_b = typeof board_article_enum_1.BoardArticleCategory !== "undefined" && board_article_enum_1.BoardArticleCategory) === "function" ? _b : Object)
], BoardArticle.prototype, "articleCategory", void 0);
__decorate([
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleStatus),
    __metadata("design:type", typeof (_c = typeof board_article_enum_1.BoardArticleStatus !== "undefined" && board_article_enum_1.BoardArticleStatus) === "function" ? _c : Object)
], BoardArticle.prototype, "articleStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], BoardArticle.prototype, "articleTitle", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], BoardArticle.prototype, "articleContent", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BoardArticle.prototype, "articleImage", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BoardArticle.prototype, "articleViews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BoardArticle.prototype, "articleLikes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BoardArticle.prototype, "articleComments", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], BoardArticle.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], BoardArticle.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], BoardArticle.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [like_1.MeLiked], { nullable: true }),
    __metadata("design:type", Array)
], BoardArticle.prototype, "meLiked", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _g : Object)
], BoardArticle.prototype, "memberData", void 0);
exports.BoardArticle = BoardArticle = __decorate([
    (0, graphql_1.ObjectType)()
], BoardArticle);
let BoardArticles = class BoardArticles {
    list;
    metaCounter;
};
exports.BoardArticles = BoardArticles;
__decorate([
    (0, graphql_1.Field)(() => [BoardArticle]),
    __metadata("design:type", Array)
], BoardArticles.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], BoardArticles.prototype, "metaCounter", void 0);
exports.BoardArticles = BoardArticles = __decorate([
    (0, graphql_1.ObjectType)()
], BoardArticles);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllBoardArticlesInquiry = exports.BoardArticlesInquiry = exports.BoardArticleInput = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const mongoose_1 = __webpack_require__(15);
const board_article_enum_1 = __webpack_require__(59);
const common_enum_1 = __webpack_require__(17);
const config_1 = __webpack_require__(21);
let BoardArticleInput = class BoardArticleInput {
    articleCategory;
    articleTitle;
    articleContent;
    articleImage;
    memberId;
};
exports.BoardArticleInput = BoardArticleInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleCategory),
    __metadata("design:type", typeof (_a = typeof board_article_enum_1.BoardArticleCategory !== "undefined" && board_article_enum_1.BoardArticleCategory) === "function" ? _a : Object)
], BoardArticleInput.prototype, "articleCategory", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 50),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], BoardArticleInput.prototype, "articleTitle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 250),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], BoardArticleInput.prototype, "articleContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BoardArticleInput.prototype, "articleImage", void 0);
exports.BoardArticleInput = BoardArticleInput = __decorate([
    (0, graphql_1.InputType)()
], BoardArticleInput);
let BAISearch = class BAISearch {
    articleCategory;
    text;
    memberId;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleCategory, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof board_article_enum_1.BoardArticleCategory !== "undefined" && board_article_enum_1.BoardArticleCategory) === "function" ? _b : Object)
], BAISearch.prototype, "articleCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BAISearch.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], BAISearch.prototype, "memberId", void 0);
BAISearch = __decorate([
    (0, graphql_1.InputType)()
], BAISearch);
let BoardArticlesInquiry = class BoardArticlesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.BoardArticlesInquiry = BoardArticlesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BoardArticlesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], BoardArticlesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableBoardArticleSorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BoardArticlesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _d : Object)
], BoardArticlesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => BAISearch),
    __metadata("design:type", BAISearch)
], BoardArticlesInquiry.prototype, "search", void 0);
exports.BoardArticlesInquiry = BoardArticlesInquiry = __decorate([
    (0, graphql_1.InputType)()
], BoardArticlesInquiry);
let ABAISearch = class ABAISearch {
    articleStatus;
    articleCategory;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleStatus, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof board_article_enum_1.BoardArticleStatus !== "undefined" && board_article_enum_1.BoardArticleStatus) === "function" ? _e : Object)
], ABAISearch.prototype, "articleStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleCategory, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof board_article_enum_1.BoardArticleCategory !== "undefined" && board_article_enum_1.BoardArticleCategory) === "function" ? _f : Object)
], ABAISearch.prototype, "articleCategory", void 0);
ABAISearch = __decorate([
    (0, graphql_1.InputType)()
], ABAISearch);
let AllBoardArticlesInquiry = class AllBoardArticlesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.AllBoardArticlesInquiry = AllBoardArticlesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AllBoardArticlesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AllBoardArticlesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableBoardArticleSorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AllBoardArticlesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _g : Object)
], AllBoardArticlesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => ABAISearch),
    __metadata("design:type", ABAISearch)
], AllBoardArticlesInquiry.prototype, "search", void 0);
exports.AllBoardArticlesInquiry = AllBoardArticlesInquiry = __decorate([
    (0, graphql_1.InputType)()
], AllBoardArticlesInquiry);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const member_service_1 = __webpack_require__(13);
const view_service_1 = __webpack_require__(25);
const common_enum_1 = __webpack_require__(17);
const board_article_enum_1 = __webpack_require__(59);
const view_enum_1 = __webpack_require__(26);
const config_1 = __webpack_require__(21);
const like_service_1 = __webpack_require__(28);
const like_enum_1 = __webpack_require__(27);
let BoardArticleService = class BoardArticleService {
    boardArticleModel;
    memberService;
    viewService;
    likeService;
    constructor(boardArticleModel, memberService, viewService, likeService) {
        this.boardArticleModel = boardArticleModel;
        this.memberService = memberService;
        this.viewService = viewService;
        this.likeService = likeService;
    }
    async createBoardArticle(memberId, input) {
        input.memberId = memberId;
        try {
            const result = await this.boardArticleModel.create(input);
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberArticles',
                modifier: 1,
            });
            return result;
        }
        catch (err) {
            console.log("Error, Service.model:", err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async getBoardArticle(memberId, articleId) {
        const search = {
            _id: articleId,
            articleStatus: board_article_enum_1.BoardArticleStatus.ACTIVE,
        };
        const targetBoardArticle = await this.boardArticleModel.findOne(search).lean().exec();
        if (!targetBoardArticle)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: articleId, viewGroup: view_enum_1.ViewGroup.ARTICLE };
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.boardArticleStatsEditor({ _id: articleId, targetKey: 'articleViews', modifier: 1 });
                targetBoardArticle.articleViews++;
            }
            const LikeInput = { memberId: memberId, likeRefId: articleId, likeGroup: like_enum_1.LikeGroup.ARTICLE };
            targetBoardArticle.meLiked = await this.likeService.checkLikeExistence(LikeInput);
        }
        targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId);
        return targetBoardArticle;
    }
    async updateBoardArticle(memberId, input) {
        const { _id, articleStatus } = input;
        const result = await this.boardArticleModel
            .findOneAndUpdate({ _id: _id, memberId: memberId, articleStatus: board_article_enum_1.BoardArticleStatus.ACTIVE }, input, {
            new: true,
        })
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        if (articleStatus === board_article_enum_1.BoardArticleStatus.DELETE) {
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberArticles',
                modifier: -1,
            });
        }
        return result;
    }
    async getBoardArticles(memberId, input) {
        const { articleCategory, text } = input.search;
        const match = { articleStatus: board_article_enum_1.BoardArticleStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        if (articleCategory)
            match.articleCategory = articleCategory;
        if (text)
            match.articleTitle = { $regex: new RegExp(text, 'i') };
        if (input.search?.memberId) {
            match.memberId = (0, config_1.ShapeIntoMongoObjectId)(input.search.memberId);
        }
        console.log('match:', match);
        const result = await this.boardArticleModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId),
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async likeTargetBoardArticle(memberId, likeRefId) {
        const target = await this.boardArticleModel
            .findOne({ _id: likeRefId, articleStatus: board_article_enum_1.BoardArticleStatus.ACTIVE })
            .exec();
        if (!target)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        const input = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: like_enum_1.LikeGroup.ARTICLE,
        };
        const modifier = await this.likeService.toggleLike(input);
        const result = await this.boardArticleStatsEditor({
            _id: likeRefId,
            targetKey: 'articleLikes',
            modifier: modifier,
        });
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.SOMETHING_WENT_WRONG);
        return result;
    }
    async getAllBoardArticlesByAdmin(input) {
        const { articleStatus, articleCategory } = input.search;
        const match = {};
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        if (articleStatus)
            match.articleStatus = articleStatus;
        if (articleCategory)
            match.articleCategory = articleCategory;
        const result = await this.boardArticleModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async updateBoardArticleByAdmin(input) {
        const { _id, articleStatus } = input;
        const result = await this.boardArticleModel
            .findOneAndUpdate({ _id: _id, articleStatus: board_article_enum_1.BoardArticleStatus.ACTIVE }, input, {
            new: true,
        })
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        if (articleStatus === board_article_enum_1.BoardArticleStatus.DELETE) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberArticles',
                modifier: -1,
            });
        }
        return result;
    }
    async removeBoardArticleByAdmin(articleId) {
        const search = { _id: articleId, articleStatus: board_article_enum_1.BoardArticleStatus.DELETE };
        const result = await this.boardArticleModel.findOneAndDelete(search).exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.REMOVE_FAILED);
        return result;
    }
    async boardArticleStatsEditor(input) {
        const { _id, targetKey, modifier } = input;
        return await this.boardArticleModel
            .findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, {
            new: true,
        })
            .exec();
    }
};
exports.BoardArticleService = BoardArticleService;
exports.BoardArticleService = BoardArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('BoardArticle')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _c : Object, typeof (_d = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _d : Object])
], BoardArticleService);


/***/ }),
/* 75 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleUpdate = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const board_article_enum_1 = __webpack_require__(59);
const mongoose_1 = __webpack_require__(15);
let BoardArticleUpdate = class BoardArticleUpdate {
    _id;
    articleStatus;
    articleTitle;
    articleContent;
    articleImage;
};
exports.BoardArticleUpdate = BoardArticleUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], BoardArticleUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => board_article_enum_1.BoardArticleStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof board_article_enum_1.BoardArticleStatus !== "undefined" && board_article_enum_1.BoardArticleStatus) === "function" ? _b : Object)
], BoardArticleUpdate.prototype, "articleStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 50),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BoardArticleUpdate.prototype, "articleTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(3, 250),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BoardArticleUpdate.prototype, "articleContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BoardArticleUpdate.prototype, "articleImage", void 0);
exports.BoardArticleUpdate = BoardArticleUpdate = __decorate([
    (0, graphql_1.InputType)()
], BoardArticleUpdate);


/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentModule = void 0;
const common_1 = __webpack_require__(3);
const comment_resolver_1 = __webpack_require__(77);
const mongoose_1 = __webpack_require__(14);
const Comment_model_1 = __webpack_require__(85);
const auth_module_1 = __webpack_require__(49);
const member_module_1 = __webpack_require__(11);
const property_module_1 = __webpack_require__(63);
const board_article_module_1 = __webpack_require__(70);
const comment_service_1 = __webpack_require__(81);
const Member_model_1 = __webpack_require__(48);
const notification_module_1 = __webpack_require__(55);
const repair_property_module_1 = __webpack_require__(86);
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Comment', schema: Comment_model_1.default },
                { name: 'Member', schema: Member_model_1.default },
            ]),
            notification_module_1.NotificationModule,
            auth_module_1.AuthModule,
            member_module_1.MemberModule,
            property_module_1.PropertyModule,
            board_article_module_1.BoardArticleModule,
            repair_property_module_1.RepairPropertyModule
        ],
        providers: [comment_resolver_1.CommentResolver, comment_service_1.CommentService],
    })
], CommentModule);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentResolver = void 0;
const graphql_1 = __webpack_require__(7);
const common_1 = __webpack_require__(3);
const auth_guard_1 = __webpack_require__(40);
const comment_1 = __webpack_require__(78);
const comment_input_1 = __webpack_require__(80);
const authMember_decorator_1 = __webpack_require__(41);
const mongoose_1 = __webpack_require__(15);
const comment_service_1 = __webpack_require__(81);
const comment_update_1 = __webpack_require__(84);
const config_1 = __webpack_require__(21);
const without_guard_1 = __webpack_require__(45);
const roles_decorator_1 = __webpack_require__(42);
const member_enum_1 = __webpack_require__(16);
const roles_guard_1 = __webpack_require__(43);
let CommentResolver = class CommentResolver {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    async createComment(input, memberId) {
        console.log('Mutation: createComment');
        return await this.commentService.createComment(memberId, input);
    }
    async updateComment(input, memberId) {
        console.log('Mutation: updateComment');
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.commentService.updateComment(memberId, input);
    }
    async getComments(input, memberId) {
        console.log('Query: getComments');
        input.search.commentRefId = (0, config_1.ShapeIntoMongoObjectId)(input.search.commentRefId);
        return await this.commentService.getComments(memberId, input);
    }
    async removeCommentByAdmin(input) {
        console.log('Mutation: removeCommentByAdmin');
        const commentId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.commentService.removeCommentByAdmin(commentId);
    }
};
exports.CommentResolver = CommentResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => comment_1.Comment),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof comment_input_1.CommentInput !== "undefined" && comment_input_1.CommentInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CommentResolver.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => comment_1.Comment),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof comment_update_1.CommentUpdate !== "undefined" && comment_update_1.CommentUpdate) === "function" ? _e : Object, typeof (_f = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CommentResolver.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => comment_1.Comments),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof comment_input_1.CommentsInquiry !== "undefined" && comment_input_1.CommentsInquiry) === "function" ? _h : Object, typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], CommentResolver.prototype, "getComments", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => comment_1.Comment),
    __param(0, (0, graphql_1.Args)('commentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], CommentResolver.prototype, "removeCommentByAdmin", null);
exports.CommentResolver = CommentResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof comment_service_1.CommentService !== "undefined" && comment_service_1.CommentService) === "function" ? _a : Object])
], CommentResolver);


/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Comments = exports.Comment = void 0;
const graphql_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(15);
const comment_enum_1 = __webpack_require__(79);
const member_1 = __webpack_require__(37);
let Comment = class Comment {
    _id;
    commentStatus;
    commentGroup;
    commentContent;
    commentRefId;
    memberId;
    createdAt;
    updatedAt;
    memberData;
};
exports.Comment = Comment;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Comment.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => comment_enum_1.CommentStatus),
    __metadata("design:type", typeof (_b = typeof comment_enum_1.CommentStatus !== "undefined" && comment_enum_1.CommentStatus) === "function" ? _b : Object)
], Comment.prototype, "commentStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => comment_enum_1.CommentGroup),
    __metadata("design:type", typeof (_c = typeof comment_enum_1.CommentGroup !== "undefined" && comment_enum_1.CommentGroup) === "function" ? _c : Object)
], Comment.prototype, "commentGroup", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Comment.prototype, "commentContent", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], Comment.prototype, "commentRefId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_e = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _e : Object)
], Comment.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _h : Object)
], Comment.prototype, "memberData", void 0);
exports.Comment = Comment = __decorate([
    (0, graphql_1.ObjectType)()
], Comment);
let Comments = class Comments {
    list;
    metaCounter;
};
exports.Comments = Comments;
__decorate([
    (0, graphql_1.Field)(() => [Comment]),
    __metadata("design:type", Array)
], Comments.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Comments.prototype, "metaCounter", void 0);
exports.Comments = Comments = __decorate([
    (0, graphql_1.ObjectType)()
], Comments);


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentGroup = exports.CommentStatus = void 0;
const graphql_1 = __webpack_require__(7);
var CommentStatus;
(function (CommentStatus) {
    CommentStatus["ACTIVE"] = "ACTIVE";
    CommentStatus["DELETE"] = "DELETE";
})(CommentStatus || (exports.CommentStatus = CommentStatus = {}));
(0, graphql_1.registerEnumType)(CommentStatus, {
    name: 'CommentStatus',
});
var CommentGroup;
(function (CommentGroup) {
    CommentGroup["MEMBER"] = "MEMBER";
    CommentGroup["ARTICLE"] = "ARTICLE";
    CommentGroup["PROPERTY"] = "PROPERTY";
    CommentGroup["REPAIR_PROPERTY"] = "REPAIR_PROPERTY";
})(CommentGroup || (exports.CommentGroup = CommentGroup = {}));
(0, graphql_1.registerEnumType)(CommentGroup, {
    name: 'CommentGroup',
});


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsInquiry = exports.CommentInput = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const mongoose_1 = __webpack_require__(15);
const comment_enum_1 = __webpack_require__(79);
const config_1 = __webpack_require__(21);
const common_enum_1 = __webpack_require__(17);
let CommentInput = class CommentInput {
    commentGroup;
    commentContent;
    commentRefId;
    memberId;
};
exports.CommentInput = CommentInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => comment_enum_1.CommentGroup),
    __metadata("design:type", typeof (_a = typeof comment_enum_1.CommentGroup !== "undefined" && comment_enum_1.CommentGroup) === "function" ? _a : Object)
], CommentInput.prototype, "commentGroup", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 1000),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CommentInput.prototype, "commentContent", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], CommentInput.prototype, "commentRefId", void 0);
exports.CommentInput = CommentInput = __decorate([
    (0, graphql_1.InputType)()
], CommentInput);
let CISearch = class CISearch {
    commentRefId;
};
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], CISearch.prototype, "commentRefId", void 0);
CISearch = __decorate([
    (0, graphql_1.InputType)()
], CISearch);
let CommentsInquiry = class CommentsInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.CommentsInquiry = CommentsInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CommentsInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CommentsInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableCommentSorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CommentsInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _d : Object)
], CommentsInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => CISearch),
    __metadata("design:type", CISearch)
], CommentsInquiry.prototype, "search", void 0);
exports.CommentsInquiry = CommentsInquiry = __decorate([
    (0, graphql_1.InputType)()
], CommentsInquiry);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const member_service_1 = __webpack_require__(13);
const mongoose_2 = __webpack_require__(15);
const property_service_1 = __webpack_require__(65);
const common_enum_1 = __webpack_require__(17);
const comment_enum_1 = __webpack_require__(79);
const config_1 = __webpack_require__(21);
const notification_service_1 = __webpack_require__(29);
const notification_enum_1 = __webpack_require__(30);
const board_article_service_1 = __webpack_require__(74);
const repair_property_service_1 = __webpack_require__(82);
let CommentService = class CommentService {
    commentModule;
    memberService;
    propertyService;
    boardArticleService;
    repairPropertyService;
    notificationService;
    memberModel;
    constructor(commentModule, memberService, propertyService, boardArticleService, repairPropertyService, notificationService, memberModel) {
        this.commentModule = commentModule;
        this.memberService = memberService;
        this.propertyService = propertyService;
        this.boardArticleService = boardArticleService;
        this.repairPropertyService = repairPropertyService;
        this.notificationService = notificationService;
        this.memberModel = memberModel;
    }
    async createComment(memberId, input) {
        input.memberId = memberId;
        let result = null;
        try {
            result = await this.commentModule.create(input);
            let ownerId = null;
            switch (input.commentGroup) {
                case comment_enum_1.CommentGroup.MEMBER:
                    ownerId = input.commentRefId.toString();
                    await this.memberService.memberStatsEditor({
                        _id: input.commentRefId,
                        targetKey: 'memberComments',
                        modifier: 1,
                    });
                    break;
                case comment_enum_1.CommentGroup.PROPERTY:
                    const property = await this.propertyService.getProperty(null, input.commentRefId);
                    ownerId = property.memberId.toString();
                    await this.propertyService.propertyStatsEditor({
                        _id: input.commentRefId,
                        targetKey: 'propertyComments',
                        modifier: 1,
                    });
                    break;
                case comment_enum_1.CommentGroup.ARTICLE:
                    const article = await this.boardArticleService.getBoardArticle(null, input.commentRefId);
                    ownerId = article.memberId.toString();
                    await this.boardArticleService.boardArticleStatsEditor({
                        _id: input.commentRefId,
                        targetKey: 'articleComments',
                        modifier: 1,
                    });
                    break;
                case comment_enum_1.CommentGroup.REPAIR_PROPERTY:
                    const repairProperty = await this.repairPropertyService.getRepairProperty(null, input.commentRefId);
                    ownerId = repairProperty.memberId.toString();
                    await this.repairPropertyService.repairPropertyStatsEditor({
                        _id: input.commentRefId,
                        targetKey: 'repairPropertyComments',
                        modifier: 1,
                    });
                    break;
            }
            if (ownerId && ownerId !== memberId.toString()) {
                await this.sendCommentNotification(memberId.toString(), ownerId, input.commentGroup, input.commentContent, input.commentRefId.toString());
            }
        }
        catch (err) {
            console.log('Error, Service.model:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.CREATE_FAILED);
        return result;
    }
    async sendCommentNotification(authorId, receiverId, commentGroup, commentContent, refId) {
        const commenter = await this.memberModel.findById(authorId).exec();
        const commenterName = commenter ? commenter.memberNick : 'Someone';
        let notificationDesc = '';
        switch (commentGroup) {
            case comment_enum_1.CommentGroup.PROPERTY:
                const property = await this.propertyService.getProperty(null, refId);
                notificationDesc = `${commenterName} commented on your property "${property.propertyTitle}"`;
                break;
            case comment_enum_1.CommentGroup.REPAIR_PROPERTY:
                const repairProperty = await this.repairPropertyService.getRepairProperty(null, refId);
                notificationDesc = `${commenterName} commented on your property "${repairProperty.repairPropertyType}"`;
                break;
            case comment_enum_1.CommentGroup.ARTICLE:
                const article = await this.boardArticleService.getBlog(null, refId);
                notificationDesc = `${commenterName} commented on your article "${article.articleTitle}"`;
                break;
            case comment_enum_1.CommentGroup.MEMBER:
                notificationDesc = `${commenterName} commented on your profile`;
                break;
        }
        await this.notificationService.createNotification({
            notificationType: notification_enum_1.NotificationType.COMMENT,
            notificationGroup: this.mapCommentGroupToNotificationGroup(commentGroup),
            notificationTitle: 'New Comment',
            notificationDesc,
            authorId,
            receiverId,
        });
    }
    mapCommentGroupToNotificationGroup(commentGroup) {
        switch (commentGroup) {
            case comment_enum_1.CommentGroup.PROPERTY:
                return notification_enum_1.NotificationGroup.PROPERTY;
            case comment_enum_1.CommentGroup.REPAIR_PROPERTY:
                return notification_enum_1.NotificationGroup.REPAIR_PROPERTY;
            case comment_enum_1.CommentGroup.ARTICLE:
                return notification_enum_1.NotificationGroup.ARTICLE;
            case comment_enum_1.CommentGroup.MEMBER:
                return notification_enum_1.NotificationGroup.MEMBER;
            default:
                return notification_enum_1.NotificationGroup.MEMBER;
        }
    }
    async updateComment(memberId, input) {
        const { _id } = input;
        const result = await this.commentModule.findOneAndUpdate({
            _id: _id,
            memberId: memberId,
            commentStatus: comment_enum_1.CommentStatus.ACTIVE,
        }, input, {
            new: true,
        });
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        return result;
    }
    async getComments(memberId, input) {
        const { commentRefId } = input.search;
        const match = { commentRefId: commentRefId, commentStatus: comment_enum_1.CommentStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        const result = await this.commentModule.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        config_1.lookupMember,
                        { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ]);
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async removeCommentByAdmin(commentId) {
        const result = await this.commentModule.findOneAndDelete(commentId);
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.REMOVE_FAILED);
        return result;
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Comment')),
    __param(6, (0, mongoose_1.InjectModel)('Member')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof property_service_1.PropertyService !== "undefined" && property_service_1.PropertyService) === "function" ? _c : Object, typeof (_d = typeof board_article_service_1.BoardArticleService !== "undefined" && board_article_service_1.BoardArticleService) === "function" ? _d : Object, typeof (_e = typeof repair_property_service_1.RepairPropertyService !== "undefined" && repair_property_service_1.RepairPropertyService) === "function" ? _e : Object, typeof (_f = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _f : Object, typeof (_g = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _g : Object])
], CommentService);


/***/ }),
/* 82 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyService = void 0;
const common_1 = __webpack_require__(3);
const member_service_1 = __webpack_require__(13);
const view_service_1 = __webpack_require__(25);
const like_service_1 = __webpack_require__(28);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const common_enum_1 = __webpack_require__(17);
const view_enum_1 = __webpack_require__(26);
const like_enum_1 = __webpack_require__(27);
const repairProperty_enum_1 = __webpack_require__(83);
const config_1 = __webpack_require__(21);
const moment = __webpack_require__(66);
let RepairPropertyService = class RepairPropertyService {
    repairPropertyModel;
    memberService;
    viewService;
    likeService;
    constructor(repairPropertyModel, memberService, viewService, likeService) {
        this.repairPropertyModel = repairPropertyModel;
        this.memberService = memberService;
        this.viewService = viewService;
        this.likeService = likeService;
    }
    async createRepairProperty(input) {
        try {
            console.log('executed');
            const result = await this.repairPropertyModel.create(input);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: 1,
            });
            return result;
        }
        catch (err) {
            console.log("Error, Service.model:", err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async getRepairProperty(memberId, repairId) {
        const search = {
            _id: repairId,
            repairPropertyStatus: repairProperty_enum_1.RepairPropertyStatus.ACTIVE,
        };
        const targetProperty = await this.repairPropertyModel
            .findOne(search)
            .lean()
            .exec();
        if (!targetProperty)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        if (memberId) {
            const viewInput = { memberId: memberId, viewRefId: repairId, viewGroup: view_enum_1.ViewGroup.REPAIR_PROPERTY };
            console.log("View input:", viewInput);
            const newView = await this.viewService.recordView(viewInput);
            console.log("New view created:", newView);
            if (newView) {
                console.log("Updating stats...");
                await this.repairPropertyStatsEditor({ _id: repairId, targetKey: 'repairPropertyViews', modifier: 1 });
                targetProperty.repairPropertyViews++;
            }
            const LikeInput = { memberId: memberId, likeRefId: repairId, likeGroup: like_enum_1.LikeGroup.REPAIR_PROPERTY };
            targetProperty.meLiked = await this.likeService.checkLikeExistence(LikeInput);
        }
        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        console.log("=====> ", targetProperty);
        return targetProperty;
    }
    async getRepairProperties(memberId, input) {
        const match = { repairPropertyStatus: repairProperty_enum_1.RepairPropertyStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        this.shapeMatchQuery(match, input);
        console.log('match:', match);
        const result = await this.repairPropertyModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId),
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    shapeMatchQuery(match, input) {
        const { memberId, typeList, text, } = input.search;
        if (memberId)
            match.memberId = (0, config_1.ShapeIntoMongoObjectId)(memberId);
        if (typeList && typeList.length)
            match.propertyType = { $in: typeList };
        if (text) {
            match.propertyTitle = { $regex: new RegExp(text, 'i') };
        }
    }
    async getTechnicianProperties(memberId, input) {
        const { repairPropertyStatus } = input.search;
        if (repairPropertyStatus === repairProperty_enum_1.RepairPropertyStatus.DELETE)
            throw new common_1.BadRequestException(common_enum_1.Message.NOT_ALLOWED_REQUEST);
        const match = {
            memberId: memberId,
            repairPropertyStatus: repairPropertyStatus ?? { $ne: repairProperty_enum_1.RepairPropertyStatus.DELETE },
        };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        const result = await this.repairPropertyModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async getRepairFavorites(memberId, input) {
        return await this.likeService.getFavoriteRepairProperties(memberId, input);
    }
    async getRepairVisited(memberId, input) {
        return await this.viewService.getVisitedRepairProperties(memberId, input);
    }
    async likeTargetRepairProperty(memberId, likeRefId) {
        const target = await this.repairPropertyModel
            .findOne({ _id: likeRefId, repairPropertyStatus: repairProperty_enum_1.RepairPropertyStatus.ACTIVE })
            .exec();
        if (!target)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        const input = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: like_enum_1.LikeGroup.REPAIR_PROPERTY
        };
        const modifier = await this.likeService.toggleLike(input);
        const result = await this.repairPropertyStatsEditor({ _id: likeRefId, targetKey: 'repairPropertyLikes', modifier: modifier });
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.SOMETHING_WENT_WRONG);
        return result;
    }
    async getAllRepairPropertiesByAdmin(input) {
        const { repairPropertyStatus } = input.search;
        const match = {};
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        if (repairPropertyStatus)
            match.repairPropertyStatus = repairPropertyStatus;
        const result = await this.repairPropertyModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit },
                        { $limit: input.limit },
                        config_1.lookupMember,
                        { $unwind: '$memberData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async updateRepairPropertyByAdmin(input) {
        let { repairPropertyStatus, deletedAt } = input;
        const search = {
            _id: input._id,
            repairPropertyStatus: repairProperty_enum_1.RepairPropertyStatus.ACTIVE,
        };
        if (repairPropertyStatus === repairProperty_enum_1.RepairPropertyStatus.DELETE)
            deletedAt = moment().toDate();
        const result = await this.repairPropertyModel
            .findOneAndUpdate(search, input, {
            new: true,
        })
            .exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.UPDATE_FAILED);
        if (deletedAt) {
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: -1,
            });
        }
        return result;
    }
    async removeRepairPropertyByAdmin(repairId) {
        const search = { _id: repairId, propertyStatus: repairProperty_enum_1.RepairPropertyStatus.DELETE };
        const result = await this.repairPropertyModel.findByIdAndDelete(search).exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.REMOVE_FAILED);
        return result;
    }
    async repairPropertyStatsEditor(input) {
        const { _id, targetKey, modifier } = input;
        return await this.repairPropertyModel
            .findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, {
            new: true,
        })
            .exec();
    }
};
exports.RepairPropertyService = RepairPropertyService;
exports.RepairPropertyService = RepairPropertyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('RepairProperty')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _c : Object, typeof (_d = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _d : Object])
], RepairPropertyService);


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyStatus = exports.RepairPropertyType = void 0;
const graphql_1 = __webpack_require__(7);
var RepairPropertyType;
(function (RepairPropertyType) {
    RepairPropertyType["STOOL"] = "STOOL";
    RepairPropertyType["TABLE"] = "TABLE";
    RepairPropertyType["BED"] = "BED";
    RepairPropertyType["SOFA"] = "SOFA";
    RepairPropertyType["CABINET"] = "CABINET";
    RepairPropertyType["CHAIR"] = "CHAIR";
    RepairPropertyType["SHELF"] = "SHELF";
    RepairPropertyType["OTHER"] = "OTHER";
})(RepairPropertyType || (exports.RepairPropertyType = RepairPropertyType = {}));
(0, graphql_1.registerEnumType)(RepairPropertyType, {
    name: 'RepairPropertyType',
});
var RepairPropertyStatus;
(function (RepairPropertyStatus) {
    RepairPropertyStatus["ACTIVE"] = "ACTIVE";
    RepairPropertyStatus["DELETE"] = "DELETE";
    RepairPropertyStatus["PAUSE"] = "PAUSE";
})(RepairPropertyStatus || (exports.RepairPropertyStatus = RepairPropertyStatus = {}));
(0, graphql_1.registerEnumType)(RepairPropertyStatus, {
    name: 'RepairPropertyStatus',
});


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentUpdate = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const comment_enum_1 = __webpack_require__(79);
const mongoose_1 = __webpack_require__(15);
let CommentUpdate = class CommentUpdate {
    _id;
    commentStatus;
    commentContent;
};
exports.CommentUpdate = CommentUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], CommentUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => comment_enum_1.CommentStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof comment_enum_1.CommentStatus !== "undefined" && comment_enum_1.CommentStatus) === "function" ? _b : Object)
], CommentUpdate.prototype, "commentStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 100),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CommentUpdate.prototype, "commentContent", void 0);
exports.CommentUpdate = CommentUpdate = __decorate([
    (0, graphql_1.InputType)()
], CommentUpdate);


/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const comment_enum_1 = __webpack_require__(79);
const CommentSchema = new mongoose_1.Schema({
    commentStatus: {
        type: String,
        enum: comment_enum_1.CommentStatus,
        default: comment_enum_1.CommentStatus.ACTIVE,
    },
    commentGroup: {
        type: String,
        enum: comment_enum_1.CommentGroup,
        required: true,
    },
    commentContent: {
        type: String,
        required: true,
    },
    commentRefId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true, collection: 'comments' });
exports["default"] = CommentSchema;


/***/ }),
/* 86 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyModule = void 0;
const common_1 = __webpack_require__(3);
const repair_property_service_1 = __webpack_require__(82);
const repair_property_resolver_1 = __webpack_require__(87);
const mongoose_1 = __webpack_require__(14);
const RepairProperty_1 = __webpack_require__(91);
const auth_module_1 = __webpack_require__(49);
const view_module_1 = __webpack_require__(51);
const member_module_1 = __webpack_require__(11);
const like_module_1 = __webpack_require__(53);
let RepairPropertyModule = class RepairPropertyModule {
};
exports.RepairPropertyModule = RepairPropertyModule;
exports.RepairPropertyModule = RepairPropertyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'RepairProperty',
                    schema: RepairProperty_1.default,
                },
            ]),
            auth_module_1.AuthModule,
            view_module_1.ViewModule,
            member_module_1.MemberModule,
            like_module_1.LikeModule,
        ],
        providers: [repair_property_service_1.RepairPropertyService, repair_property_resolver_1.RepairPropertyResolver],
        exports: [repair_property_service_1.RepairPropertyService]
    })
], RepairPropertyModule);


/***/ }),
/* 87 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyResolver = void 0;
const graphql_1 = __webpack_require__(7);
const repair_property_service_1 = __webpack_require__(82);
const roles_decorator_1 = __webpack_require__(42);
const member_enum_1 = __webpack_require__(16);
const common_1 = __webpack_require__(3);
const roles_guard_1 = __webpack_require__(43);
const repairProperty_1 = __webpack_require__(88);
const authMember_decorator_1 = __webpack_require__(41);
const mongoose_1 = __webpack_require__(15);
const repairProperty_input_1 = __webpack_require__(89);
const config_1 = __webpack_require__(21);
const without_guard_1 = __webpack_require__(45);
const auth_guard_1 = __webpack_require__(40);
const repairProperty_update_1 = __webpack_require__(90);
let RepairPropertyResolver = class RepairPropertyResolver {
    repairPropertyService;
    constructor(repairPropertyService) {
        this.repairPropertyService = repairPropertyService;
    }
    async createRepairProperty(input, memberId) {
        console.log('Mutation: createRepairProperty');
        input.memberId = memberId;
        console.log('memberId from context:', memberId);
        return await this.repairPropertyService.createRepairProperty(input);
    }
    async getRepairProperty(input, memberId) {
        console.log('Query: getRepairProperty');
        console.log("=====> ", memberId);
        const repairId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.repairPropertyService.getRepairProperty(memberId, repairId);
    }
    async getRepairProperties(input, memberId) {
        console.log('Mutation: getRepairProperties');
        return await this.repairPropertyService.getRepairProperties(memberId, input);
    }
    async getTechnicianProperties(input, memberId) {
        console.log('Mutation: getTechnicianProperties');
        return await this.repairPropertyService.getTechnicianProperties(memberId, input);
    }
    async getRepairFavorites(input, memberId) {
        console.log('Query: getRepairFavorites');
        return await this.repairPropertyService.getRepairFavorites(memberId, input);
    }
    async getRepairVisited(input, memberId) {
        console.log('Query: getRepairVisited');
        return await this.repairPropertyService.getRepairVisited(memberId, input);
    }
    async likeTargetRepairProperty(input, memberId) {
        console.log('Mutation: likeTargetRepairProperty');
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.repairPropertyService.likeTargetRepairProperty(memberId, likeRefId);
    }
    async getAllRepairPropertiesByAdmin(input, memberId) {
        console.log('Query: getAllPropertiesByAdmin');
        return await this.repairPropertyService.getAllRepairPropertiesByAdmin(input);
    }
    async updateRepairPropertyByAdmin(input) {
        console.log('Mutation: updateRepairPropertyByAdmin');
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.repairPropertyService.updateRepairPropertyByAdmin(input);
    }
    async removeRepairPropertyByAdmin(input) {
        console.log('Mutation: removePropertyByAdmin');
        const repairId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.repairPropertyService.removeRepairPropertyByAdmin(repairId);
    }
};
exports.RepairPropertyResolver = RepairPropertyResolver;
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.TECHNICIAN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => repairProperty_1.RepairProperty),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof repairProperty_input_1.RepairPropertyInput !== "undefined" && repairProperty_input_1.RepairPropertyInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], RepairPropertyResolver.prototype, "createRepairProperty", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => repairProperty_1.RepairProperty),
    __param(0, (0, graphql_1.Args)('repairId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], RepairPropertyResolver.prototype, "getRepairProperty", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)((returns) => repairProperty_1.RepairProperties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof repairProperty_input_1.RepairPropertiesInquiry !== "undefined" && repairProperty_input_1.RepairPropertiesInquiry) === "function" ? _g : Object, typeof (_h = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], RepairPropertyResolver.prototype, "getRepairProperties", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.TECHNICIAN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)((returns) => repairProperty_1.RepairProperties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof repairProperty_input_1.TechnicianPropertiesInquiry !== "undefined" && repairProperty_input_1.TechnicianPropertiesInquiry) === "function" ? _k : Object, typeof (_l = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], RepairPropertyResolver.prototype, "getTechnicianProperties", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)((returns) => repairProperty_1.RepairProperties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_o = typeof repairProperty_input_1.RepairOrdinaryInquiry !== "undefined" && repairProperty_input_1.RepairOrdinaryInquiry) === "function" ? _o : Object, typeof (_p = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _p : Object]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], RepairPropertyResolver.prototype, "getRepairFavorites", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)((returns) => repairProperty_1.RepairProperties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_r = typeof repairProperty_input_1.RepairOrdinaryInquiry !== "undefined" && repairProperty_input_1.RepairOrdinaryInquiry) === "function" ? _r : Object, typeof (_s = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _s : Object]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], RepairPropertyResolver.prototype, "getRepairVisited", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => repairProperty_1.RepairProperty),
    __param(0, (0, graphql_1.Args)('repairId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_u = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], RepairPropertyResolver.prototype, "likeTargetRepairProperty", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)((returns) => repairProperty_1.RepairProperties),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_w = typeof repairProperty_input_1.AllRepairPropertiesInquiry !== "undefined" && repairProperty_input_1.AllRepairPropertiesInquiry) === "function" ? _w : Object, typeof (_x = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _x : Object]),
    __metadata("design:returntype", typeof (_y = typeof Promise !== "undefined" && Promise) === "function" ? _y : Object)
], RepairPropertyResolver.prototype, "getAllRepairPropertiesByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => repairProperty_1.RepairProperty),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_z = typeof repairProperty_update_1.RepairPropertyUpdate !== "undefined" && repairProperty_update_1.RepairPropertyUpdate) === "function" ? _z : Object]),
    __metadata("design:returntype", typeof (_0 = typeof Promise !== "undefined" && Promise) === "function" ? _0 : Object)
], RepairPropertyResolver.prototype, "updateRepairPropertyByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)((returns) => repairProperty_1.RepairProperty),
    __param(0, (0, graphql_1.Args)('repairId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_1 = typeof Promise !== "undefined" && Promise) === "function" ? _1 : Object)
], RepairPropertyResolver.prototype, "removeRepairPropertyByAdmin", null);
exports.RepairPropertyResolver = RepairPropertyResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof repair_property_service_1.RepairPropertyService !== "undefined" && repair_property_service_1.RepairPropertyService) === "function" ? _a : Object])
], RepairPropertyResolver);


/***/ }),
/* 88 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairProperties = exports.RepairProperty = void 0;
const graphql_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(15);
const member_1 = __webpack_require__(37);
const like_1 = __webpack_require__(38);
const repairProperty_enum_1 = __webpack_require__(83);
let RepairProperty = class RepairProperty {
    _id;
    repairPropertyType;
    repairPropertyStatus;
    repairPropertyAddress;
    repairPropertyDescription;
    repairPropertyImages;
    repairPropertyViews;
    repairPropertyLikes;
    repairPropertyComments;
    memberId;
    deletedAt;
    constructedAt;
    createdAt;
    meLiked;
    memberData;
};
exports.RepairProperty = RepairProperty;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], RepairProperty.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyType),
    __metadata("design:type", typeof (_b = typeof repairProperty_enum_1.RepairPropertyType !== "undefined" && repairProperty_enum_1.RepairPropertyType) === "function" ? _b : Object)
], RepairProperty.prototype, "repairPropertyType", void 0);
__decorate([
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof repairProperty_enum_1.RepairPropertyStatus !== "undefined" && repairProperty_enum_1.RepairPropertyStatus) === "function" ? _c : Object)
], RepairProperty.prototype, "repairPropertyStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RepairProperty.prototype, "repairPropertyAddress", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RepairProperty.prototype, "repairPropertyDescription", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], RepairProperty.prototype, "repairPropertyImages", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairProperty.prototype, "repairPropertyViews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairProperty.prototype, "repairPropertyLikes", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairProperty.prototype, "repairPropertyComments", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], RepairProperty.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], RepairProperty.prototype, "deletedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], RepairProperty.prototype, "constructedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], RepairProperty.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => [like_1.MeLiked], { nullable: true }),
    __metadata("design:type", Array)
], RepairProperty.prototype, "meLiked", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _h : Object)
], RepairProperty.prototype, "memberData", void 0);
exports.RepairProperty = RepairProperty = __decorate([
    (0, graphql_1.ObjectType)()
], RepairProperty);
let RepairProperties = class RepairProperties {
    list;
    metaCounter;
};
exports.RepairProperties = RepairProperties;
__decorate([
    (0, graphql_1.Field)(() => [RepairProperty]),
    __metadata("design:type", Array)
], RepairProperties.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], RepairProperties.prototype, "metaCounter", void 0);
exports.RepairProperties = RepairProperties = __decorate([
    (0, graphql_1.ObjectType)()
], RepairProperties);


/***/ }),
/* 89 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllRepairPropertiesInquiry = exports.TechnicianPropertiesInquiry = exports.RepairOrdinaryInquiry = exports.RepairPropertiesInquiry = exports.RepairPISearch = exports.RepairPropertyInput = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const property_enum_1 = __webpack_require__(61);
const mongoose_1 = __webpack_require__(15);
const common_enum_1 = __webpack_require__(17);
const config_1 = __webpack_require__(21);
const repairProperty_enum_1 = __webpack_require__(83);
let RepairPropertyInput = class RepairPropertyInput {
    repairPropertyType;
    repairPropertyStatus;
    repairPropertyAddress;
    repairPropertyDescription;
    repairPropertyImages;
    constructedAt;
    memberId;
};
exports.RepairPropertyInput = RepairPropertyInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyType),
    __metadata("design:type", typeof (_a = typeof property_enum_1.PropertyType !== "undefined" && property_enum_1.PropertyType) === "function" ? _a : Object)
], RepairPropertyInput.prototype, "repairPropertyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof repairProperty_enum_1.RepairPropertyStatus !== "undefined" && repairProperty_enum_1.RepairPropertyStatus) === "function" ? _b : Object)
], RepairPropertyInput.prototype, "repairPropertyStatus", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 100),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RepairPropertyInput.prototype, "repairPropertyAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(5, 500),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], RepairPropertyInput.prototype, "repairPropertyDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], RepairPropertyInput.prototype, "repairPropertyImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], RepairPropertyInput.prototype, "constructedAt", void 0);
exports.RepairPropertyInput = RepairPropertyInput = __decorate([
    (0, graphql_1.InputType)()
], RepairPropertyInput);
let RepairPISearch = class RepairPISearch {
    memberId;
    typeList;
    repairPropertyStatus;
    text;
};
exports.RepairPISearch = RepairPISearch;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], RepairPISearch.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [repairProperty_enum_1.RepairPropertyType], { nullable: true }),
    __metadata("design:type", Array)
], RepairPISearch.prototype, "typeList", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof repairProperty_enum_1.RepairPropertyStatus !== "undefined" && repairProperty_enum_1.RepairPropertyStatus) === "function" ? _e : Object)
], RepairPISearch.prototype, "repairPropertyStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RepairPISearch.prototype, "text", void 0);
exports.RepairPISearch = RepairPISearch = __decorate([
    (0, graphql_1.InputType)()
], RepairPISearch);
let RepairPropertiesInquiry = class RepairPropertiesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.RepairPropertiesInquiry = RepairPropertiesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairPropertiesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairPropertiesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableRepairPropertySorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RepairPropertiesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _f : Object)
], RepairPropertiesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => RepairPISearch),
    __metadata("design:type", RepairPISearch)
], RepairPropertiesInquiry.prototype, "search", void 0);
exports.RepairPropertiesInquiry = RepairPropertiesInquiry = __decorate([
    (0, graphql_1.InputType)()
], RepairPropertiesInquiry);
let RepairOrdinaryInquiry = class RepairOrdinaryInquiry {
    page;
    limit;
};
exports.RepairOrdinaryInquiry = RepairOrdinaryInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairOrdinaryInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RepairOrdinaryInquiry.prototype, "limit", void 0);
exports.RepairOrdinaryInquiry = RepairOrdinaryInquiry = __decorate([
    (0, graphql_1.InputType)()
], RepairOrdinaryInquiry);
let RAPISearch = class RAPISearch {
    repairPropertyStatus;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof repairProperty_enum_1.RepairPropertyStatus !== "undefined" && repairProperty_enum_1.RepairPropertyStatus) === "function" ? _g : Object)
], RAPISearch.prototype, "repairPropertyStatus", void 0);
RAPISearch = __decorate([
    (0, graphql_1.InputType)()
], RAPISearch);
let TechnicianPropertiesInquiry = class TechnicianPropertiesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.TechnicianPropertiesInquiry = TechnicianPropertiesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TechnicianPropertiesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], TechnicianPropertiesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableRepairPropertySorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], TechnicianPropertiesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _h : Object)
], TechnicianPropertiesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => RAPISearch),
    __metadata("design:type", RAPISearch)
], TechnicianPropertiesInquiry.prototype, "search", void 0);
exports.TechnicianPropertiesInquiry = TechnicianPropertiesInquiry = __decorate([
    (0, graphql_1.InputType)()
], TechnicianPropertiesInquiry);
let AllRepairPropertiesInquiry = class AllRepairPropertiesInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.AllRepairPropertiesInquiry = AllRepairPropertiesInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AllRepairPropertiesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AllRepairPropertiesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(config_1.availableRepairPropertySorts),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AllRepairPropertiesInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_j = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _j : Object)
], AllRepairPropertiesInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => RAPISearch),
    __metadata("design:type", RAPISearch)
], AllRepairPropertiesInquiry.prototype, "search", void 0);
exports.AllRepairPropertiesInquiry = AllRepairPropertiesInquiry = __decorate([
    (0, graphql_1.InputType)()
], AllRepairPropertiesInquiry);


/***/ }),
/* 90 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyUpdate = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const mongoose_1 = __webpack_require__(15);
const repairProperty_enum_1 = __webpack_require__(83);
let RepairPropertyUpdate = class RepairPropertyUpdate {
    _id;
    repairPropertyType;
    repairPropertyStatus;
    deletedAt;
    constructedAt;
};
exports.RepairPropertyUpdate = RepairPropertyUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], RepairPropertyUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyType, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof repairProperty_enum_1.RepairPropertyType !== "undefined" && repairProperty_enum_1.RepairPropertyType) === "function" ? _b : Object)
], RepairPropertyUpdate.prototype, "repairPropertyType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => repairProperty_enum_1.RepairPropertyStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof repairProperty_enum_1.RepairPropertyStatus !== "undefined" && repairProperty_enum_1.RepairPropertyStatus) === "function" ? _c : Object)
], RepairPropertyUpdate.prototype, "repairPropertyStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], RepairPropertyUpdate.prototype, "constructedAt", void 0);
exports.RepairPropertyUpdate = RepairPropertyUpdate = __decorate([
    (0, graphql_1.InputType)()
], RepairPropertyUpdate);


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const repairProperty_enum_1 = __webpack_require__(83);
const RepairSchema = new mongoose_1.Schema({
    repairPropertyType: {
        type: String,
        enum: repairProperty_enum_1.RepairPropertyType,
        required: true,
    },
    repairPropertyStatus: {
        type: String,
        enum: repairProperty_enum_1.RepairPropertyStatus,
        default: repairProperty_enum_1.RepairPropertyStatus.ACTIVE,
    },
    repairPropertyAddress: {
        type: String,
        required: true,
    },
    repairPropertyDescription: {
        type: String,
        required: true,
    },
    repairPropertyImages: {
        type: [String],
        required: false,
    },
    repairPropertyViews: {
        type: Number,
        default: 0,
    },
    repairPropertyLikes: {
        type: Number,
        default: 0,
    },
    repairPropertyComments: {
        type: Number,
        default: 0,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
    deletedAt: {
        type: Date,
    },
    constructedAt: {
        type: Date,
    },
}, { timestamps: true, collection: 'repair_requests' });
exports["default"] = RepairSchema;


/***/ }),
/* 92 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const follow_resolver_1 = __webpack_require__(93);
const follow_service_1 = __webpack_require__(94);
const Follow_model_1 = __webpack_require__(62);
const auth_module_1 = __webpack_require__(49);
const member_module_1 = __webpack_require__(11);
let FollowModule = class FollowModule {
};
exports.FollowModule = FollowModule;
exports.FollowModule = FollowModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Follow',
                    schema: Follow_model_1.default
                }
            ]),
            auth_module_1.AuthModule,
            member_module_1.MemberModule,
        ],
        providers: [follow_resolver_1.FollowResolver, follow_service_1.FollowService],
        exports: [follow_service_1.FollowService]
    })
], FollowModule);


/***/ }),
/* 93 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowResolver = void 0;
const graphql_1 = __webpack_require__(7);
const follow_service_1 = __webpack_require__(94);
const auth_guard_1 = __webpack_require__(40);
const common_1 = __webpack_require__(3);
const follow_1 = __webpack_require__(39);
const authMember_decorator_1 = __webpack_require__(41);
const mongoose_1 = __webpack_require__(15);
const config_1 = __webpack_require__(21);
const without_guard_1 = __webpack_require__(45);
const follow_input_1 = __webpack_require__(95);
let FollowResolver = class FollowResolver {
    followService;
    constructor(followService) {
        this.followService = followService;
    }
    async subscribe(input, memberId) {
        console.log("Mutation: subscribe");
        const followingId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.followService.subscribe(memberId, followingId);
    }
    async unsubscribe(input, memberId) {
        console.log('Mutation: unsubscribe');
        const followingId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.followService.unsubscribe(memberId, followingId);
    }
    async getMemberFollowings(input, memberId) {
        console.log('Query: getMemberFollowings');
        const { followerId } = input.search;
        input.search.followerId = (0, config_1.ShapeIntoMongoObjectId)(followerId);
        return await this.followService.getMemberFollowings(memberId, input);
    }
    async getMemberFollowers(input, memberId) {
        console.log('Query: getMemberFollowers');
        const { followingId } = input.search;
        input.search.followingId = (0, config_1.ShapeIntoMongoObjectId)(followingId);
        return await this.followService.getMemberFollowers(memberId, input);
    }
};
exports.FollowResolver = FollowResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => follow_1.Follower),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], FollowResolver.prototype, "subscribe", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => follow_1.Follower),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], FollowResolver.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => follow_1.Followings),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof follow_input_1.FollowInquiry !== "undefined" && follow_input_1.FollowInquiry) === "function" ? _f : Object, typeof (_g = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], FollowResolver.prototype, "getMemberFollowings", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => follow_1.Followers),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof follow_input_1.FollowInquiry !== "undefined" && follow_input_1.FollowInquiry) === "function" ? _j : Object, typeof (_k = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], FollowResolver.prototype, "getMemberFollowers", null);
exports.FollowResolver = FollowResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof follow_service_1.FollowService !== "undefined" && follow_service_1.FollowService) === "function" ? _a : Object])
], FollowResolver);


/***/ }),
/* 94 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const member_service_1 = __webpack_require__(13);
const common_enum_1 = __webpack_require__(17);
const config_1 = __webpack_require__(21);
let FollowService = class FollowService {
    followModel;
    memberService;
    constructor(followModel, memberService) {
        this.followModel = followModel;
        this.memberService = memberService;
    }
    async subscribe(followerId, followingId) {
        if (followerId.toString() === followingId.toString()) {
            throw new common_1.InternalServerErrorException(common_enum_1.Message.SELF_SUBSCRIPTION_DENIED);
        }
        const targetMember = await this.memberService.getMember(null, followingId);
        if (!targetMember)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        const result = await this.registerSubscription(followerId, followingId);
        await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: 1 });
        await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: 1 });
        return result;
    }
    async registerSubscription(followerId, followingId) {
        try {
            return await this.followModel.create({
                followingId: followingId,
                followerId: followerId,
            });
        }
        catch (err) {
            console.log('Error, Service.model:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async unsubscribe(followerId, followingId) {
        const targetMember = await this.memberService.getMember(null, followingId);
        if (!targetMember)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        const result = await this.followModel.findOneAndDelete({
            followingId: followingId,
            followerId: followerId,
        }).exec();
        if (!result)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: -1 });
        await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: -1 });
        return result;
    }
    async getMemberFollowings(memberId, input) {
        const { page, limit, search } = input;
        if (!search?.followerId)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.BAD_REQUEST);
        const match = { followerId: search?.followerId };
        console.log('match:', match);
        const result = await this.followModel
            .aggregate([
            { $match: match },
            { $sort: { createdAt: common_enum_1.Direction.DESC } },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId, '$followingId'),
                        (0, config_1.lookupAuthMemberFollowed)({
                            followerId: memberId,
                            followingId: '$followingId'
                        }),
                        config_1.lookupFollowingData,
                        { $unwind: '$followingData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async getMemberFollowers(memberId, input) {
        const { page, limit, search } = input;
        if (!search?.followingId)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.BAD_REQUEST);
        const match = { followingId: search?.followingId };
        console.log('match:', match);
        const result = await this.followModel
            .aggregate([
            { $match: match },
            { $sort: { createdAt: common_enum_1.Direction.DESC } },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        (0, config_1.lookupAuthMemberLiked)(memberId, '$followerId'),
                        (0, config_1.lookupAuthMemberFollowed)({
                            followerId: memberId,
                            followingId: '$followingId'
                        }),
                        config_1.lookupFollowerData,
                        { $unwind: '$followerData' },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        if (!result.length)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
};
exports.FollowService = FollowService;
exports.FollowService = FollowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Follow')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object])
], FollowService);


/***/ }),
/* 95 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowInquiry = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const mongoose_1 = __webpack_require__(15);
let FollowSearch = class FollowSearch {
    followingId;
    followerId;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], FollowSearch.prototype, "followingId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], FollowSearch.prototype, "followerId", void 0);
FollowSearch = __decorate([
    (0, graphql_1.InputType)()
], FollowSearch);
let FollowInquiry = class FollowInquiry {
    page;
    limit;
    search;
};
exports.FollowInquiry = FollowInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], FollowInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], FollowInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => FollowSearch),
    __metadata("design:type", FollowSearch)
], FollowInquiry.prototype, "search", void 0);
exports.FollowInquiry = FollowInquiry = __decorate([
    (0, graphql_1.InputType)()
], FollowInquiry);


/***/ }),
/* 96 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const notice_resolver_1 = __webpack_require__(97);
const notice_service_1 = __webpack_require__(98);
const auth_module_1 = __webpack_require__(49);
const Notice_model_1 = __webpack_require__(104);
let NoticeModule = class NoticeModule {
};
exports.NoticeModule = NoticeModule;
exports.NoticeModule = NoticeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Notice', schema: Notice_model_1.default }]),
            auth_module_1.AuthModule,
        ],
        providers: [notice_resolver_1.NoticeResolver, notice_service_1.NoticeService],
        exports: [notice_service_1.NoticeService],
    })
], NoticeModule);


/***/ }),
/* 97 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeResolver = void 0;
const graphql_1 = __webpack_require__(7);
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(15);
const notice_service_1 = __webpack_require__(98);
const notice_1 = __webpack_require__(100);
const notice_input_1 = __webpack_require__(101);
const notice_inquiry_1 = __webpack_require__(102);
const authMember_decorator_1 = __webpack_require__(41);
const auth_guard_1 = __webpack_require__(40);
const roles_guard_1 = __webpack_require__(43);
const roles_decorator_1 = __webpack_require__(42);
const member_enum_1 = __webpack_require__(16);
const graphql_2 = __webpack_require__(103);
const without_guard_1 = __webpack_require__(45);
const config_1 = __webpack_require__(21);
let NoticeResolver = class NoticeResolver {
    noticeService;
    constructor(noticeService) {
        this.noticeService = noticeService;
    }
    async createNotice(input, memberId) {
        console.log('Mutation: createNotice');
        return await this.noticeService.createNotice(memberId, input);
    }
    async getAllNotices(input) {
        console.log('Query: getAllNotices');
        return await this.noticeService.getAllNotices(input);
    }
    async getNotice(noticeId) {
        console.log('Query: getNotice');
        const objectId = (0, config_1.ShapeIntoMongoObjectId)(noticeId);
        return await this.noticeService.getNotice(objectId);
    }
    async updateNotice(noticeId, input, memberId) {
        console.log('Mutation: updateNotice');
        const objectId = (0, config_1.ShapeIntoMongoObjectId)(noticeId);
        return await this.noticeService.updateNotice(memberId, objectId, input);
    }
    async removeNotice(noticeId, memberId) {
        console.log('Mutation: removeNotice');
        const objectId = (0, config_1.ShapeIntoMongoObjectId)(noticeId);
        return await this.noticeService.removeNotice(memberId, objectId);
    }
};
exports.NoticeResolver = NoticeResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, graphql_1.Mutation)(() => notice_1.Notice),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof notice_input_1.NoticeInput !== "undefined" && notice_input_1.NoticeInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], NoticeResolver.prototype, "createNotice", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => notice_1.Notices),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof notice_inquiry_1.AllNoticesInquiry !== "undefined" && notice_inquiry_1.AllNoticesInquiry) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], NoticeResolver.prototype, "getAllNotices", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => notice_1.Notice),
    __param(0, (0, graphql_1.Args)('noticeId', { type: () => graphql_2.GraphQLString })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], NoticeResolver.prototype, "getNotice", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, graphql_1.Mutation)(() => notice_1.Notice),
    __param(0, (0, graphql_1.Args)('noticeId', { type: () => graphql_2.GraphQLString })),
    __param(1, (0, graphql_1.Args)('input')),
    __param(2, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof notice_input_1.NoticeUpdate !== "undefined" && notice_input_1.NoticeUpdate) === "function" ? _h : Object, typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], NoticeResolver.prototype, "updateNotice", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, graphql_1.Mutation)(() => notice_1.Notice),
    __param(0, (0, graphql_1.Args)('noticeId', { type: () => graphql_2.GraphQLString })),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_l = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], NoticeResolver.prototype, "removeNotice", null);
exports.NoticeResolver = NoticeResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notice_service_1.NoticeService !== "undefined" && notice_service_1.NoticeService) === "function" ? _a : Object])
], NoticeResolver);


/***/ }),
/* 98 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeService = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
const notice_enum_1 = __webpack_require__(99);
const common_enum_1 = __webpack_require__(17);
let NoticeService = class NoticeService {
    noticeModel;
    constructor(noticeModel) {
        this.noticeModel = noticeModel;
    }
    async createNotice(memberId, input) {
        try {
            const result = await this.noticeModel.create({
                ...input,
                memberId,
            });
            return result;
        }
        catch (err) {
            console.log('Error, Service.createNotice:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async getAllNotices(input) {
        const { page = 1, limit = 10, noticeCategory, noticeStatus, search } = input;
        const match = {};
        if (noticeCategory)
            match.noticeCategory = noticeCategory;
        if (noticeStatus)
            match.noticeStatus = noticeStatus;
        if (search) {
            match.$or = [
                { noticeTitle: { $regex: search, $options: 'i' } },
                { noticeContent: { $regex: search, $options: 'i' } },
            ];
        }
        try {
            const result = await this.noticeModel
                .aggregate([
                { $match: match },
                { $sort: { createdAt: -1 } },
                {
                    $facet: {
                        list: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $lookup: {
                                    from: 'members',
                                    localField: 'memberId',
                                    foreignField: '_id',
                                    as: 'memberData',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$memberData',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                        ],
                        metaCounter: [
                            {
                                $group: {
                                    _id: '$noticeCategory',
                                    count: { $sum: 1 },
                                },
                            },
                        ],
                    },
                },
            ])
                .exec();
            return result[0];
        }
        catch (err) {
            console.log('Error, Service.getAllNotices:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        }
    }
    async getNotice(noticeId) {
        try {
            const result = await this.noticeModel
                .findOne({
                _id: noticeId,
                noticeStatus: notice_enum_1.NoticeStatus.ACTIVE,
            })
                .exec();
            if (!result)
                throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
            return result;
        }
        catch (err) {
            console.log('Error, Service.getNotice:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        }
    }
    async updateNotice(memberId, noticeId, input) {
        try {
            const result = await this.noticeModel
                .findOneAndUpdate({
                _id: noticeId,
                memberId: memberId,
                noticeStatus: { $ne: notice_enum_1.NoticeStatus.DELETE },
            }, input, { new: true })
                .exec();
            if (!result)
                throw new common_1.BadRequestException(common_enum_1.Message.UPDATE_FAILED);
            return result;
        }
        catch (err) {
            console.log('Error, Service.updateNotice:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.UPDATE_FAILED);
        }
    }
    async removeNotice(memberId, noticeId) {
        try {
            const result = await this.noticeModel
                .findOneAndUpdate({
                _id: noticeId,
                memberId: memberId,
                noticeStatus: { $ne: notice_enum_1.NoticeStatus.DELETE },
            }, { noticeStatus: notice_enum_1.NoticeStatus.DELETE }, { new: true })
                .exec();
            if (!result)
                throw new common_1.BadRequestException(common_enum_1.Message.REMOVE_FAILED);
            return result;
        }
        catch (err) {
            console.log('Error, Service.removeNotice:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.REMOVE_FAILED);
        }
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notice')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], NoticeService);


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeStatus = exports.NoticeCategory = void 0;
const graphql_1 = __webpack_require__(7);
var NoticeCategory;
(function (NoticeCategory) {
    NoticeCategory["FAQ"] = "FAQ";
    NoticeCategory["TERMS"] = "TERMS";
    NoticeCategory["NOTICE"] = "NOTICE";
})(NoticeCategory || (exports.NoticeCategory = NoticeCategory = {}));
(0, graphql_1.registerEnumType)(NoticeCategory, {
    name: 'NoticeCategory',
});
var NoticeStatus;
(function (NoticeStatus) {
    NoticeStatus["HOLD"] = "HOLD";
    NoticeStatus["ACTIVE"] = "ACTIVE";
    NoticeStatus["DELETE"] = "DELETE";
})(NoticeStatus || (exports.NoticeStatus = NoticeStatus = {}));
(0, graphql_1.registerEnumType)(NoticeStatus, {
    name: 'NoticeStatus',
});


/***/ }),
/* 100 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticesMeta = exports.Notices = exports.Notice = void 0;
const graphql_1 = __webpack_require__(7);
const mongoose_1 = __webpack_require__(15);
const notice_enum_1 = __webpack_require__(99);
let Notice = class Notice {
    _id;
    noticeCategory;
    noticeStatus;
    noticeTitle;
    noticeContent;
    memberId;
    createdAt;
    updatedAt;
};
exports.Notice = Notice;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Notice.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => notice_enum_1.NoticeCategory),
    __metadata("design:type", typeof (_b = typeof notice_enum_1.NoticeCategory !== "undefined" && notice_enum_1.NoticeCategory) === "function" ? _b : Object)
], Notice.prototype, "noticeCategory", void 0);
__decorate([
    (0, graphql_1.Field)(() => notice_enum_1.NoticeStatus),
    __metadata("design:type", typeof (_c = typeof notice_enum_1.NoticeStatus !== "undefined" && notice_enum_1.NoticeStatus) === "function" ? _c : Object)
], Notice.prototype, "noticeStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Notice.prototype, "noticeTitle", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Notice.prototype, "noticeContent", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], Notice.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Notice.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Notice.prototype, "updatedAt", void 0);
exports.Notice = Notice = __decorate([
    (0, graphql_1.ObjectType)()
], Notice);
let Notices = class Notices {
    list;
    metaCounter;
};
exports.Notices = Notices;
__decorate([
    (0, graphql_1.Field)(() => [Notice]),
    __metadata("design:type", Array)
], Notices.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [NoticesMeta], { nullable: true }),
    __metadata("design:type", Array)
], Notices.prototype, "metaCounter", void 0);
exports.Notices = Notices = __decorate([
    (0, graphql_1.ObjectType)()
], Notices);
let NoticesMeta = class NoticesMeta {
    _id;
    count;
};
exports.NoticesMeta = NoticesMeta;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], NoticesMeta.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], NoticesMeta.prototype, "count", void 0);
exports.NoticesMeta = NoticesMeta = __decorate([
    (0, graphql_1.ObjectType)()
], NoticesMeta);


/***/ }),
/* 101 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeUpdate = exports.NoticeInput = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const notice_enum_1 = __webpack_require__(99);
let NoticeInput = class NoticeInput {
    noticeCategory;
    noticeTitle;
    noticeContent;
    noticeStatus;
};
exports.NoticeInput = NoticeInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(notice_enum_1.NoticeCategory),
    (0, graphql_1.Field)(() => notice_enum_1.NoticeCategory),
    __metadata("design:type", typeof (_a = typeof notice_enum_1.NoticeCategory !== "undefined" && notice_enum_1.NoticeCategory) === "function" ? _a : Object)
], NoticeInput.prototype, "noticeCategory", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], NoticeInput.prototype, "noticeTitle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], NoticeInput.prototype, "noticeContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notice_enum_1.NoticeStatus),
    (0, graphql_1.Field)(() => notice_enum_1.NoticeStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof notice_enum_1.NoticeStatus !== "undefined" && notice_enum_1.NoticeStatus) === "function" ? _b : Object)
], NoticeInput.prototype, "noticeStatus", void 0);
exports.NoticeInput = NoticeInput = __decorate([
    (0, graphql_1.InputType)()
], NoticeInput);
let NoticeUpdate = class NoticeUpdate {
    noticeTitle;
    noticeContent;
    noticeStatus;
    noticeCategory;
};
exports.NoticeUpdate = NoticeUpdate;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], NoticeUpdate.prototype, "noticeTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], NoticeUpdate.prototype, "noticeContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notice_enum_1.NoticeStatus),
    (0, graphql_1.Field)(() => notice_enum_1.NoticeStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof notice_enum_1.NoticeStatus !== "undefined" && notice_enum_1.NoticeStatus) === "function" ? _c : Object)
], NoticeUpdate.prototype, "noticeStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notice_enum_1.NoticeCategory),
    (0, graphql_1.Field)(() => notice_enum_1.NoticeCategory, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof notice_enum_1.NoticeCategory !== "undefined" && notice_enum_1.NoticeCategory) === "function" ? _d : Object)
], NoticeUpdate.prototype, "noticeCategory", void 0);
exports.NoticeUpdate = NoticeUpdate = __decorate([
    (0, graphql_1.InputType)()
], NoticeUpdate);


/***/ }),
/* 102 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AllNoticesInquiry = void 0;
const graphql_1 = __webpack_require__(7);
const class_validator_1 = __webpack_require__(36);
const notice_enum_1 = __webpack_require__(99);
let AllNoticesInquiry = class AllNoticesInquiry {
    page = 1;
    limit = 10;
    noticeCategory;
    noticeStatus;
    search;
};
exports.AllNoticesInquiry = AllNoticesInquiry;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], AllNoticesInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], AllNoticesInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notice_enum_1.NoticeCategory),
    (0, graphql_1.Field)(() => notice_enum_1.NoticeCategory, { nullable: true }),
    __metadata("design:type", typeof (_a = typeof notice_enum_1.NoticeCategory !== "undefined" && notice_enum_1.NoticeCategory) === "function" ? _a : Object)
], AllNoticesInquiry.prototype, "noticeCategory", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(notice_enum_1.NoticeStatus),
    (0, graphql_1.Field)(() => notice_enum_1.NoticeStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof notice_enum_1.NoticeStatus !== "undefined" && notice_enum_1.NoticeStatus) === "function" ? _b : Object)
], AllNoticesInquiry.prototype, "noticeStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AllNoticesInquiry.prototype, "search", void 0);
exports.AllNoticesInquiry = AllNoticesInquiry = __decorate([
    (0, graphql_1.InputType)()
], AllNoticesInquiry);


/***/ }),
/* 103 */
/***/ ((module) => {

module.exports = require("graphql");

/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(15);
const notice_enum_1 = __webpack_require__(99);
const NoticeSchema = new mongoose_1.Schema({
    noticeCategory: {
        type: String,
        enum: notice_enum_1.NoticeCategory,
        required: true,
    },
    noticeStatus: {
        type: String,
        enum: notice_enum_1.NoticeStatus,
        default: notice_enum_1.NoticeStatus.ACTIVE,
    },
    noticeTitle: {
        type: String,
        required: true,
    },
    noticeContent: {
        type: String,
        required: true,
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
}, { timestamps: true, collection: 'notices' });
exports["default"] = NoticeSchema;


/***/ }),
/* 105 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(3);
const mongoose_1 = __webpack_require__(14);
const mongoose_2 = __webpack_require__(15);
let DatabaseModule = class DatabaseModule {
    connection;
    constructor(connection) {
        this.connection = connection;
        if (connection.readyState === 1) {
            console.log(`MongoDB is connected into ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} db`);
        }
        else {
            console.log('DB is not connected!');
        }
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => ({
                    uri: process.env.NODE_ENV === "production" ? process.env.MONGO_PROD : process.env.MONGO_DEV,
                }),
            }),
        ],
        exports: [mongoose_1.MongooseModule],
    }),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Connection !== "undefined" && mongoose_2.Connection) === "function" ? _a : Object])
], DatabaseModule);


/***/ }),
/* 106 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(3);
const graphql_1 = __webpack_require__(7);
const operators_1 = __webpack_require__(107);
let LoggingInterceptor = class LoggingInterceptor {
    logger = new common_1.Logger();
    intercept(context, next) {
        const recordTime = Date.now();
        const requestType = context.getType();
        if (requestType === 'http') {
            return next.handle();
        }
        else if (requestType === 'graphql') {
            const gqlContext = graphql_1.GqlExecutionContext.create(context);
            this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');
            return next.handle().pipe((0, operators_1.tap)((context) => {
                const responseTime = Date.now() - recordTime;
                this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE');
            }));
        }
        return next.handle();
    }
    stringify(context) {
        return JSON.stringify(context).slice(0, 75);
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),
/* 107 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 108 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 109 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-ws");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const Logging_interceptor_1 = __webpack_require__(106);
const graphql_upload_1 = __webpack_require__(46);
const express = __webpack_require__(108);
const platform_ws_1 = __webpack_require__(109);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new Logging_interceptor_1.LoggingInterceptor());
    app.enableCors({ origin: true, credentials: true });
    app.use((0, graphql_upload_1.graphqlUploadExpress)({ maxFileSize: 15000000, maxFiles: 10 }));
    app.use('/uploads', express.static('./uploads'));
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();

})();

/******/ })()
;