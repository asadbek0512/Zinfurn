/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/zinfurn-api/src/app.controller.ts":
/*!************************************************!*\
  !*** ./apps/zinfurn-api/src/app.controller.ts ***!
  \************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/zinfurn-api/src/app.service.ts");
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

/***/ "./apps/zinfurn-api/src/app.module.ts":
/*!********************************************!*\
  !*** ./apps/zinfurn-api/src/app.module.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./apps/zinfurn-api/src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./apps/zinfurn-api/src/app.service.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const apollo_1 = __webpack_require__(/*! @nestjs/apollo */ "@nestjs/apollo");
const app_resolver_1 = __webpack_require__(/*! ./app.resolver */ "./apps/zinfurn-api/src/app.resolver.ts");
const components_module_1 = __webpack_require__(/*! ./components/components.module */ "./apps/zinfurn-api/src/components/components.module.ts");
const database_module_1 = __webpack_require__(/*! ./database/database.module */ "./apps/zinfurn-api/src/database/database.module.ts");
const socket_module_1 = __webpack_require__(/*! ./socket/socket.module */ "./apps/zinfurn-api/src/socket/socket.module.ts");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const gql_throttler_guard_1 = __webpack_require__(/*! ./components/auth/guards/gql-throttler.guard */ "./apps/zinfurn-api/src/components/auth/guards/gql-throttler.guard.ts");
const depthLimit = __webpack_require__(/*! graphql-depth-limit */ "graphql-depth-limit");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 300 }]),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                playground: process.env.NODE_ENV !== 'production',
                introspection: process.env.NODE_ENV !== 'production',
                uploads: false,
                autoSchemaFile: true,
                validationRules: [depthLimit(8)],
                context: ({ req, res }) => ({ req, res }),
                formatError: (error) => {
                    const graphQLFormattedError = {
                        code: error?.extensions.code,
                        message: error?.extensions?.exception?.response?.message || error?.extensions?.response?.message || error?.message,
                    };
                    common_1.Logger.error("GRAPHQL GLOBAL ERR:", graphQLFormattedError);
                    return graphQLFormattedError;
                },
            }),
            components_module_1.ComponentsModule,
            database_module_1.DatabaseModule, socket_module_1.SocketModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, app_resolver_1.AppResolver, { provide: core_1.APP_GUARD, useClass: gql_throttler_guard_1.GqlThrottlerGuard }],
    })
], AppModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/app.resolver.ts":
/*!**********************************************!*\
  !*** ./apps/zinfurn-api/src/app.resolver.ts ***!
  \**********************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/app.service.ts":
/*!*********************************************!*\
  !*** ./apps/zinfurn-api/src/app.service.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Welcome to Zinfurn API Server!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/auth.controller.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/auth.controller.ts ***!
  \*****************************************************************/
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
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
const telegram_strategy_1 = __webpack_require__(/*! ./telegram.strategy */ "./apps/zinfurn-api/src/components/auth/telegram.strategy.ts");
let AuthController = class AuthController {
    authService;
    telegramStrategy;
    constructor(authService, telegramStrategy) {
        this.authService = authService;
        this.telegramStrategy = telegramStrategy;
    }
    getFrontendUrl() {
        const urls = (process.env.FRONTEND_URL || 'http://localhost:3000')
            .split(',')
            .map((u) => u.trim())
            .filter(Boolean);
        if (process.env.NODE_ENV === 'production') {
            return urls.find((u) => u.startsWith('https://')) || urls[0];
        }
        return urls.find((u) => u.includes('localhost')) || urls[0];
    }
    setAuthCookie(res, token) {
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });
    }
    async logout(res) {
        res.cookie('accessToken', '', { httpOnly: true, maxAge: 0 });
        return res.json({ success: true });
    }
    async googleAuth() { }
    async googleAuthCallback(req, res) {
        try {
            const user = req.user;
            const cookies = Object.fromEntries((req.headers.cookie || '').split(';').map(c => {
                const [k, v] = c.trim().split('=');
                return [k, decodeURIComponent(v)];
            }).filter(([k]) => k));
            const memberId = cookies.linkMemberId || req.query?.state || user?.memberId;
            const frontendUrl = this.getFrontendUrl();
            if (memberId) {
                const result = await this.authService.linkGoogle(memberId, user);
                res.cookie('linkMemberId', '', { maxAge: 0 });
                this.setAuthCookie(res, result.token);
                return res.redirect(`${frontendUrl}/mypage?token=${result.token}&refresh=${result.refresh}`);
            }
            else {
                const result = await this.authService.googleLogin(user);
                this.setAuthCookie(res, result.token);
                return res.redirect(`${frontendUrl}/?token=${result.token}&refresh=${result.refresh}`);
            }
        }
        catch (err) {
            common_1.Logger.error('Google callback error:', err);
            const frontendUrl = this.getFrontendUrl();
            return res.redirect(`${frontendUrl}/?error=${encodeURIComponent(err.message)}`);
        }
    }
    async telegramAuth(telegramData, res) {
        const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid Telegram auth data' });
        }
        const result = await this.authService.telegramLogin(telegramData);
        this.setAuthCookie(res, result.token);
        return res.json({ token: result.token, refresh: result.refresh });
    }
    async linkTelegram(body, res) {
        const { memberId, ...telegramData } = body;
        const isValid = this.telegramStrategy.verifyTelegramAuth(telegramData);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid Telegram auth data' });
        }
        const result = await this.authService.linkTelegram(memberId, telegramData);
        this.setAuthCookie(res, result.token);
        return res.json({ token: result.token, refresh: result.refresh });
    }
    async linkGoogle(req, res) {
        const memberId = req.query.state;
        res.cookie('linkMemberId', memberId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 5 * 60 * 1000,
        });
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=email%20profile&state=${memberId}`;
        res.redirect(googleAuthUrl);
    }
    async linkGoogleCallback(req, res) {
        try {
            const frontendUrl = this.getFrontendUrl();
            const memberId = req.user?.memberId;
            if (!memberId) {
                return res.redirect(`${frontendUrl}/mypage?error=No memberId found`);
            }
            const result = await this.authService.linkGoogle(memberId, req.user);
            res.redirect(`${frontendUrl}/mypage?token=${result.token}&refresh=${result.refresh}`);
        }
        catch (err) {
            res.redirect(`${this.getFrontendUrl()}/mypage?error=${encodeURIComponent(err.message)}`);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthCallback", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('telegram'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "telegramAuth", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('link/telegram'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkTelegram", null);
__decorate([
    (0, common_1.Get)('link/google'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkGoogle", null);
__decorate([
    (0, common_1.Get)('link/google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkGoogleCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof telegram_strategy_1.TelegramStrategy !== "undefined" && telegram_strategy_1.TelegramStrategy) === "function" ? _b : Object])
], AuthController);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/auth.module.ts":
/*!*************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/auth.module.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
const axios_1 = __webpack_require__(/*! @nestjs/axios */ "@nestjs/axios");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const google_strategy_1 = __webpack_require__(/*! ./google.strategy */ "./apps/zinfurn-api/src/components/auth/google.strategy.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./apps/zinfurn-api/src/components/auth/auth.controller.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const telegram_strategy_1 = __webpack_require__(/*! ./telegram.strategy */ "./apps/zinfurn-api/src/components/auth/telegram.strategy.ts");
const Member_model_1 = __webpack_require__(/*! ../../schemas/Member.model */ "./apps/zinfurn-api/src/schemas/Member.model.ts");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            passport_1.PassportModule,
            mongoose_1.MongooseModule.forFeature([{ name: 'Member', schema: Member_model_1.default }]),
            jwt_1.JwtModule.register({
                secret: `${process.env.SECRET_TOKEN}`,
                signOptions: { expiresIn: '30d' },
            }),
        ],
        providers: [auth_service_1.AuthService, google_strategy_1.GoogleStrategy, telegram_strategy_1.TelegramStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/auth.service.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/auth.service.ts ***!
  \**************************************************************/
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
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const jwt_1 = __webpack_require__(/*! @nestjs/jwt */ "@nestjs/jwt");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __webpack_require__(/*! bcryptjs */ "bcryptjs");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
let AuthService = class AuthService {
    jwtService;
    memberModel;
    constructor(jwtService, memberModel) {
        this.jwtService = jwtService;
        this.memberModel = memberModel;
    }
    async hashPassword(memberPassword) {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(memberPassword, salt);
    }
    async comparePasswords(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    async createToken(member) {
        const doc = member['_doc'] ? member['_doc'] : member;
        const payload = {
            _id: doc._id,
            memberType: doc.memberType,
            memberStatus: doc.memberStatus,
            memberAuthType: doc.memberAuthType,
            memberNick: doc.memberNick,
            memberFullName: doc.memberFullName,
            memberImage: doc.memberImage,
            memberRank: doc.memberRank,
            memberPoints: doc.memberPoints,
            memberProperties: doc.memberProperties,
            memberArticles: doc.memberArticles,
            memberFollowers: doc.memberFollowers,
            memberFollowings: doc.memberFollowings,
            memberLikes: doc.memberLikes,
            memberViews: doc.memberViews,
            memberWarnings: doc.memberWarnings,
            memberBlocks: doc.memberBlocks,
        };
        payload.tokenType = 'access';
        return await this.jwtService.signAsync(payload, { expiresIn: process.env.ACCESS_TOKEN_TTL || '1h' });
    }
    async createRefreshToken(member) {
        const doc = member['_doc'] ? member['_doc'] : member;
        return await this.jwtService.signAsync({ _id: doc._id, tokenType: 'refresh' }, { expiresIn: process.env.REFRESH_TOKEN_TTL || '30d' });
    }
    async createTokenPair(member) {
        const token = await this.createToken(member);
        const refresh = await this.createRefreshToken(member);
        return { token, refresh };
    }
    async verifyToken(token) {
        const member = await this.jwtService.verifyAsync(token);
        if (member?.tokenType === 'refresh')
            throw new Error('Refresh token cannot be used for authentication');
        member._id = (0, config_1.ShapeIntoMongoObjectId)(member._id);
        return member;
    }
    async refreshTokens(refreshToken) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(refreshToken);
        }
        catch {
            throw new Error('Invalid or expired refresh token');
        }
        if (payload?.tokenType !== 'refresh')
            throw new Error('Invalid refresh token');
        const member = await this.memberModel.findById((0, config_1.ShapeIntoMongoObjectId)(payload._id)).exec();
        if (!member || member.memberStatus !== member_enum_1.MemberStatus.ACTIVE)
            throw new Error('Member is not active');
        const pair = await this.createTokenPair(member);
        return { member, ...pair };
    }
    async googleLogin(googleUser) {
        const { email, firstName, lastName, picture, sub } = googleUser;
        let member = await this.memberModel.findOne({ memberGoogleId: sub }).exec();
        if (member) {
            return await this.createTokenPair(member);
        }
        member = await this.memberModel.findOne({ memberEmail: email }).exec();
        if (member) {
            if (!member.memberGoogleId) {
                member = await this.memberModel
                    .findOneAndUpdate({ _id: member._id }, { memberGoogleId: sub }, { new: true })
                    .exec();
            }
            return await this.createTokenPair(member);
        }
        member = await this.memberModel.create({
            memberNick: email.split('@')[0] + '_' + Date.now(),
            memberEmail: email,
            memberFullName: `${firstName} ${lastName}`,
            memberImage: picture,
            memberAuthType: member_enum_1.MemberAuthType.GOOGLE,
            memberStatus: member_enum_1.MemberStatus.ACTIVE,
            memberType: member_enum_1.MemberType.USER,
            memberGoogleId: sub,
        });
        return await this.createTokenPair(member);
    }
    async telegramLogin(telegramUser) {
        const { id, first_name, last_name, username, photo_url } = telegramUser;
        let member = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();
        if (!member) {
            member = await this.memberModel.create({
                memberNick: username || `tg_${id}_${Date.now()}`,
                memberFullName: `${first_name} ${last_name || ''}`.trim(),
                memberImage: photo_url || '',
                memberAuthType: member_enum_1.MemberAuthType.TELEGRAM,
                memberStatus: member_enum_1.MemberStatus.ACTIVE,
                memberType: member_enum_1.MemberType.USER,
                memberTelegramId: String(id),
            });
        }
        return await this.createTokenPair(member);
    }
    async linkTelegram(memberId, telegramUser) {
        const { id } = telegramUser;
        const existing = await this.memberModel.findOne({ memberTelegramId: String(id) }).exec();
        if (existing)
            throw new Error('This Telegram account is already linked to another account!');
        const member = await this.memberModel
            .findOneAndUpdate({ _id: memberId }, { memberTelegramId: String(id) }, { new: true })
            .exec();
        return await this.createTokenPair(member);
    }
    async linkGoogle(memberId, googleUser) {
        const { email, sub } = googleUser;
        const existingGoogle = await this.memberModel.findOne({ memberGoogleId: sub }).exec();
        if (existingGoogle) {
            if (existingGoogle._id.toString() === memberId) {
                return await this.createTokenPair(existingGoogle);
            }
            throw new Error('This Google account is already linked to another account!');
        }
        const member = await this.memberModel.findOne({ _id: memberId }).exec();
        if (!member)
            throw new Error('Member not found!');
        const updateData = { memberGoogleId: sub };
        if (!member.memberEmail) {
            updateData.memberEmail = email;
        }
        const updatedMember = await this.memberModel.findOneAndUpdate({ _id: memberId }, updateData, { new: true }).exec();
        if (!updatedMember)
            throw new Error('Failed to update member!');
        return await this.createTokenPair(updatedMember);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Member')),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], AuthService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts":
/*!*********************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthMember = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
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

/***/ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts":
/*!****************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles);
exports.Roles = Roles;


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/google.strategy.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/google.strategy.ts ***!
  \*****************************************************************/
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
exports.GoogleStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const passport_google_oauth20_1 = __webpack_require__(/*! passport-google-oauth20 */ "passport-google-oauth20");
let GoogleStrategy = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }
    async validate(req, accessToken, refreshToken, profile, done) {
        const { name, emails, photos, id } = profile;
        const memberId = req.query?.state;
        const user = {
            sub: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
            memberId,
        };
        done(null, user);
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleStrategy);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts ***!
  \*******************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
const common_enum_1 = __webpack_require__(/*! apps/zinfurn-api/src/libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
function parseCookieToken(cookieHeader) {
    if (!cookieHeader)
        return null;
    for (const part of cookieHeader.split(';')) {
        const [key, ...rest] = part.trim().split('=');
        if (key?.trim() === 'accessToken')
            return decodeURIComponent(rest.join('='));
    }
    return null;
}
let AuthGuard = class AuthGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        common_1.Logger.log('--- @guard() Authentication [AuthGuard] ---');
        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const cookieToken = parseCookieToken(request.headers.cookie);
            const bearerToken = request.headers.authorization;
            const rawToken = cookieToken || (bearerToken ? bearerToken.split(' ')[1] : null);
            if (!rawToken)
                throw new common_1.BadRequestException(common_enum_1.Message.TOKEN_NOT_EXIST);
            const authMember = await this.authService.verifyToken(rawToken);
            if (!authMember)
                throw new common_1.UnauthorizedException(common_enum_1.Message.NOT_AUTHENTICATED);
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

/***/ "./apps/zinfurn-api/src/components/auth/guards/gql-throttler.guard.ts":
/*!****************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/guards/gql-throttler.guard.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GqlThrottlerGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
let GqlThrottlerGuard = class GqlThrottlerGuard extends throttler_1.ThrottlerGuard {
    getRequestResponse(context) {
        if (context.getType() === 'graphql') {
            const gqlCtx = graphql_1.GqlExecutionContext.create(context).getContext();
            return { req: gqlCtx.req, res: gqlCtx.res ?? gqlCtx.req?.res };
        }
        const http = context.switchToHttp();
        return { req: http.getRequest(), res: http.getResponse() };
    }
    async canActivate(context) {
        if (context.getType() === 'ws')
            return true;
        const { req, res } = this.getRequestResponse(context);
        if (!req || !res)
            return true;
        return super.canActivate(context);
    }
};
exports.GqlThrottlerGuard = GqlThrottlerGuard;
exports.GqlThrottlerGuard = GqlThrottlerGuard = __decorate([
    (0, common_1.Injectable)()
], GqlThrottlerGuard);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts":
/*!********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts ***!
  \********************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
const common_enum_1 = __webpack_require__(/*! apps/zinfurn-api/src/libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
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
        common_1.Logger.log(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);
        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const bearerToken = request.headers.authorization;
            if (!bearerToken)
                throw new common_1.BadRequestException(common_enum_1.Message.TOKEN_NOT_EXIST);
            const token = bearerToken.split(' ')[1], authMember = await this.authService.verifyToken(token), hasRole = () => roles.indexOf(authMember.memberType) > -1, hasPermission = hasRole();
            if (!authMember || !hasPermission)
                throw new common_1.ForbiddenException(common_enum_1.Message.ONLY_SPECIFIC_ROLES_ALLOWED);
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

/***/ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts":
/*!**********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/guards/without.guard.ts ***!
  \**********************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
function parseCookieToken(cookieHeader) {
    if (!cookieHeader)
        return null;
    for (const part of cookieHeader.split(';')) {
        const [key, ...rest] = part.trim().split('=');
        if (key?.trim() === 'accessToken')
            return decodeURIComponent(rest.join('='));
    }
    return null;
}
let WithoutGuard = class WithoutGuard {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        common_1.Logger.log('--- @guard() Authentication [WithoutGuard] ---');
        if (context.contextType === 'graphql') {
            const request = context.getArgByIndex(2).req;
            const cookieToken = parseCookieToken(request.headers.cookie);
            const bearerToken = request.headers.authorization;
            const rawToken = cookieToken || (bearerToken ? bearerToken.split(' ')[1] : null);
            if (rawToken) {
                try {
                    const authMember = await this.authService.verifyToken(rawToken);
                    request.body.authMember = authMember;
                }
                catch (err) {
                    request.body.authMember = null;
                }
            }
            else
                request.body.authMember = null;
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

/***/ "./apps/zinfurn-api/src/components/auth/telegram.strategy.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/auth/telegram.strategy.ts ***!
  \*******************************************************************/
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
exports.TelegramStrategy = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const crypto = __webpack_require__(/*! crypto */ "crypto");
let TelegramStrategy = class TelegramStrategy {
    memberModel;
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    verifyTelegramAuth(data) {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const secretKey = crypto.createHash('sha256').update(botToken).digest();
        const { hash, ...userData } = data;
        const checkString = Object.keys(userData)
            .sort()
            .map((key) => `${key}=${userData[key]}`)
            .join('\n');
        const hmac = crypto
            .createHmac('sha256', secretKey)
            .update(checkString)
            .digest('hex');
        return hmac === hash;
    }
    async telegramLogin(telegramUser) {
        const { id, first_name, last_name, username, photo_url } = telegramUser;
        let member = await this.memberModel
            .findOne({ memberTelegramId: String(id) })
            .exec();
        if (!member) {
            member = await this.memberModel.create({
                memberNick: username || `tg_${id}`,
                memberFullName: `${first_name} ${last_name || ''}`.trim(),
                memberImage: photo_url || '',
                memberAuthType: member_enum_1.MemberAuthType.TELEGRAM,
                memberStatus: member_enum_1.MemberStatus.ACTIVE,
                memberType: member_enum_1.MemberType.USER,
                memberTelegramId: String(id),
            });
        }
        return member;
    }
};
exports.TelegramStrategy = TelegramStrategy;
exports.TelegramStrategy = TelegramStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Member')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TelegramStrategy);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/board-article/board-article.module.ts":
/*!*******************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/board-article/board-article.module.ts ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const board_article_resolver_1 = __webpack_require__(/*! ./board-article.resolver */ "./apps/zinfurn-api/src/components/board-article/board-article.resolver.ts");
const board_article_service_1 = __webpack_require__(/*! ./board-article.service */ "./apps/zinfurn-api/src/components/board-article/board-article.service.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const BoardArticle_model_1 = __webpack_require__(/*! ../../schemas/BoardArticle.model */ "./apps/zinfurn-api/src/schemas/BoardArticle.model.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const member_module_1 = __webpack_require__(/*! ../member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
const view_module_1 = __webpack_require__(/*! ../view/view.module */ "./apps/zinfurn-api/src/components/view/view.module.ts");
const like_module_1 = __webpack_require__(/*! ../like/like.module */ "./apps/zinfurn-api/src/components/like/like.module.ts");
const translation_module_1 = __webpack_require__(/*! ../translation/translation.module */ "./apps/zinfurn-api/src/components/translation/translation.module.ts");
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
            translation_module_1.TranslationModule,
        ],
        providers: [board_article_resolver_1.BoardArticleResolver, board_article_service_1.BoardArticleService],
        exports: [board_article_service_1.BoardArticleService]
    })
], BoardArticleModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/board-article/board-article.resolver.ts":
/*!*********************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/board-article/board-article.resolver.ts ***!
  \*********************************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const board_article_1 = __webpack_require__(/*! ../../libs/dto/board-article/board-article */ "./apps/zinfurn-api/src/libs/dto/board-article/board-article.ts");
const board_article_input_1 = __webpack_require__(/*! ../../libs/dto/board-article/board-article.input */ "./apps/zinfurn-api/src/libs/dto/board-article/board-article.input.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const board_article_service_1 = __webpack_require__(/*! ./board-article.service */ "./apps/zinfurn-api/src/components/board-article/board-article.service.ts");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const board_article_update_1 = __webpack_require__(/*! ../../libs/dto/board-article/board-article.update */ "./apps/zinfurn-api/src/libs/dto/board-article/board-article.update.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
let BoardArticleResolver = class BoardArticleResolver {
    boardArticleService;
    constructor(boardArticleService) {
        this.boardArticleService = boardArticleService;
    }
    async createBoardArticle(input, memberId) {
        return await this.boardArticleService.createBoardArticle(memberId, input);
    }
    async getBoardArticle(input, memberId) {
        const articleId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.boardArticleService.getBoardArticle(memberId, articleId);
    }
    async updateBoardArticle(input, memberId) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.boardArticleService.updateBoardArticle(memberId, input);
    }
    async getBoardArticles(input, memberId) {
        return await this.boardArticleService.getBoardArticles(memberId, input);
    }
    async likeTargetBoardArticle(input, memberId) {
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.boardArticleService.likeTargetBoardArticle(memberId, likeRefId);
    }
    async getAllBoardArticlesByAdmin(input, memberId) {
        return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
    }
    async updateBoardArticleByAdmin(input, memberId) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.boardArticleService.updateBoardArticleByAdmin(input);
    }
    async removeBoardArticleByAdmin(input, memberId) {
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

/***/ "./apps/zinfurn-api/src/components/board-article/board-article.service.ts":
/*!********************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/board-article/board-article.service.ts ***!
  \********************************************************************************/
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
exports.BoardArticleService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const member_service_1 = __webpack_require__(/*! ../member/member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const view_service_1 = __webpack_require__(/*! ../view/view.service */ "./apps/zinfurn-api/src/components/view/view.service.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const board_article_enum_1 = __webpack_require__(/*! ../../libs/enums/board-article.enum */ "./apps/zinfurn-api/src/libs/enums/board-article.enum.ts");
const view_enum_1 = __webpack_require__(/*! ../../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const like_service_1 = __webpack_require__(/*! ../like/like.service */ "./apps/zinfurn-api/src/components/like/like.service.ts");
const like_enum_1 = __webpack_require__(/*! ../../libs/enums/like.enum */ "./apps/zinfurn-api/src/libs/enums/like.enum.ts");
const translation_service_1 = __webpack_require__(/*! ../translation/translation.service */ "./apps/zinfurn-api/src/components/translation/translation.service.ts");
let BoardArticleService = class BoardArticleService {
    boardArticleModel;
    memberService;
    viewService;
    likeService;
    translationService;
    constructor(boardArticleModel, memberService, viewService, likeService, translationService) {
        this.boardArticleModel = boardArticleModel;
        this.memberService = memberService;
        this.viewService = viewService;
        this.likeService = likeService;
        this.translationService = translationService;
    }
    async createBoardArticle(memberId, input) {
        input.memberId = memberId;
        try {
            try {
                const translations = await this.translationService.translateArticle(input.articleTitle, input.articleContent);
                if (translations)
                    input.articleTranslations = translations;
            }
            catch (e) {
                common_1.Logger.warn('Tarjima o\'tkazib yuborildi (article create)');
            }
            const result = await this.boardArticleModel.create(input);
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberArticles',
                modifier: 1,
            });
            return result;
        }
        catch (err) {
            common_1.Logger.error("Error, Service.model:", err.message);
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
        if (input.articleTitle !== undefined || input.articleContent !== undefined) {
            try {
                const existing = await this.boardArticleModel
                    .findOne({ _id: _id, memberId: memberId, articleStatus: board_article_enum_1.BoardArticleStatus.ACTIVE }).lean().exec();
                const title = input.articleTitle ?? existing?.articleTitle;
                const content = input.articleContent ?? existing?.articleContent;
                if (title) {
                    const translations = await this.translationService.translateArticle(title, content);
                    if (translations)
                        input.articleTranslations = translations;
                }
            }
            catch (e) {
                common_1.Logger.warn('Tarjima o\'tkazib yuborildi (article update)');
            }
        }
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
            match.articleTitle = (0, config_1.buildSearchRegex)(text);
        if (input.search?.memberId) {
            match.memberId = (0, config_1.ShapeIntoMongoObjectId)(input.search.memberId);
        }
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
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _c : Object, typeof (_d = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _d : Object, typeof (_e = typeof translation_service_1.TranslationService !== "undefined" && translation_service_1.TranslationService) === "function" ? _e : Object])
], BoardArticleService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/comment/comment.module.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/comment/comment.module.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const comment_resolver_1 = __webpack_require__(/*! ./comment.resolver */ "./apps/zinfurn-api/src/components/comment/comment.resolver.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const Comment_model_1 = __webpack_require__(/*! ../../schemas/Comment.model */ "./apps/zinfurn-api/src/schemas/Comment.model.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const member_module_1 = __webpack_require__(/*! ../member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
const property_module_1 = __webpack_require__(/*! ../property/property.module */ "./apps/zinfurn-api/src/components/property/property.module.ts");
const board_article_module_1 = __webpack_require__(/*! ../board-article/board-article.module */ "./apps/zinfurn-api/src/components/board-article/board-article.module.ts");
const comment_service_1 = __webpack_require__(/*! ./comment.service */ "./apps/zinfurn-api/src/components/comment/comment.service.ts");
const Member_model_1 = __webpack_require__(/*! ../../schemas/Member.model */ "./apps/zinfurn-api/src/schemas/Member.model.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./apps/zinfurn-api/src/components/notification/notification.module.ts");
const repair_property_module_1 = __webpack_require__(/*! ../repair-property/repair-property.module */ "./apps/zinfurn-api/src/components/repair-property/repair-property.module.ts");
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

/***/ "./apps/zinfurn-api/src/components/comment/comment.resolver.ts":
/*!*********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/comment/comment.resolver.ts ***!
  \*********************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const comment_1 = __webpack_require__(/*! ../../libs/dto/comment/comment */ "./apps/zinfurn-api/src/libs/dto/comment/comment.ts");
const comment_input_1 = __webpack_require__(/*! ../../libs/dto/comment/comment.input */ "./apps/zinfurn-api/src/libs/dto/comment/comment.input.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const comment_service_1 = __webpack_require__(/*! ./comment.service */ "./apps/zinfurn-api/src/components/comment/comment.service.ts");
const comment_update_1 = __webpack_require__(/*! ../../libs/dto/comment/comment.update */ "./apps/zinfurn-api/src/libs/dto/comment/comment.update.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
let CommentResolver = class CommentResolver {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    async createComment(input, memberId) {
        return await this.commentService.createComment(memberId, input);
    }
    async updateComment(input, memberId) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.commentService.updateComment(memberId, input);
    }
    async getComments(input, memberId) {
        input.search.commentRefId = (0, config_1.ShapeIntoMongoObjectId)(input.search.commentRefId);
        return await this.commentService.getComments(memberId, input);
    }
    async removeCommentByAdmin(input) {
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

/***/ "./apps/zinfurn-api/src/components/comment/comment.service.ts":
/*!********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/comment/comment.service.ts ***!
  \********************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const member_service_1 = __webpack_require__(/*! ../member/member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const property_service_1 = __webpack_require__(/*! ../property/property.service */ "./apps/zinfurn-api/src/components/property/property.service.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const comment_enum_1 = __webpack_require__(/*! ../../libs/enums/comment.enum */ "./apps/zinfurn-api/src/libs/enums/comment.enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./apps/zinfurn-api/src/components/notification/notification.service.ts");
const notification_enum_1 = __webpack_require__(/*! ../../libs/enums/notification.enum */ "./apps/zinfurn-api/src/libs/enums/notification.enum.ts");
const board_article_service_1 = __webpack_require__(/*! ../board-article/board-article.service */ "./apps/zinfurn-api/src/components/board-article/board-article.service.ts");
const repair_property_service_1 = __webpack_require__(/*! ../repair-property/repair-property.service */ "./apps/zinfurn-api/src/components/repair-property/repair-property.service.ts");
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
            common_1.Logger.error('Error, Service.model:', err.message);
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

/***/ "./apps/zinfurn-api/src/components/components.module.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/components.module.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const member_module_1 = __webpack_require__(/*! ./member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
const property_module_1 = __webpack_require__(/*! ./property/property.module */ "./apps/zinfurn-api/src/components/property/property.module.ts");
const auth_module_1 = __webpack_require__(/*! ./auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const board_article_module_1 = __webpack_require__(/*! ./board-article/board-article.module */ "./apps/zinfurn-api/src/components/board-article/board-article.module.ts");
const comment_module_1 = __webpack_require__(/*! ./comment/comment.module */ "./apps/zinfurn-api/src/components/comment/comment.module.ts");
const follow_module_1 = __webpack_require__(/*! ./follow/follow.module */ "./apps/zinfurn-api/src/components/follow/follow.module.ts");
const like_module_1 = __webpack_require__(/*! ./like/like.module */ "./apps/zinfurn-api/src/components/like/like.module.ts");
const view_module_1 = __webpack_require__(/*! ./view/view.module */ "./apps/zinfurn-api/src/components/view/view.module.ts");
const repair_property_module_1 = __webpack_require__(/*! ./repair-property/repair-property.module */ "./apps/zinfurn-api/src/components/repair-property/repair-property.module.ts");
const notification_module_1 = __webpack_require__(/*! ./notification/notification.module */ "./apps/zinfurn-api/src/components/notification/notification.module.ts");
const notice_module_1 = __webpack_require__(/*! ./notice/notice.module */ "./apps/zinfurn-api/src/components/notice/notice.module.ts");
const order_module_1 = __webpack_require__(/*! ./order/order.module */ "./apps/zinfurn-api/src/components/order/order.module.ts");
const review_module_1 = __webpack_require__(/*! ./review/review.module */ "./apps/zinfurn-api/src/components/review/review.module.ts");
const message_module_1 = __webpack_require__(/*! ./message/message.module */ "./apps/zinfurn-api/src/components/message/message.module.ts");
const coupon_module_1 = __webpack_require__(/*! ./coupon/coupon.module */ "./apps/zinfurn-api/src/components/coupon/coupon.module.ts");
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
            order_module_1.OrderModule,
            coupon_module_1.CouponModule,
            review_module_1.ReviewModule,
            message_module_1.MessageModule,
        ],
    })
], ComponentsModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/coupon/coupon.module.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/coupon/coupon.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const Coupon_model_1 = __webpack_require__(/*! ../../schemas/Coupon.model */ "./apps/zinfurn-api/src/schemas/Coupon.model.ts");
const coupon_resolver_1 = __webpack_require__(/*! ./coupon.resolver */ "./apps/zinfurn-api/src/components/coupon/coupon.resolver.ts");
const coupon_service_1 = __webpack_require__(/*! ./coupon.service */ "./apps/zinfurn-api/src/components/coupon/coupon.service.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
let CouponModule = class CouponModule {
};
exports.CouponModule = CouponModule;
exports.CouponModule = CouponModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'Coupon', schema: Coupon_model_1.default }]), auth_module_1.AuthModule],
        providers: [coupon_resolver_1.CouponResolver, coupon_service_1.CouponService],
        exports: [coupon_service_1.CouponService],
    })
], CouponModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/coupon/coupon.resolver.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/coupon/coupon.resolver.ts ***!
  \*******************************************************************/
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
exports.CouponResolver = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const coupon_service_1 = __webpack_require__(/*! ./coupon.service */ "./apps/zinfurn-api/src/components/coupon/coupon.service.ts");
const coupon_1 = __webpack_require__(/*! ../../libs/dto/coupon/coupon */ "./apps/zinfurn-api/src/libs/dto/coupon/coupon.ts");
const coupon_input_1 = __webpack_require__(/*! ../../libs/dto/coupon/coupon.input */ "./apps/zinfurn-api/src/libs/dto/coupon/coupon.input.ts");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
let CouponResolver = class CouponResolver {
    couponService;
    constructor(couponService) {
        this.couponService = couponService;
    }
    async validateCoupon(couponCode, orderTotal) {
        return this.couponService.validateCoupon(couponCode, orderTotal);
    }
    async createCoupon(input) {
        return this.couponService.createCoupon(input);
    }
    async updateCouponByAdmin(input) {
        return this.couponService.updateCouponByAdmin(input);
    }
    async getAllCouponsByAdmin() {
        return this.couponService.getAllCouponsByAdmin();
    }
};
exports.CouponResolver = CouponResolver;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 60000 } }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => coupon_1.CouponValidation),
    __param(0, (0, graphql_1.Args)('couponCode')),
    __param(1, (0, graphql_1.Args)('orderTotal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], CouponResolver.prototype, "validateCoupon", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => coupon_1.Coupon),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof coupon_input_1.CouponCreateInput !== "undefined" && coupon_input_1.CouponCreateInput) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], CouponResolver.prototype, "createCoupon", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => coupon_1.Coupon),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof coupon_input_1.CouponUpdateInput !== "undefined" && coupon_input_1.CouponUpdateInput) === "function" ? _e : Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], CouponResolver.prototype, "updateCouponByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => [coupon_1.Coupon]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CouponResolver.prototype, "getAllCouponsByAdmin", null);
exports.CouponResolver = CouponResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof coupon_service_1.CouponService !== "undefined" && coupon_service_1.CouponService) === "function" ? _a : Object])
], CouponResolver);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/coupon/coupon.service.ts":
/*!******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/coupon/coupon.service.ts ***!
  \******************************************************************/
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
var CouponService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const coupon_enum_1 = __webpack_require__(/*! ../../libs/enums/coupon.enum */ "./apps/zinfurn-api/src/libs/enums/coupon.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
let CouponService = CouponService_1 = class CouponService {
    couponModel;
    logger = new common_1.Logger(CouponService_1.name);
    constructor(couponModel) {
        this.couponModel = couponModel;
    }
    async validateCoupon(code, orderTotal) {
        const fail = (message) => ({
            valid: false,
            message,
            discountAmount: 0,
            finalTotal: orderTotal,
        });
        const coupon = await this.couponModel.findOne({ couponCode: code.trim().toUpperCase() }).exec();
        if (!coupon)
            return fail('Kupon topilmadi');
        if (coupon.couponStatus !== coupon_enum_1.CouponStatus.ACTIVE)
            return fail('Kupon faol emas');
        if (coupon.validUntil && coupon.validUntil.getTime() < Date.now())
            return fail('Kupon muddati tugagan');
        if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses)
            return fail('Kupon limiti tugagan');
        if (orderTotal < (coupon.minOrderAmount || 0)) {
            return fail(`Bu kupon uchun minimal buyurtma: ${coupon.minOrderAmount}`);
        }
        const discountAmount = this.calcDiscount(coupon, orderTotal);
        return {
            valid: true,
            message: 'Kupon qo\'llandi',
            discountAmount,
            finalTotal: Math.max(0, orderTotal - discountAmount),
            couponCode: coupon.couponCode,
        };
    }
    async redeemCoupon(code, orderTotal) {
        const check = await this.validateCoupon(code, orderTotal);
        if (!check.valid)
            throw new common_1.BadRequestException(check.message);
        const filter = {
            couponCode: check.couponCode,
            couponStatus: coupon_enum_1.CouponStatus.ACTIVE,
        };
        const redeemed = await this.couponModel
            .findOneAndUpdate({ ...filter, $or: [{ maxUses: 0 }, { $expr: { $lt: ['$usedCount', '$maxUses'] } }] }, { $inc: { usedCount: 1 } }, { new: true })
            .exec();
        if (!redeemed)
            throw new common_1.BadRequestException('Kupon limiti tugagan');
        return { discountAmount: check.discountAmount, couponCode: check.couponCode };
    }
    calcDiscount(coupon, orderTotal) {
        if (coupon.couponType === coupon_enum_1.CouponType.PERCENT) {
            return Math.round((orderTotal * Math.min(coupon.couponValue, 100)) / 100);
        }
        return Math.min(coupon.couponValue, orderTotal);
    }
    async createCoupon(input) {
        if (input.couponType === coupon_enum_1.CouponType.PERCENT && input.couponValue > 100) {
            throw new common_1.BadRequestException('Foiz chegirma 100 dan oshmasin');
        }
        try {
            return await this.couponModel.create({ ...input, couponCode: input.couponCode.trim().toUpperCase() });
        }
        catch (err) {
            if (err?.code === 11000)
                throw new common_1.BadRequestException('Bunday kupon kodi allaqachon bor');
            this.logger.error(`createCoupon: ${err.message}`);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async updateCouponByAdmin(input) {
        const { _id, ...update } = input;
        const result = await this.couponModel.findByIdAndUpdate(_id, update, { new: true }).exec();
        if (!result)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        return result;
    }
    async getAllCouponsByAdmin() {
        return this.couponModel.find().sort({ createdAt: -1 }).exec();
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = CouponService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Coupon')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CouponService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/follow/follow.module.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/follow/follow.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FollowModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const follow_resolver_1 = __webpack_require__(/*! ./follow.resolver */ "./apps/zinfurn-api/src/components/follow/follow.resolver.ts");
const follow_service_1 = __webpack_require__(/*! ./follow.service */ "./apps/zinfurn-api/src/components/follow/follow.service.ts");
const Follow_model_1 = __webpack_require__(/*! ../../schemas/Follow.model */ "./apps/zinfurn-api/src/schemas/Follow.model.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const member_module_1 = __webpack_require__(/*! ../member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
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

/***/ "./apps/zinfurn-api/src/components/follow/follow.resolver.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/follow/follow.resolver.ts ***!
  \*******************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const follow_service_1 = __webpack_require__(/*! ./follow.service */ "./apps/zinfurn-api/src/components/follow/follow.service.ts");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const follow_1 = __webpack_require__(/*! ../../libs/dto/follow/follow */ "./apps/zinfurn-api/src/libs/dto/follow/follow.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const follow_input_1 = __webpack_require__(/*! ../../libs/dto/follow/follow.input */ "./apps/zinfurn-api/src/libs/dto/follow/follow.input.ts");
let FollowResolver = class FollowResolver {
    followService;
    constructor(followService) {
        this.followService = followService;
    }
    async subscribe(input, memberId) {
        const followingId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.followService.subscribe(memberId, followingId);
    }
    async unsubscribe(input, memberId) {
        const followingId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.followService.unsubscribe(memberId, followingId);
    }
    async getMemberFollowings(input, memberId) {
        const { followerId } = input.search;
        input.search.followerId = (0, config_1.ShapeIntoMongoObjectId)(followerId);
        return await this.followService.getMemberFollowings(memberId, input);
    }
    async getMemberFollowers(input, memberId) {
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

/***/ "./apps/zinfurn-api/src/components/follow/follow.service.ts":
/*!******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/follow/follow.service.ts ***!
  \******************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const member_service_1 = __webpack_require__(/*! ../member/member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
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
            common_1.Logger.error('Error, Service.model:', err.message);
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

/***/ "./apps/zinfurn-api/src/components/like/like.module.ts":
/*!*************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/like/like.module.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikeModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const like_service_1 = __webpack_require__(/*! ./like.service */ "./apps/zinfurn-api/src/components/like/like.service.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const Like_model_1 = __webpack_require__(/*! ../../schemas/Like.model */ "./apps/zinfurn-api/src/schemas/Like.model.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./apps/zinfurn-api/src/components/notification/notification.module.ts");
const BoardArticle_model_1 = __webpack_require__(/*! ../../schemas/BoardArticle.model */ "./apps/zinfurn-api/src/schemas/BoardArticle.model.ts");
const Member_model_1 = __webpack_require__(/*! ../../schemas/Member.model */ "./apps/zinfurn-api/src/schemas/Member.model.ts");
const Property_model_1 = __webpack_require__(/*! ../../schemas/Property.model */ "./apps/zinfurn-api/src/schemas/Property.model.ts");
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

/***/ "./apps/zinfurn-api/src/components/like/like.service.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/like/like.service.ts ***!
  \**************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const like_enum_1 = __webpack_require__(/*! ../../libs/enums/like.enum */ "./apps/zinfurn-api/src/libs/enums/like.enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./apps/zinfurn-api/src/components/notification/notification.service.ts");
const notification_enum_1 = __webpack_require__(/*! ../../libs/enums/notification.enum */ "./apps/zinfurn-api/src/libs/enums/notification.enum.ts");
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
                common_1.Logger.error('Error, Service.model: ', err.message);
                throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
            }
        }
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

/***/ "./apps/zinfurn-api/src/components/member/member.module.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/member/member.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const member_resolver_1 = __webpack_require__(/*! ./member.resolver */ "./apps/zinfurn-api/src/components/member/member.resolver.ts");
const member_service_1 = __webpack_require__(/*! ./member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const Member_model_1 = __webpack_require__(/*! ../../schemas/Member.model */ "./apps/zinfurn-api/src/schemas/Member.model.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const view_module_1 = __webpack_require__(/*! ../view/view.module */ "./apps/zinfurn-api/src/components/view/view.module.ts");
const like_module_1 = __webpack_require__(/*! ../like/like.module */ "./apps/zinfurn-api/src/components/like/like.module.ts");
const Follow_model_1 = __webpack_require__(/*! ../../schemas/Follow.model */ "./apps/zinfurn-api/src/schemas/Follow.model.ts");
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

/***/ "./apps/zinfurn-api/src/components/member/member.resolver.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/member/member.resolver.ts ***!
  \*******************************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberResolver = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const member_service_1 = __webpack_require__(/*! ./member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const member_input_1 = __webpack_require__(/*! ../../libs/dto/member/member.input */ "./apps/zinfurn-api/src/libs/dto/member/member.input.ts");
const member_1 = __webpack_require__(/*! ../../libs/dto/member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const throttler_1 = __webpack_require__(/*! @nestjs/throttler */ "@nestjs/throttler");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const member_update_1 = __webpack_require__(/*! ../../libs/dto/member/member.update */ "./apps/zinfurn-api/src/libs/dto/member/member.update.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const graphql_upload_1 = __webpack_require__(/*! graphql-upload */ "graphql-upload");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const sharp_1 = __webpack_require__(/*! sharp */ "sharp");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const ALLOWED_UPLOAD_TARGETS = ['member', 'property', 'article', 'repair', 'review'];
let MemberResolver = class MemberResolver {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    async signup(input, ctx) {
        const member = await this.memberService.signup(input);
        this.setAuthCookie(ctx.res, member.accessToken);
        return member;
    }
    async login(input, ctx) {
        const member = await this.memberService.login(input);
        this.setAuthCookie(ctx.res, member.accessToken);
        return member;
    }
    async refreshToken(refreshToken, ctx) {
        const member = await this.memberService.refreshToken(refreshToken);
        this.setAuthCookie(ctx.res, member.accessToken);
        return member;
    }
    async getMyProfile(memberId) {
        return await this.memberService.getMyProfile(memberId);
    }
    setAuthCookie(res, token) {
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 60 * 60 * 1000,
        });
    }
    async checkAuth(memberNick) {
        return `Hi ${memberNick}`;
    }
    async checkAuthRoles(authMember) {
        return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
    }
    async updateMember(input, memberId) {
        delete input._id;
        return await this.memberService.updateMember(memberId, input);
    }
    async getMember(input, memberId) {
        const targetId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.memberService.getMember(memberId, targetId);
    }
    async getAgents(input, memberId) {
        return await this.memberService.getAgents(memberId, input);
    }
    async getTechnicians(input, memberId) {
        return await this.memberService.getTechnicians(memberId, input);
    }
    async likeTargetMember(input, memberId) {
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.memberService.likeTargetMember(memberId, likeRefId);
    }
    async getAllMembersByAdmin(input) {
        return await this.memberService.getAllMembersByAdmin(input);
    }
    async updateMemberByAdmin(input) {
        return await this.memberService.updateMemberByAdmin(input);
    }
    async imageUploader({ createReadStream, filename, mimetype }, target) {
        if (!filename)
            throw new Error(common_enum_1.Message.UPLOAD_FAILED);
        if (!ALLOWED_UPLOAD_TARGETS.includes(String(target)))
            throw new Error(common_enum_1.Message.UPLOAD_FAILED);
        const validMime = config_1.validMimeTypes.includes(mimetype);
        if (!validMime)
            throw new Error(common_enum_1.Message.PROVIDE_ALLOWED_FORMAT);
        const imageName = (0, config_1.getSerialForImage)(filename).replace(/\.[a-z0-9]+$/i, '') + '.jpg';
        (0, fs_1.mkdirSync)(`uploads/${target}`, { recursive: true });
        const url = `uploads/${target}/${imageName}`;
        const stream = createReadStream();
        const transformer = (0, sharp_1.default)()
            .rotate()
            .resize({ width: 1400, withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true, mozjpeg: true });
        const result = await new Promise((resolve, reject) => {
            stream
                .pipe(transformer)
                .pipe((0, fs_1.createWriteStream)(url))
                .on('finish', async () => resolve(true))
                .on('error', () => reject(false));
        });
        if (!result)
            throw new Error(common_enum_1.Message.UPLOAD_FAILED);
        return url;
    }
    async imagesUploader(files, target) {
        const uploadedImages = [];
        const promisedList = files.map(async (img, index) => {
            try {
                const { filename, mimetype, encoding, createReadStream } = await img;
                if (!ALLOWED_UPLOAD_TARGETS.includes(String(target)))
                    throw new Error(common_enum_1.Message.UPLOAD_FAILED);
                const validMime = config_1.validMimeTypes.includes(mimetype);
                if (!validMime)
                    throw new Error(common_enum_1.Message.PROVIDE_ALLOWED_FORMAT);
                const imageName = (0, config_1.getSerialForImage)(filename).replace(/\.[a-z0-9]+$/i, '') + '.jpg';
                (0, fs_1.mkdirSync)(`uploads/${target}`, { recursive: true });
                const url = `uploads/${target}/${imageName}`;
                const stream = createReadStream();
                const transformer = (0, sharp_1.default)()
                    .rotate()
                    .resize({ width: 1400, withoutEnlargement: true })
                    .jpeg({ quality: 80, progressive: true, mozjpeg: true });
                const result = await new Promise((resolve, reject) => {
                    stream
                        .pipe(transformer)
                        .pipe((0, fs_1.createWriteStream)(url))
                        .on('finish', () => resolve(true))
                        .on('error', () => reject(false));
                });
                if (!result)
                    throw new Error(common_enum_1.Message.UPLOAD_FAILED);
                uploadedImages[index] = url;
            }
            catch (err) {
                common_1.Logger.error('Error, file missing!', err);
            }
        });
        await Promise.all(promisedList);
        return uploadedImages;
    }
};
exports.MemberResolver = MemberResolver;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof member_input_1.MemberInput !== "undefined" && member_input_1.MemberInput) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], MemberResolver.prototype, "signup", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof member_input_1.LoginInput !== "undefined" && member_input_1.LoginInput) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], MemberResolver.prototype, "login", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('refreshToken')),
    __param(1, (0, graphql_1.Context)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], MemberResolver.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => member_1.Member),
    __param(0, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _g : Object]),
    __metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], MemberResolver.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => String),
    __param(0, (0, authMember_decorator_1.AuthMember)('memberNick')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], MemberResolver.prototype, "checkAuth", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.USER, member_enum_1.MemberType.AGENT),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => String),
    __param(0, (0, authMember_decorator_1.AuthMember)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], MemberResolver.prototype, "checkAuthRoles", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof member_update_1.MemberUpdate !== "undefined" && member_update_1.MemberUpdate) === "function" ? _m : Object, typeof (_o = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], MemberResolver.prototype, "updateMember", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('memberId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_q = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], MemberResolver.prototype, "getMember", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => member_1.Members),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof member_input_1.AgentsInquiry !== "undefined" && member_input_1.AgentsInquiry) === "function" ? _s : Object, typeof (_t = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _t : Object]),
    __metadata("design:returntype", typeof (_u = typeof Promise !== "undefined" && Promise) === "function" ? _u : Object)
], MemberResolver.prototype, "getAgents", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => member_1.Members),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_v = typeof member_input_1.TechnicianInquiry !== "undefined" && member_input_1.TechnicianInquiry) === "function" ? _v : Object, typeof (_w = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _w : Object]),
    __metadata("design:returntype", typeof (_x = typeof Promise !== "undefined" && Promise) === "function" ? _x : Object)
], MemberResolver.prototype, "getTechnicians", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('memberId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_y = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _y : Object]),
    __metadata("design:returntype", typeof (_z = typeof Promise !== "undefined" && Promise) === "function" ? _z : Object)
], MemberResolver.prototype, "likeTargetMember", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => member_1.Members),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_0 = typeof member_input_1.MembersInquiry !== "undefined" && member_input_1.MembersInquiry) === "function" ? _0 : Object]),
    __metadata("design:returntype", typeof (_1 = typeof Promise !== "undefined" && Promise) === "function" ? _1 : Object)
], MemberResolver.prototype, "getAllMembersByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => member_1.Member),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_2 = typeof member_update_1.MemberUpdate !== "undefined" && member_update_1.MemberUpdate) === "function" ? _2 : Object]),
    __metadata("design:returntype", typeof (_3 = typeof Promise !== "undefined" && Promise) === "function" ? _3 : Object)
], MemberResolver.prototype, "updateMemberByAdmin", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => String),
    __param(0, (0, graphql_1.Args)({ name: 'file', type: () => graphql_upload_1.GraphQLUpload })),
    __param(1, (0, graphql_1.Args)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_4 = typeof graphql_upload_1.FileUpload !== "undefined" && graphql_upload_1.FileUpload) === "function" ? _4 : Object, typeof (_5 = typeof String !== "undefined" && String) === "function" ? _5 : Object]),
    __metadata("design:returntype", typeof (_6 = typeof Promise !== "undefined" && Promise) === "function" ? _6 : Object)
], MemberResolver.prototype, "imageUploader", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)((returns) => [String]),
    __param(0, (0, graphql_1.Args)('files', { type: () => [graphql_upload_1.GraphQLUpload] })),
    __param(1, (0, graphql_1.Args)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, typeof (_7 = typeof String !== "undefined" && String) === "function" ? _7 : Object]),
    __metadata("design:returntype", typeof (_8 = typeof Promise !== "undefined" && Promise) === "function" ? _8 : Object)
], MemberResolver.prototype, "imagesUploader", null);
exports.MemberResolver = MemberResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _a : Object])
], MemberResolver);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/member/member.service.ts":
/*!******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/member/member.service.ts ***!
  \******************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const auth_service_1 = __webpack_require__(/*! ../auth/auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
const view_service_1 = __webpack_require__(/*! ../view/view.service */ "./apps/zinfurn-api/src/components/view/view.service.ts");
const view_enum_1 = __webpack_require__(/*! ../../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
const like_enum_1 = __webpack_require__(/*! ../../libs/enums/like.enum */ "./apps/zinfurn-api/src/libs/enums/like.enum.ts");
const like_service_1 = __webpack_require__(/*! ../like/like.service */ "./apps/zinfurn-api/src/components/like/like.service.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
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
            result.refreshToken = await this.authService.createRefreshToken(result);
            return result;
        }
        catch (err) {
            common_1.Logger.error('Error, Service.model:', err.message);
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
        response.refreshToken = await this.authService.createRefreshToken(response);
        return response;
    }
    async refreshToken(refreshToken) {
        try {
            const { member, token, refresh } = await this.authService.refreshTokens(refreshToken);
            member.accessToken = token;
            member.refreshToken = refresh;
            return member;
        }
        catch (err) {
            common_1.Logger.warn(`Refresh token rejected: ${err.message}`);
            throw new common_1.UnauthorizedException(common_enum_1.Message.NOT_AUTHENTICATED);
        }
    }
    async getMyProfile(memberId) {
        const member = await this.memberModel.findById(memberId).exec();
        if (!member)
            throw new common_1.InternalServerErrorException(common_enum_1.Message.NO_DATA_FOUND);
        return member;
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
        result.refreshToken = await this.authService.createRefreshToken(result);
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
            match.memberNick = (0, config_1.buildSearchRegex)(text);
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
            match.memberNick = (0, config_1.buildSearchRegex)(text);
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
        if (memberStatus)
            match.memberStatus = memberStatus;
        if (memberType)
            match.memberType = memberType;
        if (text)
            match.memberNick = (0, config_1.buildSearchRegex)(text);
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

/***/ "./apps/zinfurn-api/src/components/message/message.module.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/message/message.module.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const notification_module_1 = __webpack_require__(/*! ../notification/notification.module */ "./apps/zinfurn-api/src/components/notification/notification.module.ts");
const Message_model_1 = __webpack_require__(/*! ../../schemas/Message.model */ "./apps/zinfurn-api/src/schemas/Message.model.ts");
const Property_model_1 = __webpack_require__(/*! ../../schemas/Property.model */ "./apps/zinfurn-api/src/schemas/Property.model.ts");
const Member_model_1 = __webpack_require__(/*! ../../schemas/Member.model */ "./apps/zinfurn-api/src/schemas/Member.model.ts");
const message_resolver_1 = __webpack_require__(/*! ./message.resolver */ "./apps/zinfurn-api/src/components/message/message.resolver.ts");
const message_service_1 = __webpack_require__(/*! ./message.service */ "./apps/zinfurn-api/src/components/message/message.service.ts");
let MessageModule = class MessageModule {
};
exports.MessageModule = MessageModule;
exports.MessageModule = MessageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Message', schema: Message_model_1.default },
                { name: 'Property', schema: Property_model_1.default },
                { name: 'Member', schema: Member_model_1.default },
            ]),
            auth_module_1.AuthModule,
            notification_module_1.NotificationModule,
        ],
        providers: [message_resolver_1.MessageResolver, message_service_1.MessageService],
        exports: [message_service_1.MessageService],
    })
], MessageModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/message/message.resolver.ts":
/*!*********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/message/message.resolver.ts ***!
  \*********************************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageResolver = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const message_1 = __webpack_require__(/*! ../../libs/dto/message/message */ "./apps/zinfurn-api/src/libs/dto/message/message.ts");
const message_input_1 = __webpack_require__(/*! ../../libs/dto/message/message.input */ "./apps/zinfurn-api/src/libs/dto/message/message.input.ts");
const message_service_1 = __webpack_require__(/*! ./message.service */ "./apps/zinfurn-api/src/components/message/message.service.ts");
let MessageResolver = class MessageResolver {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    async sendMessage(input, memberId) {
        return this.messageService.sendMessage(memberId, input);
    }
    async replyMessage(input, memberId) {
        return this.messageService.replyMessage(memberId, input);
    }
    async sendRepairRequest(input, memberId) {
        return this.messageService.sendRepairRequest(memberId, input);
    }
    async getMyConversations(memberId) {
        return this.messageService.getMyConversations(memberId);
    }
    async getConversation(conversationId, memberId) {
        return this.messageService.getConversation(memberId, conversationId);
    }
};
exports.MessageResolver = MessageResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => message_1.Message),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof message_input_1.SendMessageInput !== "undefined" && message_input_1.SendMessageInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], MessageResolver.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => message_1.Message),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof message_input_1.ReplyMessageInput !== "undefined" && message_input_1.ReplyMessageInput) === "function" ? _e : Object, typeof (_f = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], MessageResolver.prototype, "replyMessage", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => message_1.Message),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof message_input_1.SendRepairRequestInput !== "undefined" && message_input_1.SendRepairRequestInput) === "function" ? _h : Object, typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], MessageResolver.prototype, "sendRepairRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => [message_1.Conversation]),
    __param(0, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _l : Object]),
    __metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], MessageResolver.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => [message_1.Message]),
    __param(0, (0, graphql_1.Args)('conversationId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_o = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], MessageResolver.prototype, "getConversation", null);
exports.MessageResolver = MessageResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof message_service_1.MessageService !== "undefined" && message_service_1.MessageService) === "function" ? _a : Object])
], MessageResolver);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/message/message.service.ts":
/*!********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/message/message.service.ts ***!
  \********************************************************************/
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
exports.MessageService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const message_enum_1 = __webpack_require__(/*! ../../libs/enums/message.enum */ "./apps/zinfurn-api/src/libs/enums/message.enum.ts");
const notification_enum_1 = __webpack_require__(/*! ../../libs/enums/notification.enum */ "./apps/zinfurn-api/src/libs/enums/notification.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const notification_service_1 = __webpack_require__(/*! ../notification/notification.service */ "./apps/zinfurn-api/src/components/notification/notification.service.ts");
let MessageService = class MessageService {
    messageModel;
    propertyModel;
    memberModel;
    notificationService;
    constructor(messageModel, propertyModel, memberModel, notificationService) {
        this.messageModel = messageModel;
        this.propertyModel = propertyModel;
        this.memberModel = memberModel;
        this.notificationService = notificationService;
    }
    convId(propertyId, a, b) {
        return [String(a), String(b)].sort().join('_') + '_' + String(propertyId);
    }
    async sendMessage(senderId, input) {
        const property = await this.propertyModel.findById(input.propertyId);
        if (!property)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        const receiverId = property.memberId;
        if (String(receiverId) === String(senderId))
            throw new common_1.BadRequestException('You cannot message your own listing');
        const conversationId = this.convId(String(input.propertyId), String(senderId), String(receiverId));
        const message = await this.messageModel.create({
            conversationId,
            propertyId: input.propertyId,
            senderId,
            receiverId,
            message: input.message,
            messageStatus: message_enum_1.MessageStatus.WAIT,
        });
        await this.notifyNew(senderId, receiverId, input.propertyId, property.propertyTitle, input.message, false, conversationId);
        return message;
    }
    async replyMessage(senderId, input) {
        const last = await this.messageModel.findOne({ conversationId: input.conversationId }).sort({ createdAt: -1 });
        if (!last)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        const me = String(senderId);
        if (me !== String(last.senderId) && me !== String(last.receiverId)) {
            throw new common_1.BadRequestException('Not a participant of this conversation');
        }
        const receiverId = me === String(last.senderId) ? last.receiverId : last.senderId;
        const message = await this.messageModel.create({
            conversationId: input.conversationId,
            propertyId: last.propertyId,
            senderId,
            receiverId,
            message: input.message,
            messageStatus: message_enum_1.MessageStatus.WAIT,
        });
        const property = last.propertyId ? await this.propertyModel.findById(last.propertyId) : null;
        await this.notifyNew(senderId, receiverId, last.propertyId ? String(last.propertyId) : undefined, property?.propertyTitle, input.message, last.get('kind') === 'REPAIR', input.conversationId);
        return message;
    }
    async sendRepairRequest(senderId, input) {
        const tech = await this.memberModel.findById(input.technicianId);
        if (!tech)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        if (String(tech._id) === String(senderId))
            throw new common_1.BadRequestException('You cannot request your own service');
        const conversationId = [String(senderId), String(tech._id)].sort().join('_') + '_repair';
        const parts = [input.message.trim()];
        if (input.address)
            parts.push(`📍 ${input.address}`);
        if (input.phone)
            parts.push(`📞 ${input.phone}`);
        const fullMessage = parts.join('\n');
        const message = await this.messageModel.create({
            conversationId,
            kind: 'REPAIR',
            senderId,
            receiverId: tech._id,
            message: fullMessage,
            messageStatus: message_enum_1.MessageStatus.WAIT,
        });
        await this.notifyNew(senderId, tech._id, undefined, undefined, input.message, true, conversationId);
        return message;
    }
    async notifyNew(senderId, receiverId, propertyId, propertyTitle, text, isRepair = false, conversationId) {
        const sender = await this.memberModel.findById(senderId);
        const nick = sender ? sender.memberNick : 'Someone';
        const short = text.length > 60 ? text.slice(0, 60) + '...' : text;
        await this.notificationService.createNotification({
            notificationType: notification_enum_1.NotificationType.MESSAGE,
            notificationGroup: isRepair ? notification_enum_1.NotificationGroup.REPAIR_PROPERTY : notification_enum_1.NotificationGroup.PROPERTY,
            notificationTitle: isRepair ? 'New Repair Request' : 'New Message',
            notificationDesc: `${nick}: ${short}`,
            authorId: String(senderId),
            receiverId: String(receiverId),
            ...(propertyId ? { propertyId } : {}),
            ...(conversationId ? { conversationId } : {}),
        });
    }
    async getMyConversations(memberId) {
        const me = new mongoose_2.Types.ObjectId(String(memberId));
        const result = await this.messageModel.aggregate([
            { $match: { $or: [{ senderId: me }, { receiverId: me }] } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$conversationId',
                    propertyId: { $first: '$propertyId' },
                    kind: { $first: '$kind' },
                    lastMessage: { $first: '$message' },
                    lastMessageAt: { $first: '$createdAt' },
                    lastSender: { $first: '$senderId' },
                    lastReceiver: { $first: '$receiverId' },
                    unreadCount: {
                        $sum: { $cond: [{ $and: [{ $eq: ['$receiverId', me] }, { $eq: ['$messageStatus', message_enum_1.MessageStatus.WAIT] }] }, 1, 0] },
                    },
                },
            },
            { $addFields: { partnerId: { $cond: [{ $eq: ['$lastSender', me] }, '$lastReceiver', '$lastSender'] } } },
            { $lookup: { from: 'members', localField: 'partnerId', foreignField: '_id', as: 'partner' } },
            { $unwind: { path: '$partner', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'properties', localField: 'propertyId', foreignField: '_id', as: 'property' } },
            { $unwind: { path: '$property', preserveNullAndEmptyArrays: true } },
            { $sort: { lastMessageAt: -1 } },
            {
                $project: {
                    _id: 0,
                    conversationId: '$_id',
                    propertyId: 1,
                    kind: 1,
                    propertyTitle: '$property.propertyTitle',
                    propertyImage: { $arrayElemAt: ['$property.propertyImages', 0] },
                    lastMessage: 1,
                    lastMessageAt: 1,
                    unreadCount: 1,
                    partner: 1,
                },
            },
        ]);
        return result;
    }
    async getConversation(memberId, conversationId) {
        const me = new mongoose_2.Types.ObjectId(String(memberId));
        const exists = await this.messageModel.findOne({ conversationId, $or: [{ senderId: me }, { receiverId: me }] });
        if (!exists)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        await this.messageModel.updateMany({ conversationId, receiverId: me, messageStatus: message_enum_1.MessageStatus.WAIT }, { messageStatus: message_enum_1.MessageStatus.READ });
        const result = await this.messageModel.aggregate([
            { $match: { conversationId } },
            { $sort: { createdAt: 1 } },
            { $lookup: { from: 'members', localField: 'senderId', foreignField: '_id', as: 'senderData' } },
            { $unwind: { path: '$senderData', preserveNullAndEmptyArrays: true } },
        ]);
        return result;
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Message')),
    __param(1, (0, mongoose_1.InjectModel)('Property')),
    __param(2, (0, mongoose_1.InjectModel)('Member')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object, typeof (_d = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _d : Object])
], MessageService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/notice/notice.module.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/notice/notice.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const notice_resolver_1 = __webpack_require__(/*! ./notice.resolver */ "./apps/zinfurn-api/src/components/notice/notice.resolver.ts");
const notice_service_1 = __webpack_require__(/*! ./notice.service */ "./apps/zinfurn-api/src/components/notice/notice.service.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const Notice_model_1 = __webpack_require__(/*! ../../schemas/Notice.model */ "./apps/zinfurn-api/src/schemas/Notice.model.ts");
const translation_module_1 = __webpack_require__(/*! ../translation/translation.module */ "./apps/zinfurn-api/src/components/translation/translation.module.ts");
let NoticeModule = class NoticeModule {
};
exports.NoticeModule = NoticeModule;
exports.NoticeModule = NoticeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Notice', schema: Notice_model_1.default }]),
            auth_module_1.AuthModule,
            translation_module_1.TranslationModule,
        ],
        providers: [notice_resolver_1.NoticeResolver, notice_service_1.NoticeService],
        exports: [notice_service_1.NoticeService],
    })
], NoticeModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/notice/notice.resolver.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/notice/notice.resolver.ts ***!
  \*******************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const notice_service_1 = __webpack_require__(/*! ./notice.service */ "./apps/zinfurn-api/src/components/notice/notice.service.ts");
const notice_1 = __webpack_require__(/*! ../../libs/dto/notice/notice */ "./apps/zinfurn-api/src/libs/dto/notice/notice.ts");
const notice_input_1 = __webpack_require__(/*! ../../libs/dto/notice/notice.input */ "./apps/zinfurn-api/src/libs/dto/notice/notice.input.ts");
const notice_inquiry_1 = __webpack_require__(/*! ../../libs/dto/notice/notice.inquiry */ "./apps/zinfurn-api/src/libs/dto/notice/notice.inquiry.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const graphql_2 = __webpack_require__(/*! graphql */ "graphql");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
let NoticeResolver = class NoticeResolver {
    noticeService;
    constructor(noticeService) {
        this.noticeService = noticeService;
    }
    async createNotice(input, memberId) {
        return await this.noticeService.createNotice(memberId, input);
    }
    async getAllNotices(input) {
        return await this.noticeService.getAllNotices(input);
    }
    async getNotice(noticeId) {
        const objectId = (0, config_1.ShapeIntoMongoObjectId)(noticeId);
        return await this.noticeService.getNotice(objectId);
    }
    async updateNotice(noticeId, input, memberId) {
        const objectId = (0, config_1.ShapeIntoMongoObjectId)(noticeId);
        return await this.noticeService.updateNotice(memberId, objectId, input);
    }
    async removeNotice(noticeId, memberId) {
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

/***/ "./apps/zinfurn-api/src/components/notice/notice.service.ts":
/*!******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/notice/notice.service.ts ***!
  \******************************************************************/
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
exports.NoticeService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const notice_enum_1 = __webpack_require__(/*! ../../libs/enums/notice.enum */ "./apps/zinfurn-api/src/libs/enums/notice.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const translation_service_1 = __webpack_require__(/*! ../translation/translation.service */ "./apps/zinfurn-api/src/components/translation/translation.service.ts");
let NoticeService = class NoticeService {
    noticeModel;
    translationService;
    constructor(noticeModel, translationService) {
        this.noticeModel = noticeModel;
        this.translationService = translationService;
    }
    async createNotice(memberId, input) {
        try {
            const data = { ...input, memberId };
            try {
                const translations = await this.translationService.translateArticle(input.noticeTitle, input.noticeContent);
                if (translations)
                    data.noticeTranslations = translations;
            }
            catch (e) {
                common_1.Logger.warn('Tarjima o\'tkazib yuborildi (notice create)');
            }
            const result = await this.noticeModel.create(data);
            return result;
        }
        catch (err) {
            common_1.Logger.error('Error, Service.createNotice:', err.message);
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
                { noticeTitle: (0, config_1.buildSearchRegex)(search) },
                { noticeContent: (0, config_1.buildSearchRegex)(search) },
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
            common_1.Logger.error('Error, Service.getAllNotices:', err.message);
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
            common_1.Logger.error('Error, Service.getNotice:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        }
    }
    async updateNotice(memberId, noticeId, input) {
        try {
            if (input.noticeTitle !== undefined || input.noticeContent !== undefined) {
                try {
                    const existing = await this.noticeModel.findOne({ _id: noticeId }).lean().exec();
                    const title = input.noticeTitle ?? existing?.noticeTitle;
                    const content = input.noticeContent ?? existing?.noticeContent;
                    if (title) {
                        const translations = await this.translationService.translateArticle(title, content);
                        if (translations)
                            input.noticeTranslations = translations;
                    }
                }
                catch (e) {
                    common_1.Logger.warn('Tarjima o\'tkazib yuborildi (notice update)');
                }
            }
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
            common_1.Logger.error('Error, Service.updateNotice:', err.message);
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
            common_1.Logger.error('Error, Service.removeNotice:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.REMOVE_FAILED);
        }
    }
};
exports.NoticeService = NoticeService;
exports.NoticeService = NoticeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Notice')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof translation_service_1.TranslationService !== "undefined" && translation_service_1.TranslationService) === "function" ? _b : Object])
], NoticeService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/notification/notification.module.ts":
/*!*****************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/notification/notification.module.ts ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const Notification_model_1 = __webpack_require__(/*! ../../schemas/Notification.model */ "./apps/zinfurn-api/src/schemas/Notification.model.ts");
const notification_service_1 = __webpack_require__(/*! ./notification.service */ "./apps/zinfurn-api/src/components/notification/notification.service.ts");
const socket_module_1 = __webpack_require__(/*! ../../socket/socket.module */ "./apps/zinfurn-api/src/socket/socket.module.ts");
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

/***/ "./apps/zinfurn-api/src/components/notification/notification.service.ts":
/*!******************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/notification/notification.service.ts ***!
  \******************************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const notification_enum_1 = __webpack_require__(/*! ../../libs/enums/notification.enum */ "./apps/zinfurn-api/src/libs/enums/notification.enum.ts");
const socket_gateway_1 = __webpack_require__(/*! ../../socket/socket.gateway */ "./apps/zinfurn-api/src/socket/socket.gateway.ts");
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
            conversationId: notification.conversationId,
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

/***/ "./apps/zinfurn-api/src/components/order/order.module.ts":
/*!***************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/order/order.module.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const member_module_1 = __webpack_require__(/*! ../member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
const coupon_module_1 = __webpack_require__(/*! ../coupon/coupon.module */ "./apps/zinfurn-api/src/components/coupon/coupon.module.ts");
const Order_model_1 = __webpack_require__(/*! ../../schemas/Order.model */ "./apps/zinfurn-api/src/schemas/Order.model.ts");
const Member_model_1 = __webpack_require__(/*! ../../schemas/Member.model */ "./apps/zinfurn-api/src/schemas/Member.model.ts");
const Property_model_1 = __webpack_require__(/*! ../../schemas/Property.model */ "./apps/zinfurn-api/src/schemas/Property.model.ts");
const order_resolver_1 = __webpack_require__(/*! ./order.resolver */ "./apps/zinfurn-api/src/components/order/order.resolver.ts");
const order_service_1 = __webpack_require__(/*! ./order.service */ "./apps/zinfurn-api/src/components/order/order.service.ts");
const telegram_notify_service_1 = __webpack_require__(/*! ./telegram-notify.service */ "./apps/zinfurn-api/src/components/order/telegram-notify.service.ts");
let OrderModule = class OrderModule {
};
exports.OrderModule = OrderModule;
exports.OrderModule = OrderModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Order', schema: Order_model_1.default },
                { name: 'Property', schema: Property_model_1.default },
                { name: 'Member', schema: Member_model_1.default },
            ]),
            auth_module_1.AuthModule,
            member_module_1.MemberModule,
            coupon_module_1.CouponModule,
        ],
        providers: [order_resolver_1.OrderResolver, order_service_1.OrderService, telegram_notify_service_1.TelegramNotifyService],
        exports: [order_service_1.OrderService],
    })
], OrderModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/order/order.resolver.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/order/order.resolver.ts ***!
  \*****************************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderResolver = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const order_1 = __webpack_require__(/*! ../../libs/dto/order/order */ "./apps/zinfurn-api/src/libs/dto/order/order.ts");
const order_input_1 = __webpack_require__(/*! ../../libs/dto/order/order.input */ "./apps/zinfurn-api/src/libs/dto/order/order.input.ts");
const order_update_1 = __webpack_require__(/*! ../../libs/dto/order/order.update */ "./apps/zinfurn-api/src/libs/dto/order/order.update.ts");
const order_service_1 = __webpack_require__(/*! ./order.service */ "./apps/zinfurn-api/src/components/order/order.service.ts");
let OrderResolver = class OrderResolver {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async createOrder(input, memberId) {
        return this.orderService.createOrder(memberId, input);
    }
    async getMyOrders(input, memberId) {
        return this.orderService.getMyOrders(memberId, input);
    }
    async getOrderById(orderId, memberId) {
        return this.orderService.getOrderById(memberId, (0, config_1.ShapeIntoMongoObjectId)(orderId));
    }
    async confirmDelivery(orderId, memberId) {
        return this.orderService.confirmDelivery(memberId, (0, config_1.ShapeIntoMongoObjectId)(orderId));
    }
    async demoDeliverOrder(orderId, memberId) {
        return this.orderService.demoDeliverOrder(memberId, (0, config_1.ShapeIntoMongoObjectId)(orderId));
    }
    async requestReturn(input, memberId) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return this.orderService.requestReturn(memberId, input);
    }
    async updateOrderStatusByAdmin(input) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return this.orderService.updateOrderStatusByAdmin(input);
    }
    async getAllOrdersByAdmin(input) {
        return this.orderService.getAllOrdersByAdmin(input);
    }
};
exports.OrderResolver = OrderResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => order_1.Order),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof order_input_1.CreateOrderInput !== "undefined" && order_input_1.CreateOrderInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], OrderResolver.prototype, "createOrder", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => order_1.Orders),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof order_input_1.OrdersInquiry !== "undefined" && order_input_1.OrdersInquiry) === "function" ? _e : Object, typeof (_f = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], OrderResolver.prototype, "getMyOrders", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Query)(() => order_1.Order),
    __param(0, (0, graphql_1.Args)('orderId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], OrderResolver.prototype, "getOrderById", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => order_1.Order),
    __param(0, (0, graphql_1.Args)('orderId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_k = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _k : Object]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], OrderResolver.prototype, "confirmDelivery", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => order_1.Order),
    __param(0, (0, graphql_1.Args)('orderId')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _m : Object]),
    __metadata("design:returntype", typeof (_o = typeof Promise !== "undefined" && Promise) === "function" ? _o : Object)
], OrderResolver.prototype, "demoDeliverOrder", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => order_1.Order),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_p = typeof order_update_1.OrderUpdate !== "undefined" && order_update_1.OrderUpdate) === "function" ? _p : Object, typeof (_q = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _q : Object]),
    __metadata("design:returntype", typeof (_r = typeof Promise !== "undefined" && Promise) === "function" ? _r : Object)
], OrderResolver.prototype, "requestReturn", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => order_1.Order),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_s = typeof order_update_1.OrderUpdate !== "undefined" && order_update_1.OrderUpdate) === "function" ? _s : Object]),
    __metadata("design:returntype", typeof (_t = typeof Promise !== "undefined" && Promise) === "function" ? _t : Object)
], OrderResolver.prototype, "updateOrderStatusByAdmin", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => order_1.Orders),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_u = typeof order_input_1.OrdersInquiry !== "undefined" && order_input_1.OrdersInquiry) === "function" ? _u : Object]),
    __metadata("design:returntype", typeof (_v = typeof Promise !== "undefined" && Promise) === "function" ? _v : Object)
], OrderResolver.prototype, "getAllOrdersByAdmin", null);
exports.OrderResolver = OrderResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof order_service_1.OrderService !== "undefined" && order_service_1.OrderService) === "function" ? _a : Object])
], OrderResolver);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/order/order.service.ts":
/*!****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/order/order.service.ts ***!
  \****************************************************************/
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
exports.OrderService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const order_enum_1 = __webpack_require__(/*! ../../libs/enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const telegram_notify_service_1 = __webpack_require__(/*! ./telegram-notify.service */ "./apps/zinfurn-api/src/components/order/telegram-notify.service.ts");
const coupon_service_1 = __webpack_require__(/*! ../coupon/coupon.service */ "./apps/zinfurn-api/src/components/coupon/coupon.service.ts");
let OrderService = class OrderService {
    orderModel;
    propertyModel;
    telegramNotify;
    couponService;
    constructor(orderModel, propertyModel, telegramNotify, couponService) {
        this.orderModel = orderModel;
        this.propertyModel = propertyModel;
        this.telegramNotify = telegramNotify;
        this.couponService = couponService;
    }
    async createOrder(memberId, input) {
        input.memberId = memberId;
        const orderId = `ZIN-${Date.now()}`;
        let orderDiscount = 0;
        let orderCouponCode;
        if (input.couponCode) {
            const redeemed = await this.couponService.redeemCoupon(input.couponCode, input.orderTotal);
            orderDiscount = redeemed.discountAmount;
            orderCouponCode = redeemed.couponCode;
            input.orderTotal = Math.max(0, input.orderTotal - orderDiscount);
        }
        try {
            const order = await this.orderModel.create({ ...input, orderId, orderDiscount, orderCouponCode });
            this.scheduleAutoProgression(order._id);
            this.telegramNotify.notifyCustomer(memberId, orderId, order_enum_1.OrderStatus.PENDING, order.orderTotal);
            this.telegramNotify.notifyAdminNewOrder(orderId, order.orderTotal, order.orderItems?.length ?? 0);
            return order;
        }
        catch (err) {
            common_1.Logger.error('OrderService.createOrder error:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    scheduleAutoProgression(orderId) {
        const advance = (status, delayMs) => {
            setTimeout(async () => {
                try {
                    const doc = await this.orderModel.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true });
                    if (doc)
                        this.telegramNotify.notifyCustomer(doc.memberId, doc.orderId, status);
                }
                catch { }
            }, delayMs);
        };
        advance(order_enum_1.OrderStatus.PROCESSING, 15_000);
        advance(order_enum_1.OrderStatus.SHIPPED, 35_000);
        advance(order_enum_1.OrderStatus.DELIVERED, 60_000);
    }
    async getMyOrders(memberId, input) {
        const { page, limit, sort, direction, search } = input;
        const match = { memberId };
        if (search?.orderStatus)
            match.orderStatus = search.orderStatus;
        const sortBy = { [sort ?? 'createdAt']: direction ?? common_enum_1.Direction.DESC };
        const result = await this.orderModel
            .aggregate([
            { $match: match },
            { $sort: sortBy },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupMember,
                        { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        return result[0];
    }
    async getOrderById(memberId, orderId) {
        const result = await this.orderModel
            .aggregate([
            { $match: { _id: orderId, memberId } },
            config_1.lookupMember,
            { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
        ])
            .exec();
        if (!result[0])
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        return result[0];
    }
    async confirmDelivery(memberId, orderId) {
        const order = await this.orderModel.findOne({ _id: orderId, memberId });
        if (!order)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        if (order.orderStatus !== order_enum_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Order must be DELIVERED before confirmation');
        }
        const confirmed = await this.orderModel.findByIdAndUpdate(orderId, { orderStatus: order_enum_1.OrderStatus.CONFIRMED, confirmedAt: new Date() }, { new: true });
        this.telegramNotify.notifyCustomer(memberId, order.orderId, order_enum_1.OrderStatus.CONFIRMED);
        for (const item of order.orderItems) {
            await this.propertyModel.findByIdAndUpdate(item.propertyId, { $inc: { propertySoldCount: item.quantity } });
        }
        return confirmed;
    }
    async demoDeliverOrder(memberId, orderId) {
        const order = await this.orderModel.findOne({ _id: orderId, memberId });
        if (!order)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        const ACTIVE = ['PENDING', 'PROCESSING', 'SHIPPED'];
        if (!ACTIVE.includes(order.orderStatus)) {
            throw new common_1.BadRequestException('Order is not in an active delivery state');
        }
        this.telegramNotify.notifyCustomer(memberId, order.orderId, order_enum_1.OrderStatus.DELIVERED);
        return this.orderModel.findByIdAndUpdate(orderId, { orderStatus: order_enum_1.OrderStatus.DELIVERED }, { new: true });
    }
    async requestReturn(memberId, input) {
        const order = await this.orderModel.findOne({ _id: input._id, memberId });
        if (!order)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        if (order.orderStatus !== order_enum_1.OrderStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Order must be CONFIRMED before return request');
        }
        this.telegramNotify.notifyCustomer(memberId, order.orderId, order_enum_1.OrderStatus.RETURN_REQUESTED);
        return this.orderModel.findByIdAndUpdate(input._id, {
            orderStatus: order_enum_1.OrderStatus.RETURN_REQUESTED,
            returnRequestedAt: new Date(),
            returnReason: input.returnReason,
        }, { new: true });
    }
    async updateOrderStatusByAdmin(input) {
        const updateData = { orderStatus: input.orderStatus };
        if (input.orderStatus === order_enum_1.OrderStatus.RETURNED)
            updateData.returnedAt = new Date();
        const updated = (await this.orderModel.findByIdAndUpdate(input._id, updateData, { new: true }));
        if (updated && input.orderStatus) {
            this.telegramNotify.notifyCustomer(updated.memberId, updated.orderId, input.orderStatus);
        }
        return updated;
    }
    async getAllOrdersByAdmin(input) {
        const { page, limit, sort, direction, search } = input;
        const match = {};
        if (search?.orderStatus)
            match.orderStatus = search.orderStatus;
        const sortBy = { [sort ?? 'createdAt']: direction ?? common_enum_1.Direction.DESC };
        const result = await this.orderModel
            .aggregate([
            { $match: match },
            { $sort: sortBy },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupMember,
                        { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        return result[0];
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Order')),
    __param(1, (0, mongoose_1.InjectModel)('Property')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof telegram_notify_service_1.TelegramNotifyService !== "undefined" && telegram_notify_service_1.TelegramNotifyService) === "function" ? _c : Object, typeof (_d = typeof coupon_service_1.CouponService !== "undefined" && coupon_service_1.CouponService) === "function" ? _d : Object])
], OrderService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/order/telegram-notify.service.ts":
/*!**************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/order/telegram-notify.service.ts ***!
  \**************************************************************************/
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
var TelegramNotifyService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramNotifyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const order_enum_1 = __webpack_require__(/*! ../../libs/enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
let TelegramNotifyService = TelegramNotifyService_1 = class TelegramNotifyService {
    memberModel;
    logger = new common_1.Logger(TelegramNotifyService_1.name);
    constructor(memberModel) {
        this.memberModel = memberModel;
    }
    STATUS_TEXT = {
        [order_enum_1.OrderStatus.PENDING]: "🕐 Qabul qilindi — tez orada tayyorlaymiz",
        [order_enum_1.OrderStatus.PROCESSING]: '📦 Tayyorlanmoqda',
        [order_enum_1.OrderStatus.SHIPPED]: "🚚 Yo'lga chiqdi",
        [order_enum_1.OrderStatus.DELIVERED]: '📬 Yetkazib berildi',
        [order_enum_1.OrderStatus.CONFIRMED]: '✅ Yakunlandi — xaridingiz uchun rahmat!',
        [order_enum_1.OrderStatus.CANCELLED]: '❌ Bekor qilindi',
        [order_enum_1.OrderStatus.RETURN_REQUESTED]: "↩️ Qaytarish so'rovi qabul qilindi",
        [order_enum_1.OrderStatus.RETURNED]: '🔄 Qaytarildi',
    };
    notifyCustomer(memberId, orderCode, status, orderTotal) {
        this.send(memberId, this.buildMessage(orderCode, status, orderTotal)).catch(() => undefined);
    }
    notifyAdminNewOrder(orderCode, orderTotal, itemsCount) {
        const chatId = process.env.ADMIN_TELEGRAM_CHAT_ID;
        if (!chatId)
            return;
        const text = `🆕 <b>Yangi buyurtma!</b>\n` +
            `📦 <code>${orderCode}</code>\n` +
            `🛒 Mahsulotlar: ${itemsCount} ta\n` +
            `💰 Summa: ${this.formatAmount(orderTotal)}`;
        this.sendRaw(chatId, text).catch(() => undefined);
    }
    buildMessage(orderCode, status, orderTotal) {
        const lines = [
            `🛋 <b>Zinfurn</b> — buyurtma yangilandi`,
            `📦 Buyurtma: <code>${orderCode}</code>`,
            `Holat: <b>${this.STATUS_TEXT[status] ?? status}</b>`,
        ];
        if (orderTotal)
            lines.push(`💰 Summa: ${this.formatAmount(orderTotal)}`);
        lines.push(`\n🔗 zinfurn.uz/mypage?category=myOrders`);
        return lines.join('\n');
    }
    formatAmount(n) {
        return `₩${Math.round(n).toLocaleString('en-US')}`;
    }
    async send(memberId, text) {
        try {
            const member = await this.memberModel.findById(memberId).select('memberTelegramId').exec();
            if (!member?.memberTelegramId)
                return;
            await this.sendRaw(member.memberTelegramId, text);
        }
        catch (err) {
            this.logger.warn(`Telegram notify skipped: ${err?.message || err}`);
        }
    }
    async sendRaw(chatId, text) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token)
            return;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        try {
            const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
                signal: controller.signal,
            });
            if (!res.ok) {
                const body = await res.text();
                this.logger.warn(`Telegram sendMessage ${res.status}: ${body.slice(0, 120)}`);
            }
        }
        finally {
            clearTimeout(timer);
        }
    }
};
exports.TelegramNotifyService = TelegramNotifyService;
exports.TelegramNotifyService = TelegramNotifyService = TelegramNotifyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Member')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TelegramNotifyService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/property/property.module.ts":
/*!*********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/property/property.module.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const property_resolver_1 = __webpack_require__(/*! ./property.resolver */ "./apps/zinfurn-api/src/components/property/property.resolver.ts");
const property_service_1 = __webpack_require__(/*! ./property.service */ "./apps/zinfurn-api/src/components/property/property.service.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const Property_model_1 = __webpack_require__(/*! ../../schemas/Property.model */ "./apps/zinfurn-api/src/schemas/Property.model.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const view_module_1 = __webpack_require__(/*! ../view/view.module */ "./apps/zinfurn-api/src/components/view/view.module.ts");
const member_module_1 = __webpack_require__(/*! ../member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
const like_module_1 = __webpack_require__(/*! ../like/like.module */ "./apps/zinfurn-api/src/components/like/like.module.ts");
const translation_module_1 = __webpack_require__(/*! ../translation/translation.module */ "./apps/zinfurn-api/src/components/translation/translation.module.ts");
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
            translation_module_1.TranslationModule,
        ],
        providers: [property_resolver_1.PropertyResolver, property_service_1.PropertyService],
        exports: [property_service_1.PropertyService],
    })
], PropertyModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/property/property.resolver.ts":
/*!***********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/property/property.resolver.ts ***!
  \***********************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const property_service_1 = __webpack_require__(/*! ./property.service */ "./apps/zinfurn-api/src/components/property/property.service.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const property_1 = __webpack_require__(/*! ../../libs/dto/property/property */ "./apps/zinfurn-api/src/libs/dto/property/property.ts");
const property_input_1 = __webpack_require__(/*! ../../libs/dto/property/property.input */ "./apps/zinfurn-api/src/libs/dto/property/property.input.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const property_update_1 = __webpack_require__(/*! ../../libs/dto/property/property.update */ "./apps/zinfurn-api/src/libs/dto/property/property.update.ts");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
let PropertyResolver = class PropertyResolver {
    propertyService;
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async createProperty(input, memberId) {
        input.memberId = memberId;
        return await this.propertyService.createProperty(input);
    }
    async getProperty(input, memberId) {
        const propertyId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.propertyService.getProperty(memberId, propertyId);
    }
    async updateProperty(input, memberId) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.propertyService.updateProperty(memberId, input);
    }
    async getProperties(input, memberId) {
        return await this.propertyService.getProperties(memberId, input);
    }
    async getFavorites(input, memberId) {
        return await this.propertyService.getFavorites(memberId, input);
    }
    async getVisited(input, memberId) {
        return await this.propertyService.getVisited(memberId, input);
    }
    async getAgentProperties(input, memberId) {
        return await this.propertyService.getAgentProperties(memberId, input);
    }
    async likeTargetProperty(input, memberId) {
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.propertyService.likeTargetProperty(memberId, likeRefId);
    }
    async getAllPropertiesByAdmin(input, memberId) {
        return await this.propertyService.getAllPropertiesByAdmin(input);
    }
    async updatePropertyByAdmin(input) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.propertyService.updatePropertyByAdmin(input);
    }
    async removePropertyByAdmin(input) {
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

/***/ "./apps/zinfurn-api/src/components/property/property.service.ts":
/*!**********************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/property/property.service.ts ***!
  \**********************************************************************/
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
exports.PropertyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const member_service_1 = __webpack_require__(/*! ../member/member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const view_service_1 = __webpack_require__(/*! ../view/view.service */ "./apps/zinfurn-api/src/components/view/view.service.ts");
const property_enum_1 = __webpack_require__(/*! ../../libs/enums/property.enum */ "./apps/zinfurn-api/src/libs/enums/property.enum.ts");
const view_enum_1 = __webpack_require__(/*! ../../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
const moment = __webpack_require__(/*! moment */ "moment");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const like_enum_1 = __webpack_require__(/*! ../../libs/enums/like.enum */ "./apps/zinfurn-api/src/libs/enums/like.enum.ts");
const like_service_1 = __webpack_require__(/*! ../like/like.service */ "./apps/zinfurn-api/src/components/like/like.service.ts");
const translation_service_1 = __webpack_require__(/*! ../translation/translation.service */ "./apps/zinfurn-api/src/components/translation/translation.service.ts");
let PropertyService = class PropertyService {
    propertyModel;
    memberService;
    viewService;
    likeService;
    translationService;
    constructor(propertyModel, memberService, viewService, likeService, translationService) {
        this.propertyModel = propertyModel;
        this.memberService = memberService;
        this.viewService = viewService;
        this.likeService = likeService;
        this.translationService = translationService;
    }
    async createProperty(input) {
        try {
            const propertyData = {
                ...input,
                propertyInStock: true,
            };
            try {
                const translations = await this.translationService.translateProperty(input.propertyTitle, input.propertyDesc);
                if (translations)
                    propertyData.propertyTranslations = translations;
            }
            catch (e) {
                common_1.Logger.warn('Tarjima o\'tkazib yuborildi (create)');
            }
            const result = await this.propertyModel.create(propertyData);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: 1,
            });
            return result;
        }
        catch (err) {
            common_1.Logger.error("Error, Service.model:", err.message);
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
        if (input.propertyTitle !== undefined || input.propertyDesc !== undefined) {
            try {
                const existing = await this.propertyModel.findOne(search).lean().exec();
                const title = input.propertyTitle ?? existing?.propertyTitle;
                const desc = input.propertyDesc ?? existing?.propertyDesc;
                if (title) {
                    const translations = await this.translationService.translateProperty(title, desc);
                    if (translations)
                        input.propertyTranslations = translations;
                }
            }
            catch (e) {
                common_1.Logger.warn('Tarjima o\'tkazib yuborildi (update)');
            }
        }
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
        const { memberId, categoryList, typeList, conditionList, materialList, colorList, pricesRange, options, text, propertyIsOnSale, } = input.search;
        if (propertyIsOnSale) {
            match.propertyIsOnSale = true;
            match.propertySaleExpiresAt = { $gt: new Date() };
        }
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
            match.propertyTitle = (0, config_1.buildSearchRegex)(text);
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
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _c : Object, typeof (_d = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _d : Object, typeof (_e = typeof translation_service_1.TranslationService !== "undefined" && translation_service_1.TranslationService) === "function" ? _e : Object])
], PropertyService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/repair-property/repair-property.module.ts":
/*!***********************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/repair-property/repair-property.module.ts ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const repair_property_service_1 = __webpack_require__(/*! ./repair-property.service */ "./apps/zinfurn-api/src/components/repair-property/repair-property.service.ts");
const repair_property_resolver_1 = __webpack_require__(/*! ./repair-property.resolver */ "./apps/zinfurn-api/src/components/repair-property/repair-property.resolver.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const RepairProperty_1 = __webpack_require__(/*! ../../schemas/RepairProperty */ "./apps/zinfurn-api/src/schemas/RepairProperty.ts");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const view_module_1 = __webpack_require__(/*! ../view/view.module */ "./apps/zinfurn-api/src/components/view/view.module.ts");
const member_module_1 = __webpack_require__(/*! ../member/member.module */ "./apps/zinfurn-api/src/components/member/member.module.ts");
const like_module_1 = __webpack_require__(/*! ../like/like.module */ "./apps/zinfurn-api/src/components/like/like.module.ts");
const translation_module_1 = __webpack_require__(/*! ../translation/translation.module */ "./apps/zinfurn-api/src/components/translation/translation.module.ts");
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
            translation_module_1.TranslationModule,
        ],
        providers: [repair_property_service_1.RepairPropertyService, repair_property_resolver_1.RepairPropertyResolver],
        exports: [repair_property_service_1.RepairPropertyService]
    })
], RepairPropertyModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/repair-property/repair-property.resolver.ts":
/*!*************************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/repair-property/repair-property.resolver.ts ***!
  \*************************************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const repair_property_service_1 = __webpack_require__(/*! ./repair-property.service */ "./apps/zinfurn-api/src/components/repair-property/repair-property.service.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const repairProperty_1 = __webpack_require__(/*! ../../libs/dto/repairProperty/repairProperty */ "./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const repairProperty_input_1 = __webpack_require__(/*! ../../libs/dto/repairProperty/repairProperty.input */ "./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.input.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const repairProperty_update_1 = __webpack_require__(/*! ../../libs/dto/repairProperty/repairProperty.update */ "./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.update.ts");
let RepairPropertyResolver = class RepairPropertyResolver {
    repairPropertyService;
    constructor(repairPropertyService) {
        this.repairPropertyService = repairPropertyService;
    }
    async createRepairProperty(input, memberId) {
        input.memberId = memberId;
        return await this.repairPropertyService.createRepairProperty(input);
    }
    async getRepairProperty(input, memberId) {
        const repairId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.repairPropertyService.getRepairProperty(memberId, repairId);
    }
    async getRepairProperties(input, memberId) {
        return await this.repairPropertyService.getRepairProperties(memberId, input);
    }
    async getTechnicianProperties(input, memberId) {
        return await this.repairPropertyService.getTechnicianProperties(memberId, input);
    }
    async getRepairFavorites(input, memberId) {
        return await this.repairPropertyService.getRepairFavorites(memberId, input);
    }
    async getRepairVisited(input, memberId) {
        return await this.repairPropertyService.getRepairVisited(memberId, input);
    }
    async likeTargetRepairProperty(input, memberId) {
        const likeRefId = (0, config_1.ShapeIntoMongoObjectId)(input);
        return await this.repairPropertyService.likeTargetRepairProperty(memberId, likeRefId);
    }
    async getAllRepairPropertiesByAdmin(input, memberId) {
        return await this.repairPropertyService.getAllRepairPropertiesByAdmin(input);
    }
    async updateRepairPropertyByAdmin(input) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return await this.repairPropertyService.updateRepairPropertyByAdmin(input);
    }
    async removeRepairPropertyByAdmin(input) {
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

/***/ "./apps/zinfurn-api/src/components/repair-property/repair-property.service.ts":
/*!************************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/repair-property/repair-property.service.ts ***!
  \************************************************************************************/
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
exports.RepairPropertyService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const member_service_1 = __webpack_require__(/*! ../member/member.service */ "./apps/zinfurn-api/src/components/member/member.service.ts");
const view_service_1 = __webpack_require__(/*! ../view/view.service */ "./apps/zinfurn-api/src/components/view/view.service.ts");
const like_service_1 = __webpack_require__(/*! ../like/like.service */ "./apps/zinfurn-api/src/components/like/like.service.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const view_enum_1 = __webpack_require__(/*! ../../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
const like_enum_1 = __webpack_require__(/*! ../../libs/enums/like.enum */ "./apps/zinfurn-api/src/libs/enums/like.enum.ts");
const repairProperty_enum_1 = __webpack_require__(/*! ../../libs/enums/repairProperty.enum */ "./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const moment = __webpack_require__(/*! moment */ "moment");
const translation_service_1 = __webpack_require__(/*! ../translation/translation.service */ "./apps/zinfurn-api/src/components/translation/translation.service.ts");
let RepairPropertyService = class RepairPropertyService {
    repairPropertyModel;
    memberService;
    viewService;
    likeService;
    translationService;
    constructor(repairPropertyModel, memberService, viewService, likeService, translationService) {
        this.repairPropertyModel = repairPropertyModel;
        this.memberService = memberService;
        this.viewService = viewService;
        this.likeService = likeService;
        this.translationService = translationService;
    }
    async createRepairProperty(input) {
        try {
            const data = { ...input };
            try {
                const translations = await this.translationService.translateArticle(input.repairPropertyDescription, '');
                if (translations)
                    data.repairPropertyTranslations = translations;
            }
            catch (e) {
                common_1.Logger.warn('Tarjima o\'tkazib yuborildi (repair create)');
            }
            const result = await this.repairPropertyModel.create(data);
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberProperties',
                modifier: 1,
            });
            return result;
        }
        catch (err) {
            common_1.Logger.error("Error, Service.model:", err.message);
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
            const newView = await this.viewService.recordView(viewInput);
            if (newView) {
                await this.repairPropertyStatsEditor({ _id: repairId, targetKey: 'repairPropertyViews', modifier: 1 });
                targetProperty.repairPropertyViews++;
            }
            const LikeInput = { memberId: memberId, likeRefId: repairId, likeGroup: like_enum_1.LikeGroup.REPAIR_PROPERTY };
            targetProperty.meLiked = await this.likeService.checkLikeExistence(LikeInput);
        }
        targetProperty.memberData = await this.memberService.getMember(null, targetProperty.memberId);
        return targetProperty;
    }
    async getRepairProperties(memberId, input) {
        const match = { repairPropertyStatus: repairProperty_enum_1.RepairPropertyStatus.ACTIVE };
        const sort = { [input?.sort ?? 'createdAt']: input?.direction ?? common_enum_1.Direction.DESC };
        this.shapeMatchQuery(match, input);
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
            match.propertyTitle = (0, config_1.buildSearchRegex)(text);
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
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof member_service_1.MemberService !== "undefined" && member_service_1.MemberService) === "function" ? _b : Object, typeof (_c = typeof view_service_1.ViewService !== "undefined" && view_service_1.ViewService) === "function" ? _c : Object, typeof (_d = typeof like_service_1.LikeService !== "undefined" && like_service_1.LikeService) === "function" ? _d : Object, typeof (_e = typeof translation_service_1.TranslationService !== "undefined" && translation_service_1.TranslationService) === "function" ? _e : Object])
], RepairPropertyService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/review/review.module.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/review/review.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const auth_module_1 = __webpack_require__(/*! ../auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const Review_model_1 = __webpack_require__(/*! ../../schemas/Review.model */ "./apps/zinfurn-api/src/schemas/Review.model.ts");
const Order_model_1 = __webpack_require__(/*! ../../schemas/Order.model */ "./apps/zinfurn-api/src/schemas/Order.model.ts");
const Property_model_1 = __webpack_require__(/*! ../../schemas/Property.model */ "./apps/zinfurn-api/src/schemas/Property.model.ts");
const review_resolver_1 = __webpack_require__(/*! ./review.resolver */ "./apps/zinfurn-api/src/components/review/review.resolver.ts");
const review_service_1 = __webpack_require__(/*! ./review.service */ "./apps/zinfurn-api/src/components/review/review.service.ts");
let ReviewModule = class ReviewModule {
};
exports.ReviewModule = ReviewModule;
exports.ReviewModule = ReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Review', schema: Review_model_1.default },
                { name: 'Order', schema: Order_model_1.default },
                { name: 'Property', schema: Property_model_1.default },
            ]),
            auth_module_1.AuthModule,
        ],
        providers: [review_resolver_1.ReviewResolver, review_service_1.ReviewService],
        exports: [review_service_1.ReviewService],
    })
], ReviewModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/review/review.resolver.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/review/review.resolver.ts ***!
  \*******************************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewResolver = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_guard_1 = __webpack_require__(/*! ../auth/guards/auth.guard */ "./apps/zinfurn-api/src/components/auth/guards/auth.guard.ts");
const without_guard_1 = __webpack_require__(/*! ../auth/guards/without.guard */ "./apps/zinfurn-api/src/components/auth/guards/without.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./apps/zinfurn-api/src/components/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/roles.decorator.ts");
const authMember_decorator_1 = __webpack_require__(/*! ../auth/decorators/authMember.decorator */ "./apps/zinfurn-api/src/components/auth/decorators/authMember.decorator.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
const member_enum_1 = __webpack_require__(/*! ../../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const review_1 = __webpack_require__(/*! ../../libs/dto/review/review */ "./apps/zinfurn-api/src/libs/dto/review/review.ts");
const review_input_1 = __webpack_require__(/*! ../../libs/dto/review/review.input */ "./apps/zinfurn-api/src/libs/dto/review/review.input.ts");
const review_update_1 = __webpack_require__(/*! ../../libs/dto/review/review.update */ "./apps/zinfurn-api/src/libs/dto/review/review.update.ts");
const review_enum_1 = __webpack_require__(/*! ../../libs/enums/review.enum */ "./apps/zinfurn-api/src/libs/enums/review.enum.ts");
const review_service_1 = __webpack_require__(/*! ./review.service */ "./apps/zinfurn-api/src/components/review/review.service.ts");
let ReviewResolver = class ReviewResolver {
    reviewService;
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    async createReview(input, memberId) {
        input.propertyId = (0, config_1.ShapeIntoMongoObjectId)(input.propertyId);
        input.orderId = (0, config_1.ShapeIntoMongoObjectId)(input.orderId);
        return this.reviewService.createReview(memberId, input);
    }
    async getPropertyReviews(input, memberId) {
        input.search.propertyId = (0, config_1.ShapeIntoMongoObjectId)(input.search.propertyId);
        return this.reviewService.getPropertyReviews(input, memberId);
    }
    async toggleReviewReaction(reviewId, reaction, memberId) {
        return this.reviewService.toggleReviewReaction(memberId, (0, config_1.ShapeIntoMongoObjectId)(reviewId), reaction);
    }
    async getPropertyReviewSummary(propertyId) {
        return this.reviewService.getPropertyReviewSummary((0, config_1.ShapeIntoMongoObjectId)(propertyId));
    }
    async updateReview(input, memberId) {
        input._id = (0, config_1.ShapeIntoMongoObjectId)(input._id);
        return this.reviewService.updateReview(memberId, input);
    }
    async removeReviewByAdmin(reviewId) {
        return this.reviewService.removeReviewByAdmin((0, config_1.ShapeIntoMongoObjectId)(reviewId));
    }
};
exports.ReviewResolver = ReviewResolver;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => review_1.Review),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof review_input_1.CreateReviewInput !== "undefined" && review_input_1.CreateReviewInput) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object]),
    __metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], ReviewResolver.prototype, "createReview", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => review_1.Reviews),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof review_input_1.ReviewsInquiry !== "undefined" && review_input_1.ReviewsInquiry) === "function" ? _e : Object, typeof (_f = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ReviewResolver.prototype, "getPropertyReviews", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => review_1.ReviewReactionResult),
    __param(0, (0, graphql_1.Args)('reviewId')),
    __param(1, (0, graphql_1.Args)('reaction', { type: () => review_enum_1.ReviewReaction })),
    __param(2, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof review_enum_1.ReviewReaction !== "undefined" && review_enum_1.ReviewReaction) === "function" ? _h : Object, typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ReviewResolver.prototype, "toggleReviewReaction", null);
__decorate([
    (0, common_1.UseGuards)(without_guard_1.WithoutGuard),
    (0, graphql_1.Query)(() => review_1.ReviewSummary),
    __param(0, (0, graphql_1.Args)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], ReviewResolver.prototype, "getPropertyReviewSummary", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, graphql_1.Mutation)(() => review_1.Review),
    __param(0, (0, graphql_1.Args)('input')),
    __param(1, (0, authMember_decorator_1.AuthMember)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof review_update_1.ReviewUpdate !== "undefined" && review_update_1.ReviewUpdate) === "function" ? _m : Object, typeof (_o = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _o : Object]),
    __metadata("design:returntype", typeof (_p = typeof Promise !== "undefined" && Promise) === "function" ? _p : Object)
], ReviewResolver.prototype, "updateReview", null);
__decorate([
    (0, roles_decorator_1.Roles)(member_enum_1.MemberType.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => review_1.Review),
    __param(0, (0, graphql_1.Args)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", typeof (_q = typeof Promise !== "undefined" && Promise) === "function" ? _q : Object)
], ReviewResolver.prototype, "removeReviewByAdmin", null);
exports.ReviewResolver = ReviewResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [typeof (_a = typeof review_service_1.ReviewService !== "undefined" && review_service_1.ReviewService) === "function" ? _a : Object])
], ReviewResolver);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/review/review.service.ts":
/*!******************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/review/review.service.ts ***!
  \******************************************************************/
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const review_enum_1 = __webpack_require__(/*! ../../libs/enums/review.enum */ "./apps/zinfurn-api/src/libs/enums/review.enum.ts");
const order_enum_1 = __webpack_require__(/*! ../../libs/enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../libs/enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
let ReviewService = class ReviewService {
    reviewModel;
    orderModel;
    propertyModel;
    constructor(reviewModel, orderModel, propertyModel) {
        this.reviewModel = reviewModel;
        this.orderModel = orderModel;
        this.propertyModel = propertyModel;
    }
    async createReview(memberId, input) {
        const order = await this.orderModel.findOne({
            _id: input.orderId,
            memberId,
            orderStatus: order_enum_1.OrderStatus.CONFIRMED,
        });
        if (!order)
            throw new common_1.BadRequestException('Order must be confirmed before writing a review');
        const existing = await this.reviewModel.findOne({
            memberId,
            propertyId: input.propertyId,
            orderId: input.orderId,
        });
        if (existing)
            throw new common_1.BadRequestException('You already reviewed this order item');
        input.memberId = memberId;
        try {
            const review = await this.reviewModel.create(input);
            const avgResult = await this.reviewModel.aggregate([
                { $match: { propertyId: input.propertyId, reviewStatus: review_enum_1.ReviewStatus.ACTIVE } },
                { $group: { _id: null, avg: { $avg: '$reviewRating' } } },
            ]).exec();
            const newRating = avgResult[0] ? Math.round(avgResult[0].avg * 10) / 10 : 0;
            await this.propertyModel.findByIdAndUpdate(input.propertyId, {
                $inc: { propertyReviews: 1 },
                propertyRating: newRating,
            });
            return review;
        }
        catch (err) {
            common_1.Logger.error('ReviewService.createReview error:', err.message);
            throw new common_1.BadRequestException(common_enum_1.Message.CREATE_FAILED);
        }
    }
    async getPropertyReviews(input, memberId) {
        const { page, limit, sort, direction, search } = input;
        const match = {
            propertyId: search.propertyId,
            reviewStatus: review_enum_1.ReviewStatus.ACTIVE,
        };
        const sortBy = { [sort ?? 'createdAt']: direction ?? common_enum_1.Direction.DESC };
        const result = await this.reviewModel
            .aggregate([
            { $match: match },
            { $sort: sortBy },
            {
                $facet: {
                    list: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        config_1.lookupMember,
                        { $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
                        {
                            $addFields: {
                                likesCount: { $size: { $ifNull: ['$reviewLikes', []] } },
                                dislikesCount: { $size: { $ifNull: ['$reviewDislikes', []] } },
                                myReaction: {
                                    $cond: [
                                        { $in: [memberId ?? null, { $ifNull: ['$reviewLikes', []] }] },
                                        review_enum_1.ReviewReaction.LIKE,
                                        {
                                            $cond: [
                                                { $in: [memberId ?? null, { $ifNull: ['$reviewDislikes', []] }] },
                                                review_enum_1.ReviewReaction.DISLIKE,
                                                null,
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    metaCounter: [{ $count: 'total' }],
                },
            },
        ])
            .exec();
        return result[0];
    }
    async toggleReviewReaction(memberId, reviewId, reaction) {
        const review = await this.reviewModel.findOne({ _id: reviewId, reviewStatus: review_enum_1.ReviewStatus.ACTIVE });
        if (!review)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        const me = String(memberId);
        let likes = (review.get('reviewLikes') ?? []).map((id) => String(id));
        let dislikes = (review.get('reviewDislikes') ?? []).map((id) => String(id));
        if (reaction === review_enum_1.ReviewReaction.LIKE) {
            if (likes.includes(me)) {
                likes = likes.filter((id) => id !== me);
            }
            else {
                likes.push(me);
                dislikes = dislikes.filter((id) => id !== me);
            }
        }
        else {
            if (dislikes.includes(me)) {
                dislikes = dislikes.filter((id) => id !== me);
            }
            else {
                dislikes.push(me);
                likes = likes.filter((id) => id !== me);
            }
        }
        await this.reviewModel.findByIdAndUpdate(reviewId, {
            reviewLikes: likes,
            reviewDislikes: dislikes,
        });
        return {
            _id: reviewId,
            likesCount: likes.length,
            dislikesCount: dislikes.length,
            myReaction: likes.includes(me)
                ? review_enum_1.ReviewReaction.LIKE
                : dislikes.includes(me)
                    ? review_enum_1.ReviewReaction.DISLIKE
                    : undefined,
        };
    }
    async getPropertyReviewSummary(propertyId) {
        const result = await this.reviewModel
            .aggregate([
            { $match: { propertyId, reviewStatus: review_enum_1.ReviewStatus.ACTIVE } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$reviewRating' },
                    totalReviews: { $sum: 1 },
                    r1: { $sum: { $cond: [{ $eq: ['$reviewRating', 1] }, 1, 0] } },
                    r2: { $sum: { $cond: [{ $eq: ['$reviewRating', 2] }, 1, 0] } },
                    r3: { $sum: { $cond: [{ $eq: ['$reviewRating', 3] }, 1, 0] } },
                    r4: { $sum: { $cond: [{ $eq: ['$reviewRating', 4] }, 1, 0] } },
                    r5: { $sum: { $cond: [{ $eq: ['$reviewRating', 5] }, 1, 0] } },
                },
            },
        ])
            .exec();
        if (!result[0])
            return { averageRating: 0, totalReviews: 0, ratingDistribution: [] };
        const r = result[0];
        return {
            averageRating: Math.round(r.averageRating * 10) / 10,
            totalReviews: r.totalReviews,
            ratingDistribution: [
                { star: 5, count: r.r5 },
                { star: 4, count: r.r4 },
                { star: 3, count: r.r3 },
                { star: 2, count: r.r2 },
                { star: 1, count: r.r1 },
            ],
        };
    }
    async updateReview(memberId, input) {
        const review = await this.reviewModel.findOne({ _id: input._id, memberId });
        if (!review)
            throw new common_1.BadRequestException(common_enum_1.Message.NO_DATA_FOUND);
        return this.reviewModel.findByIdAndUpdate(input._id, input, { new: true });
    }
    async removeReviewByAdmin(reviewId) {
        return this.reviewModel.findByIdAndUpdate(reviewId, { reviewStatus: review_enum_1.ReviewStatus.DELETE }, { new: true });
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Review')),
    __param(1, (0, mongoose_1.InjectModel)('Order')),
    __param(2, (0, mongoose_1.InjectModel)('Property')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], ReviewService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/translation/translation.module.ts":
/*!***************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/translation/translation.module.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const translation_service_1 = __webpack_require__(/*! ./translation.service */ "./apps/zinfurn-api/src/components/translation/translation.service.ts");
let TranslationModule = class TranslationModule {
};
exports.TranslationModule = TranslationModule;
exports.TranslationModule = TranslationModule = __decorate([
    (0, common_1.Module)({
        providers: [translation_service_1.TranslationService],
        exports: [translation_service_1.TranslationService],
    })
], TranslationModule);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/translation/translation.service.ts":
/*!****************************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/translation/translation.service.ts ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TranslationService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationService = exports.SUPPORTED_LOCALES = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
exports.SUPPORTED_LOCALES = ['uz', 'en', 'ru', 'kr', 'ar'];
const LOCALE_NAMES = {
    uz: 'Uzbek',
    en: 'English',
    ru: 'Russian',
    kr: 'Korean',
    ar: 'Arabic',
};
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GEMINI_MODEL = 'gemini-2.5-flash';
const TRANSLATE_TIMEOUT_MS = 15000;
let TranslationService = TranslationService_1 = class TranslationService {
    logger = new common_1.Logger(TranslationService_1.name);
    buildPrompt(title, desc) {
        const langs = exports.SUPPORTED_LOCALES.map((k) => `${LOCALE_NAMES[k]} (${k})`).join(', ');
        return `You are a translator for a furniture e-commerce store.
Translate the product TITLE and DESCRIPTION into these languages: ${langs}.

STRICT RULES:
- Keep brand names, model names and proper nouns UNCHANGED (do NOT translate them). Translate ONLY the common/descriptive words.
  Example: "Alhambra Pool Table" -> uz: "Alhambra bilyard stoli", ru: "Бильярдный стол Alhambra".
- Keep numbers, units and measurements as-is.
- Natural, concise translation. Do not add words that are not in the source.
- If description is empty, return empty string for desc.

TITLE: ${title}
DESCRIPTION: ${desc || ''}`;
    }
    buildResponseSchema() {
        const item = {
            type: 'OBJECT',
            properties: { title: { type: 'STRING' }, desc: { type: 'STRING' } },
            required: ['title', 'desc'],
        };
        return {
            type: 'OBJECT',
            properties: Object.fromEntries(exports.SUPPORTED_LOCALES.map((k) => [k, item])),
            required: [...exports.SUPPORTED_LOCALES],
        };
    }
    buildArticlePrompt(title, content) {
        const langs = exports.SUPPORTED_LOCALES.map((k) => `${LOCALE_NAMES[k]} (${k})`).join(', ');
        return `You are a translator for a furniture blog / community.
Translate the article TITLE and CONTENT into these languages: ${langs}.

STRICT RULES:
- Keep brand names, product/model names and proper nouns UNCHANGED. Translate only the readable text.
- Keep the meaning faithful and natural. Do not summarize or add content.
- Keep numbers as-is.
- If content is empty, return empty string for desc.

TITLE: ${title}
CONTENT: ${content || ''}`;
    }
    async translateProperty(title, desc) {
        if (!title || !title.trim())
            return null;
        return this.run(this.buildPrompt(title, desc || ''));
    }
    async translateArticle(title, content) {
        if (!title || !title.trim())
            return null;
        return this.run(this.buildArticlePrompt(title, content || ''));
    }
    async run(prompt) {
        if (process.env.GROQ_API_KEY) {
            const viaGroq = await this.runGroq(prompt);
            if (viaGroq)
                return viaGroq;
            this.logger.warn('Groq tarjima bermadi — Gemini fallback urinilyapti');
        }
        return this.runGemini(prompt);
    }
    async runGroq(prompt) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
        try {
            const jsonShape = exports.SUPPORTED_LOCALES.map((k) => `"${k}": {"title": "...", "desc": "..."}`).join(', ');
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        { role: 'system', content: `Respond ONLY with a JSON object exactly in this shape: {${jsonShape}}` },
                        { role: 'user', content: prompt },
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.2,
                }),
                signal: controller.signal,
            });
            if (!res.ok) {
                const errText = await res.text();
                this.logger.warn(`Groq tarjima xato (${res.status}): ${errText.slice(0, 200)}`);
                return null;
            }
            const data = await res.json();
            const raw = data?.choices?.[0]?.message?.content;
            if (!raw)
                return null;
            return this.cleanParsed(JSON.parse(raw));
        }
        catch (err) {
            this.logger.warn(`Groq tarjima bajarilmadi: ${err?.message || err}`);
            return null;
        }
        finally {
            clearTimeout(timer);
        }
    }
    cleanParsed(parsed) {
        const clean = {};
        for (const loc of exports.SUPPORTED_LOCALES) {
            if (parsed[loc]?.title)
                clean[loc] = { title: parsed[loc].title, desc: parsed[loc].desc || '' };
        }
        return Object.keys(clean).length ? clean : null;
    }
    async runGemini(prompt) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            this.logger.warn('GEMINI_API_KEY topilmadi — tarjima o\'tkazib yuborildi');
            return null;
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), TRANSLATE_TIMEOUT_MS);
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        responseSchema: this.buildResponseSchema(),
                        temperature: 0.2,
                    },
                }),
                signal: controller.signal,
            });
            if (!res.ok) {
                const errText = await res.text();
                this.logger.warn(`Gemini tarjima xato (${res.status}): ${errText.slice(0, 200)}`);
                return null;
            }
            const data = await res.json();
            const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!raw)
                return null;
            return this.cleanParsed(JSON.parse(raw));
        }
        catch (err) {
            this.logger.warn(`Tarjima bajarilmadi: ${err?.message || err}`);
            return null;
        }
        finally {
            clearTimeout(timer);
        }
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = TranslationService_1 = __decorate([
    (0, common_1.Injectable)()
], TranslationService);


/***/ }),

/***/ "./apps/zinfurn-api/src/components/view/view.module.ts":
/*!*************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/view/view.module.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const view_service_1 = __webpack_require__(/*! ./view.service */ "./apps/zinfurn-api/src/components/view/view.service.ts");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const View_model_1 = __webpack_require__(/*! ../../schemas/View.model */ "./apps/zinfurn-api/src/schemas/View.model.ts");
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

/***/ "./apps/zinfurn-api/src/components/view/view.service.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/components/view/view.service.ts ***!
  \**************************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const view_enum_1 = __webpack_require__(/*! ../../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
const config_1 = __webpack_require__(/*! ../../libs/config */ "./apps/zinfurn-api/src/libs/config.ts");
let ViewService = class ViewService {
    viewModel;
    constructor(viewModel) {
        this.viewModel = viewModel;
    }
    async recordView(input) {
        const viewExist = await this.checkViewExistence(input);
        if (!viewExist) {
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

/***/ "./apps/zinfurn-api/src/database/database.module.ts":
/*!**********************************************************!*\
  !*** ./apps/zinfurn-api/src/database/database.module.ts ***!
  \**********************************************************/
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
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let DatabaseModule = class DatabaseModule {
    connection;
    constructor(connection) {
        this.connection = connection;
        const logger = new common_1.Logger('Database');
        if (connection.readyState === 1) {
            logger.log(`MongoDB connected (${process.env.NODE_ENV === 'production' ? 'production' : 'development'})`);
        }
        else {
            logger.error('DB is not connected!');
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

/***/ "./apps/zinfurn-api/src/libs/config.ts":
/*!*********************************************!*\
  !*** ./apps/zinfurn-api/src/libs/config.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lookupRepairVisit = exports.lookupVisit = exports.lookupRepairFavorite = exports.lookupFavorite = exports.lookupFollowerData = exports.lookupFollowingData = exports.lookupMember = exports.lookupAuthMemberFollowed = exports.lookupAuthMemberLiked = exports.buildSearchRegex = exports.ShapeIntoMongoObjectId = exports.getSerialForImage = exports.validMimeTypes = exports.availableCommentSorts = exports.availableBoardArticleSorts = exports.availableRepairPropertySorts = exports.availablePropertySorts = exports.availableOptions = exports.availableMemberSorts = exports.availableTechnician = exports.availableAgentSorts = void 0;
const bson_1 = __webpack_require__(/*! bson */ "bson");
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
    'propertySaleExpiresAt',
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
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const path = __webpack_require__(/*! path */ "path");
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
const buildSearchRegex = (text) => {
    const escaped = String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return { $regex: escaped, $options: 'i' };
};
exports.buildSearchRegex = buildSearchRegex;
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

/***/ "./apps/zinfurn-api/src/libs/dto/board-article/board-article.input.ts":
/*!****************************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/board-article/board-article.input.ts ***!
  \****************************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const board_article_enum_1 = __webpack_require__(/*! ../../enums/board-article.enum */ "./apps/zinfurn-api/src/libs/enums/board-article.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const config_1 = __webpack_require__(/*! ../../config */ "./apps/zinfurn-api/src/libs/config.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/board-article/board-article.ts":
/*!**********************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/board-article/board-article.ts ***!
  \**********************************************************************/
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
exports.BoardArticles = exports.BoardArticle = exports.ArticleTranslations = exports.ArticleI18n = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const board_article_enum_1 = __webpack_require__(/*! ../../enums/board-article.enum */ "./apps/zinfurn-api/src/libs/enums/board-article.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
const like_1 = __webpack_require__(/*! ../like/like */ "./apps/zinfurn-api/src/libs/dto/like/like.ts");
let ArticleI18n = class ArticleI18n {
    title;
    desc;
};
exports.ArticleI18n = ArticleI18n;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ArticleI18n.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ArticleI18n.prototype, "desc", void 0);
exports.ArticleI18n = ArticleI18n = __decorate([
    (0, graphql_1.ObjectType)()
], ArticleI18n);
let ArticleTranslations = class ArticleTranslations {
    uz;
    en;
    ru;
    kr;
    ar;
};
exports.ArticleTranslations = ArticleTranslations;
__decorate([
    (0, graphql_1.Field)(() => ArticleI18n, { nullable: true }),
    __metadata("design:type", ArticleI18n)
], ArticleTranslations.prototype, "uz", void 0);
__decorate([
    (0, graphql_1.Field)(() => ArticleI18n, { nullable: true }),
    __metadata("design:type", ArticleI18n)
], ArticleTranslations.prototype, "en", void 0);
__decorate([
    (0, graphql_1.Field)(() => ArticleI18n, { nullable: true }),
    __metadata("design:type", ArticleI18n)
], ArticleTranslations.prototype, "ru", void 0);
__decorate([
    (0, graphql_1.Field)(() => ArticleI18n, { nullable: true }),
    __metadata("design:type", ArticleI18n)
], ArticleTranslations.prototype, "kr", void 0);
__decorate([
    (0, graphql_1.Field)(() => ArticleI18n, { nullable: true }),
    __metadata("design:type", ArticleI18n)
], ArticleTranslations.prototype, "ar", void 0);
exports.ArticleTranslations = ArticleTranslations = __decorate([
    (0, graphql_1.ObjectType)()
], ArticleTranslations);
let BoardArticle = class BoardArticle {
    _id;
    articleCategory;
    articleStatus;
    articleTitle;
    articleContent;
    articleImage;
    articleTranslations;
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
    (0, graphql_1.Field)(() => ArticleTranslations, { nullable: true }),
    __metadata("design:type", ArticleTranslations)
], BoardArticle.prototype, "articleTranslations", void 0);
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

/***/ "./apps/zinfurn-api/src/libs/dto/board-article/board-article.update.ts":
/*!*****************************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/board-article/board-article.update.ts ***!
  \*****************************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const board_article_enum_1 = __webpack_require__(/*! ../../enums/board-article.enum */ "./apps/zinfurn-api/src/libs/enums/board-article.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
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

/***/ "./apps/zinfurn-api/src/libs/dto/comment/comment.input.ts":
/*!****************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/comment/comment.input.ts ***!
  \****************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const comment_enum_1 = __webpack_require__(/*! ../../enums/comment.enum */ "./apps/zinfurn-api/src/libs/enums/comment.enum.ts");
const config_1 = __webpack_require__(/*! ../../config */ "./apps/zinfurn-api/src/libs/config.ts");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/comment/comment.ts":
/*!**********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/comment/comment.ts ***!
  \**********************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const comment_enum_1 = __webpack_require__(/*! ../../enums/comment.enum */ "./apps/zinfurn-api/src/libs/enums/comment.enum.ts");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/comment/comment.update.ts":
/*!*****************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/comment/comment.update.ts ***!
  \*****************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const comment_enum_1 = __webpack_require__(/*! ../../enums/comment.enum */ "./apps/zinfurn-api/src/libs/enums/comment.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
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

/***/ "./apps/zinfurn-api/src/libs/dto/coupon/coupon.input.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/coupon/coupon.input.ts ***!
  \**************************************************************/
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
exports.CouponUpdateInput = exports.CouponCreateInput = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const coupon_enum_1 = __webpack_require__(/*! ../../enums/coupon.enum */ "./apps/zinfurn-api/src/libs/enums/coupon.enum.ts");
let CouponCreateInput = class CouponCreateInput {
    couponCode;
    couponType;
    couponValue;
    maxUses;
    minOrderAmount;
    validUntil;
};
exports.CouponCreateInput = CouponCreateInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 24),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CouponCreateInput.prototype, "couponCode", void 0);
__decorate([
    (0, graphql_1.Field)(() => coupon_enum_1.CouponType),
    __metadata("design:type", typeof (_a = typeof coupon_enum_1.CouponType !== "undefined" && coupon_enum_1.CouponType) === "function" ? _a : Object)
], CouponCreateInput.prototype, "couponType", void 0);
__decorate([
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], CouponCreateInput.prototype, "couponValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], CouponCreateInput.prototype, "maxUses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, graphql_1.Field)(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], CouponCreateInput.prototype, "minOrderAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CouponCreateInput.prototype, "validUntil", void 0);
exports.CouponCreateInput = CouponCreateInput = __decorate([
    (0, graphql_1.InputType)()
], CouponCreateInput);
let CouponUpdateInput = class CouponUpdateInput {
    _id;
    couponStatus;
    maxUses;
    validUntil;
};
exports.CouponUpdateInput = CouponUpdateInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CouponUpdateInput.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => coupon_enum_1.CouponStatus, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof coupon_enum_1.CouponStatus !== "undefined" && coupon_enum_1.CouponStatus) === "function" ? _c : Object)
], CouponUpdateInput.prototype, "couponStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], CouponUpdateInput.prototype, "maxUses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], CouponUpdateInput.prototype, "validUntil", void 0);
exports.CouponUpdateInput = CouponUpdateInput = __decorate([
    (0, graphql_1.InputType)()
], CouponUpdateInput);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/coupon/coupon.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/coupon/coupon.ts ***!
  \********************************************************/
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
exports.CouponValidation = exports.Coupon = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const coupon_enum_1 = __webpack_require__(/*! ../../enums/coupon.enum */ "./apps/zinfurn-api/src/libs/enums/coupon.enum.ts");
let Coupon = class Coupon {
    _id;
    couponCode;
    couponType;
    couponValue;
    couponStatus;
    maxUses;
    usedCount;
    minOrderAmount;
    validUntil;
    createdAt;
    updatedAt;
};
exports.Coupon = Coupon;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Coupon.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Coupon.prototype, "couponCode", void 0);
__decorate([
    (0, graphql_1.Field)(() => coupon_enum_1.CouponType),
    __metadata("design:type", typeof (_b = typeof coupon_enum_1.CouponType !== "undefined" && coupon_enum_1.CouponType) === "function" ? _b : Object)
], Coupon.prototype, "couponType", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], Coupon.prototype, "couponValue", void 0);
__decorate([
    (0, graphql_1.Field)(() => coupon_enum_1.CouponStatus),
    __metadata("design:type", typeof (_c = typeof coupon_enum_1.CouponStatus !== "undefined" && coupon_enum_1.CouponStatus) === "function" ? _c : Object)
], Coupon.prototype, "couponStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Coupon.prototype, "maxUses", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Coupon.prototype, "usedCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], Coupon.prototype, "minOrderAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Coupon.prototype, "validUntil", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Coupon.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Coupon.prototype, "updatedAt", void 0);
exports.Coupon = Coupon = __decorate([
    (0, graphql_1.ObjectType)()
], Coupon);
let CouponValidation = class CouponValidation {
    valid;
    message;
    discountAmount;
    finalTotal;
    couponCode;
};
exports.CouponValidation = CouponValidation;
__decorate([
    (0, graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], CouponValidation.prototype, "valid", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CouponValidation.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], CouponValidation.prototype, "discountAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => Number),
    __metadata("design:type", Number)
], CouponValidation.prototype, "finalTotal", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CouponValidation.prototype, "couponCode", void 0);
exports.CouponValidation = CouponValidation = __decorate([
    (0, graphql_1.ObjectType)()
], CouponValidation);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/follow/follow.input.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/follow/follow.input.ts ***!
  \**************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
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

/***/ "./apps/zinfurn-api/src/libs/dto/follow/follow.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/follow/follow.ts ***!
  \********************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
const like_1 = __webpack_require__(/*! ../like/like */ "./apps/zinfurn-api/src/libs/dto/like/like.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/like/like.ts":
/*!****************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/like/like.ts ***!
  \****************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const like_enum_1 = __webpack_require__(/*! ../../enums/like.enum */ "./apps/zinfurn-api/src/libs/enums/like.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
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

/***/ "./apps/zinfurn-api/src/libs/dto/member/member.input.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/member/member.input.ts ***!
  \**************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const member_enum_1 = __webpack_require__(/*! ../../enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const config_1 = __webpack_require__(/*! ../../config */ "./apps/zinfurn-api/src/libs/config.ts");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/member/member.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/member/member.ts ***!
  \********************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const member_enum_1 = __webpack_require__(/*! ../../enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const like_1 = __webpack_require__(/*! ../like/like */ "./apps/zinfurn-api/src/libs/dto/like/like.ts");
const follow_1 = __webpack_require__(/*! ../follow/follow */ "./apps/zinfurn-api/src/libs/dto/follow/follow.ts");
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
    memberTelegramId;
    memberGoogleId;
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
    refreshToken;
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
    (0, graphql_1.Field)(() => String, { nullable: true }),
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
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberTelegramId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "memberGoogleId", void 0);
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
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "refreshToken", void 0);
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

/***/ "./apps/zinfurn-api/src/libs/dto/member/member.update.ts":
/*!***************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/member/member.update.ts ***!
  \***************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const member_enum_1 = __webpack_require__(/*! ../../enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
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
    (0, class_validator_1.Length)(3, 62),
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

/***/ "./apps/zinfurn-api/src/libs/dto/message/message.input.ts":
/*!****************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/message/message.input.ts ***!
  \****************************************************************/
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
exports.SendRepairRequestInput = exports.ReplyMessageInput = exports.SendMessageInput = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
let SendMessageInput = class SendMessageInput {
    propertyId;
    message;
    name;
    phone;
};
exports.SendMessageInput = SendMessageInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SendMessageInput.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 2000),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SendMessageInput.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SendMessageInput.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SendMessageInput.prototype, "phone", void 0);
exports.SendMessageInput = SendMessageInput = __decorate([
    (0, graphql_1.InputType)()
], SendMessageInput);
let ReplyMessageInput = class ReplyMessageInput {
    conversationId;
    message;
};
exports.ReplyMessageInput = ReplyMessageInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ReplyMessageInput.prototype, "conversationId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 2000),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], ReplyMessageInput.prototype, "message", void 0);
exports.ReplyMessageInput = ReplyMessageInput = __decorate([
    (0, graphql_1.InputType)()
], ReplyMessageInput);
let SendRepairRequestInput = class SendRepairRequestInput {
    technicianId;
    message;
    address;
    phone;
};
exports.SendRepairRequestInput = SendRepairRequestInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SendRepairRequestInput.prototype, "technicianId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 2000),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], SendRepairRequestInput.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SendRepairRequestInput.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SendRepairRequestInput.prototype, "phone", void 0);
exports.SendRepairRequestInput = SendRepairRequestInput = __decorate([
    (0, graphql_1.InputType)()
], SendRepairRequestInput);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/message/message.ts":
/*!**********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/message/message.ts ***!
  \**********************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Conversation = exports.Message = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const message_enum_1 = __webpack_require__(/*! ../../enums/message.enum */ "./apps/zinfurn-api/src/libs/enums/message.enum.ts");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
let Message = class Message {
    _id;
    conversationId;
    propertyId;
    kind;
    senderId;
    receiverId;
    message;
    messageStatus;
    createdAt;
    updatedAt;
    senderData;
};
exports.Message = Message;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Message.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Message.prototype, "conversationId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], Message.prototype, "propertyId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Message.prototype, "kind", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], Message.prototype, "receiverId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(() => message_enum_1.MessageStatus),
    __metadata("design:type", typeof (_e = typeof message_enum_1.MessageStatus !== "undefined" && message_enum_1.MessageStatus) === "function" ? _e : Object)
], Message.prototype, "messageStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Message.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _h : Object)
], Message.prototype, "senderData", void 0);
exports.Message = Message = __decorate([
    (0, graphql_1.ObjectType)()
], Message);
let Conversation = class Conversation {
    conversationId;
    propertyId;
    kind;
    propertyTitle;
    propertyImage;
    lastMessage;
    lastMessageAt;
    unreadCount;
    partner;
};
exports.Conversation = Conversation;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Conversation.prototype, "conversationId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", typeof (_j = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _j : Object)
], Conversation.prototype, "propertyId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "kind", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "propertyTitle", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "propertyImage", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Conversation.prototype, "lastMessage", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], Conversation.prototype, "lastMessageAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Conversation.prototype, "unreadCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_l = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _l : Object)
], Conversation.prototype, "partner", void 0);
exports.Conversation = Conversation = __decorate([
    (0, graphql_1.ObjectType)()
], Conversation);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/notice/notice.input.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/notice/notice.input.ts ***!
  \**************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const notice_enum_1 = __webpack_require__(/*! ../../enums/notice.enum */ "./apps/zinfurn-api/src/libs/enums/notice.enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/notice/notice.inquiry.ts":
/*!****************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/notice/notice.inquiry.ts ***!
  \****************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const notice_enum_1 = __webpack_require__(/*! ../../enums/notice.enum */ "./apps/zinfurn-api/src/libs/enums/notice.enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/notice/notice.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/notice/notice.ts ***!
  \********************************************************/
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
exports.NoticesMeta = exports.Notices = exports.Notice = exports.NoticeTranslations = exports.NoticeI18n = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const notice_enum_1 = __webpack_require__(/*! ../../enums/notice.enum */ "./apps/zinfurn-api/src/libs/enums/notice.enum.ts");
let NoticeI18n = class NoticeI18n {
    title;
    desc;
};
exports.NoticeI18n = NoticeI18n;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], NoticeI18n.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], NoticeI18n.prototype, "desc", void 0);
exports.NoticeI18n = NoticeI18n = __decorate([
    (0, graphql_1.ObjectType)()
], NoticeI18n);
let NoticeTranslations = class NoticeTranslations {
    uz;
    en;
    ru;
    kr;
    ar;
};
exports.NoticeTranslations = NoticeTranslations;
__decorate([
    (0, graphql_1.Field)(() => NoticeI18n, { nullable: true }),
    __metadata("design:type", NoticeI18n)
], NoticeTranslations.prototype, "uz", void 0);
__decorate([
    (0, graphql_1.Field)(() => NoticeI18n, { nullable: true }),
    __metadata("design:type", NoticeI18n)
], NoticeTranslations.prototype, "en", void 0);
__decorate([
    (0, graphql_1.Field)(() => NoticeI18n, { nullable: true }),
    __metadata("design:type", NoticeI18n)
], NoticeTranslations.prototype, "ru", void 0);
__decorate([
    (0, graphql_1.Field)(() => NoticeI18n, { nullable: true }),
    __metadata("design:type", NoticeI18n)
], NoticeTranslations.prototype, "kr", void 0);
__decorate([
    (0, graphql_1.Field)(() => NoticeI18n, { nullable: true }),
    __metadata("design:type", NoticeI18n)
], NoticeTranslations.prototype, "ar", void 0);
exports.NoticeTranslations = NoticeTranslations = __decorate([
    (0, graphql_1.ObjectType)()
], NoticeTranslations);
let Notice = class Notice {
    _id;
    noticeCategory;
    noticeStatus;
    noticeTitle;
    noticeContent;
    noticeTranslations;
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
    (0, graphql_1.Field)(() => NoticeTranslations, { nullable: true }),
    __metadata("design:type", NoticeTranslations)
], Notice.prototype, "noticeTranslations", void 0);
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

/***/ "./apps/zinfurn-api/src/libs/dto/order/order.input.ts":
/*!************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/order/order.input.ts ***!
  \************************************************************/
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
exports.OrdersInquiry = exports.CreateOrderInput = exports.DeliveryInfoInput = exports.OrderItemInput = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const order_enum_1 = __webpack_require__(/*! ../../enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
let OrderItemInput = class OrderItemInput {
    propertyId;
    propertyTitle;
    propertyImage;
    propertyPrice;
    quantity;
};
exports.OrderItemInput = OrderItemInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], OrderItemInput.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], OrderItemInput.prototype, "propertyTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderItemInput.prototype, "propertyImage", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderItemInput.prototype, "propertyPrice", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItemInput.prototype, "quantity", void 0);
exports.OrderItemInput = OrderItemInput = __decorate([
    (0, graphql_1.InputType)()
], OrderItemInput);
let DeliveryInfoInput = class DeliveryInfoInput {
    fullName;
    address;
    city;
    phone;
    note;
};
exports.DeliveryInfoInput = DeliveryInfoInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfoInput.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfoInput.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfoInput.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfoInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], DeliveryInfoInput.prototype, "note", void 0);
exports.DeliveryInfoInput = DeliveryInfoInput = __decorate([
    (0, graphql_1.InputType)()
], DeliveryInfoInput);
let CreateOrderInput = class CreateOrderInput {
    orderItems;
    orderTotal;
    couponCode;
    deliveryInfo;
    memberId;
};
exports.CreateOrderInput = CreateOrderInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => [OrderItemInput]),
    __metadata("design:type", Array)
], CreateOrderInput.prototype, "orderItems", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CreateOrderInput.prototype, "orderTotal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateOrderInput.prototype, "couponCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => DeliveryInfoInput),
    __metadata("design:type", DeliveryInfoInput)
], CreateOrderInput.prototype, "deliveryInfo", void 0);
exports.CreateOrderInput = CreateOrderInput = __decorate([
    (0, graphql_1.InputType)()
], CreateOrderInput);
let OISearch = class OISearch {
    orderStatus;
};
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => order_enum_1.OrderStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof order_enum_1.OrderStatus !== "undefined" && order_enum_1.OrderStatus) === "function" ? _b : Object)
], OISearch.prototype, "orderStatus", void 0);
OISearch = __decorate([
    (0, graphql_1.InputType)()
], OISearch);
let OrdersInquiry = class OrdersInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.OrdersInquiry = OrdersInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrdersInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrdersInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['createdAt', 'updatedAt']),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrdersInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_c = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _c : Object)
], OrdersInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => OISearch, { nullable: true }),
    __metadata("design:type", OISearch)
], OrdersInquiry.prototype, "search", void 0);
exports.OrdersInquiry = OrdersInquiry = __decorate([
    (0, graphql_1.InputType)()
], OrdersInquiry);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/order/order.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/order/order.ts ***!
  \******************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Orders = exports.Order = exports.DeliveryInfo = exports.OrderItem = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const order_enum_1 = __webpack_require__(/*! ../../enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
let OrderItem = class OrderItem {
    propertyId;
    propertyTitle;
    propertyImage;
    propertyPrice;
    quantity;
};
exports.OrderItem = OrderItem;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], OrderItem.prototype, "propertyId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], OrderItem.prototype, "propertyTitle", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "propertyImage", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], OrderItem.prototype, "propertyPrice", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, graphql_1.ObjectType)()
], OrderItem);
let DeliveryInfo = class DeliveryInfo {
    fullName;
    address;
    city;
    phone;
    note;
};
exports.DeliveryInfo = DeliveryInfo;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "fullName", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "city", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], DeliveryInfo.prototype, "note", void 0);
exports.DeliveryInfo = DeliveryInfo = __decorate([
    (0, graphql_1.ObjectType)()
], DeliveryInfo);
let Order = class Order {
    _id;
    orderId;
    memberId;
    orderItems;
    orderStatus;
    orderTotal;
    orderCouponCode;
    orderDiscount;
    deliveryInfo;
    confirmedAt;
    cancelledAt;
    returnRequestedAt;
    returnReason;
    returnedAt;
    createdAt;
    updatedAt;
    memberData;
};
exports.Order = Order;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], Order.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Order.prototype, "orderId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], Order.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => [OrderItem]),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, graphql_1.Field)(() => order_enum_1.OrderStatus),
    __metadata("design:type", typeof (_d = typeof order_enum_1.OrderStatus !== "undefined" && order_enum_1.OrderStatus) === "function" ? _d : Object)
], Order.prototype, "orderStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Order.prototype, "orderTotal", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "orderCouponCode", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], Order.prototype, "orderDiscount", void 0);
__decorate([
    (0, graphql_1.Field)(() => DeliveryInfo),
    __metadata("design:type", DeliveryInfo)
], Order.prototype, "deliveryInfo", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Order.prototype, "confirmedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Order.prototype, "cancelledAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Order.prototype, "returnRequestedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "returnReason", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof Date !== "undefined" && Date) === "function" ? _h : Object)
], Order.prototype, "returnedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_j = typeof Date !== "undefined" && Date) === "function" ? _j : Object)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_k = typeof Date !== "undefined" && Date) === "function" ? _k : Object)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_l = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _l : Object)
], Order.prototype, "memberData", void 0);
exports.Order = Order = __decorate([
    (0, graphql_1.ObjectType)()
], Order);
let Orders = class Orders {
    list;
    metaCounter;
};
exports.Orders = Orders;
__decorate([
    (0, graphql_1.Field)(() => [Order]),
    __metadata("design:type", Array)
], Orders.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Orders.prototype, "metaCounter", void 0);
exports.Orders = Orders = __decorate([
    (0, graphql_1.ObjectType)()
], Orders);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/order/order.update.ts":
/*!*************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/order/order.update.ts ***!
  \*************************************************************/
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
exports.OrderUpdate = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const order_enum_1 = __webpack_require__(/*! ../../enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
let OrderUpdate = class OrderUpdate {
    _id;
    orderStatus;
    returnReason;
};
exports.OrderUpdate = OrderUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], OrderUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => order_enum_1.OrderStatus, { nullable: true }),
    __metadata("design:type", typeof (_b = typeof order_enum_1.OrderStatus !== "undefined" && order_enum_1.OrderStatus) === "function" ? _b : Object)
], OrderUpdate.prototype, "orderStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], OrderUpdate.prototype, "returnReason", void 0);
exports.OrderUpdate = OrderUpdate = __decorate([
    (0, graphql_1.InputType)()
], OrderUpdate);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/property/property.input.ts":
/*!******************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/property/property.input.ts ***!
  \******************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const property_enum_1 = __webpack_require__(/*! ../../enums/property.enum */ "./apps/zinfurn-api/src/libs/enums/property.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const config_1 = __webpack_require__(/*! ../../config */ "./apps/zinfurn-api/src/libs/config.ts");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
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
    propertyIsOnSale;
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
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], PISearch.prototype, "propertyIsOnSale", void 0);
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

/***/ "./apps/zinfurn-api/src/libs/dto/property/property.ts":
/*!************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/property/property.ts ***!
  \************************************************************/
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
exports.Properties = exports.Property = exports.PropertyTranslations = exports.PropertyI18n = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const property_enum_1 = __webpack_require__(/*! ../../enums/property.enum */ "./apps/zinfurn-api/src/libs/enums/property.enum.ts");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
const like_1 = __webpack_require__(/*! ../like/like */ "./apps/zinfurn-api/src/libs/dto/like/like.ts");
let PropertyI18n = class PropertyI18n {
    title;
    desc;
};
exports.PropertyI18n = PropertyI18n;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyI18n.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PropertyI18n.prototype, "desc", void 0);
exports.PropertyI18n = PropertyI18n = __decorate([
    (0, graphql_1.ObjectType)()
], PropertyI18n);
let PropertyTranslations = class PropertyTranslations {
    uz;
    en;
    ru;
    kr;
    ar;
};
exports.PropertyTranslations = PropertyTranslations;
__decorate([
    (0, graphql_1.Field)(() => PropertyI18n, { nullable: true }),
    __metadata("design:type", PropertyI18n)
], PropertyTranslations.prototype, "uz", void 0);
__decorate([
    (0, graphql_1.Field)(() => PropertyI18n, { nullable: true }),
    __metadata("design:type", PropertyI18n)
], PropertyTranslations.prototype, "en", void 0);
__decorate([
    (0, graphql_1.Field)(() => PropertyI18n, { nullable: true }),
    __metadata("design:type", PropertyI18n)
], PropertyTranslations.prototype, "ru", void 0);
__decorate([
    (0, graphql_1.Field)(() => PropertyI18n, { nullable: true }),
    __metadata("design:type", PropertyI18n)
], PropertyTranslations.prototype, "kr", void 0);
__decorate([
    (0, graphql_1.Field)(() => PropertyI18n, { nullable: true }),
    __metadata("design:type", PropertyI18n)
], PropertyTranslations.prototype, "ar", void 0);
exports.PropertyTranslations = PropertyTranslations = __decorate([
    (0, graphql_1.ObjectType)()
], PropertyTranslations);
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
    propertyTranslations;
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
    propertyReviews;
    propertyRating;
    propertySoldCount;
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
    (0, graphql_1.Field)(() => PropertyTranslations, { nullable: true }),
    __metadata("design:type", PropertyTranslations)
], Property.prototype, "propertyTranslations", void 0);
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
], Property.prototype, "propertyReviews", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "propertyRating", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Property.prototype, "propertySoldCount", void 0);
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

/***/ "./apps/zinfurn-api/src/libs/dto/property/property.update.ts":
/*!*******************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/property/property.update.ts ***!
  \*******************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const property_enum_1 = __webpack_require__(/*! ../../enums/property.enum */ "./apps/zinfurn-api/src/libs/enums/property.enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.input.ts":
/*!******************************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.input.ts ***!
  \******************************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const property_enum_1 = __webpack_require__(/*! ../../enums/property.enum */ "./apps/zinfurn-api/src/libs/enums/property.enum.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
const config_1 = __webpack_require__(/*! ../../config */ "./apps/zinfurn-api/src/libs/config.ts");
const repairProperty_enum_1 = __webpack_require__(/*! ../../enums/repairProperty.enum */ "./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.ts":
/*!************************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.ts ***!
  \************************************************************************/
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
exports.RepairProperties = exports.RepairProperty = exports.RepairTranslations = exports.RepairI18n = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
const like_1 = __webpack_require__(/*! ../like/like */ "./apps/zinfurn-api/src/libs/dto/like/like.ts");
const repairProperty_enum_1 = __webpack_require__(/*! ../../enums/repairProperty.enum */ "./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts");
let RepairI18n = class RepairI18n {
    title;
    desc;
};
exports.RepairI18n = RepairI18n;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RepairI18n.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RepairI18n.prototype, "desc", void 0);
exports.RepairI18n = RepairI18n = __decorate([
    (0, graphql_1.ObjectType)()
], RepairI18n);
let RepairTranslations = class RepairTranslations {
    uz;
    en;
    ru;
    kr;
    ar;
};
exports.RepairTranslations = RepairTranslations;
__decorate([
    (0, graphql_1.Field)(() => RepairI18n, { nullable: true }),
    __metadata("design:type", RepairI18n)
], RepairTranslations.prototype, "uz", void 0);
__decorate([
    (0, graphql_1.Field)(() => RepairI18n, { nullable: true }),
    __metadata("design:type", RepairI18n)
], RepairTranslations.prototype, "en", void 0);
__decorate([
    (0, graphql_1.Field)(() => RepairI18n, { nullable: true }),
    __metadata("design:type", RepairI18n)
], RepairTranslations.prototype, "ru", void 0);
__decorate([
    (0, graphql_1.Field)(() => RepairI18n, { nullable: true }),
    __metadata("design:type", RepairI18n)
], RepairTranslations.prototype, "kr", void 0);
__decorate([
    (0, graphql_1.Field)(() => RepairI18n, { nullable: true }),
    __metadata("design:type", RepairI18n)
], RepairTranslations.prototype, "ar", void 0);
exports.RepairTranslations = RepairTranslations = __decorate([
    (0, graphql_1.ObjectType)()
], RepairTranslations);
let RepairProperty = class RepairProperty {
    _id;
    repairPropertyType;
    repairPropertyStatus;
    repairPropertyAddress;
    repairPropertyDescription;
    repairPropertyImages;
    repairPropertyTranslations;
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
    (0, graphql_1.Field)(() => RepairTranslations, { nullable: true }),
    __metadata("design:type", RepairTranslations)
], RepairProperty.prototype, "repairPropertyTranslations", void 0);
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

/***/ "./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.update.ts":
/*!*******************************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/repairProperty/repairProperty.update.ts ***!
  \*******************************************************************************/
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
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const repairProperty_enum_1 = __webpack_require__(/*! ../../enums/repairProperty.enum */ "./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts");
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

/***/ "./apps/zinfurn-api/src/libs/dto/review/review.input.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/review/review.input.ts ***!
  \**************************************************************/
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
exports.ReviewsInquiry = exports.CreateReviewInput = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const common_enum_1 = __webpack_require__(/*! ../../enums/common_enum */ "./apps/zinfurn-api/src/libs/enums/common_enum.ts");
let CreateReviewInput = class CreateReviewInput {
    propertyId;
    orderId;
    reviewRating;
    reviewContent;
    reviewImages;
    memberId;
};
exports.CreateReviewInput = CreateReviewInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], CreateReviewInput.prototype, "propertyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], CreateReviewInput.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CreateReviewInput.prototype, "reviewRating", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(1, 1000),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CreateReviewInput.prototype, "reviewContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateReviewInput.prototype, "reviewImages", void 0);
exports.CreateReviewInput = CreateReviewInput = __decorate([
    (0, graphql_1.InputType)()
], CreateReviewInput);
let RISearch = class RISearch {
    propertyId;
};
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], RISearch.prototype, "propertyId", void 0);
RISearch = __decorate([
    (0, graphql_1.InputType)()
], RISearch);
let ReviewsInquiry = class ReviewsInquiry {
    page;
    limit;
    sort;
    direction;
    search;
};
exports.ReviewsInquiry = ReviewsInquiry;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ReviewsInquiry.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ReviewsInquiry.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['createdAt', 'updatedAt', 'reviewRating']),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ReviewsInquiry.prototype, "sort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => common_enum_1.Direction, { nullable: true }),
    __metadata("design:type", typeof (_d = typeof common_enum_1.Direction !== "undefined" && common_enum_1.Direction) === "function" ? _d : Object)
], ReviewsInquiry.prototype, "direction", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => RISearch),
    __metadata("design:type", RISearch)
], ReviewsInquiry.prototype, "search", void 0);
exports.ReviewsInquiry = ReviewsInquiry = __decorate([
    (0, graphql_1.InputType)()
], ReviewsInquiry);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/review/review.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/review/review.ts ***!
  \********************************************************/
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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Reviews = exports.ReviewSummary = exports.ReviewReactionResult = exports.Review = exports.RatingCount = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const review_enum_1 = __webpack_require__(/*! ../../enums/review.enum */ "./apps/zinfurn-api/src/libs/enums/review.enum.ts");
const member_1 = __webpack_require__(/*! ../member/member */ "./apps/zinfurn-api/src/libs/dto/member/member.ts");
let RatingCount = class RatingCount {
    star;
    count;
};
exports.RatingCount = RatingCount;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingCount.prototype, "star", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], RatingCount.prototype, "count", void 0);
exports.RatingCount = RatingCount = __decorate([
    (0, graphql_1.ObjectType)()
], RatingCount);
let Review = class Review {
    _id;
    memberId;
    propertyId;
    orderId;
    reviewRating;
    reviewContent;
    reviewImages;
    reviewStatus;
    createdAt;
    updatedAt;
    memberData;
    likesCount;
    dislikesCount;
    myReaction;
};
exports.Review = Review;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], Review.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_b = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _b : Object)
], Review.prototype, "memberId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_c = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _c : Object)
], Review.prototype, "propertyId", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_d = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _d : Object)
], Review.prototype, "orderId", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Review.prototype, "reviewRating", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], Review.prototype, "reviewContent", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Review.prototype, "reviewImages", void 0);
__decorate([
    (0, graphql_1.Field)(() => review_enum_1.ReviewStatus),
    __metadata("design:type", typeof (_e = typeof review_enum_1.ReviewStatus !== "undefined" && review_enum_1.ReviewStatus) === "function" ? _e : Object)
], Review.prototype, "reviewStatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], Review.prototype, "createdAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Date),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], Review.prototype, "updatedAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => member_1.Member, { nullable: true }),
    __metadata("design:type", typeof (_h = typeof member_1.Member !== "undefined" && member_1.Member) === "function" ? _h : Object)
], Review.prototype, "memberData", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "likesCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Review.prototype, "dislikesCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => review_enum_1.ReviewReaction, { nullable: true }),
    __metadata("design:type", typeof (_j = typeof review_enum_1.ReviewReaction !== "undefined" && review_enum_1.ReviewReaction) === "function" ? _j : Object)
], Review.prototype, "myReaction", void 0);
exports.Review = Review = __decorate([
    (0, graphql_1.ObjectType)()
], Review);
let ReviewReactionResult = class ReviewReactionResult {
    _id;
    likesCount;
    dislikesCount;
    myReaction;
};
exports.ReviewReactionResult = ReviewReactionResult;
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_k = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _k : Object)
], ReviewReactionResult.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ReviewReactionResult.prototype, "likesCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ReviewReactionResult.prototype, "dislikesCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => review_enum_1.ReviewReaction, { nullable: true }),
    __metadata("design:type", typeof (_l = typeof review_enum_1.ReviewReaction !== "undefined" && review_enum_1.ReviewReaction) === "function" ? _l : Object)
], ReviewReactionResult.prototype, "myReaction", void 0);
exports.ReviewReactionResult = ReviewReactionResult = __decorate([
    (0, graphql_1.ObjectType)()
], ReviewReactionResult);
let ReviewSummary = class ReviewSummary {
    averageRating;
    totalReviews;
    ratingDistribution;
};
exports.ReviewSummary = ReviewSummary;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], ReviewSummary.prototype, "averageRating", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ReviewSummary.prototype, "totalReviews", void 0);
__decorate([
    (0, graphql_1.Field)(() => [RatingCount]),
    __metadata("design:type", Array)
], ReviewSummary.prototype, "ratingDistribution", void 0);
exports.ReviewSummary = ReviewSummary = __decorate([
    (0, graphql_1.ObjectType)()
], ReviewSummary);
let Reviews = class Reviews {
    list;
    metaCounter;
};
exports.Reviews = Reviews;
__decorate([
    (0, graphql_1.Field)(() => [Review]),
    __metadata("design:type", Array)
], Reviews.prototype, "list", void 0);
__decorate([
    (0, graphql_1.Field)(() => [member_1.TotalCounter], { nullable: true }),
    __metadata("design:type", Array)
], Reviews.prototype, "metaCounter", void 0);
exports.Reviews = Reviews = __decorate([
    (0, graphql_1.ObjectType)()
], Reviews);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/dto/review/review.update.ts":
/*!***************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/dto/review/review.update.ts ***!
  \***************************************************************/
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
exports.ReviewUpdate = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
let ReviewUpdate = class ReviewUpdate {
    _id;
    reviewRating;
    reviewContent;
    reviewImages;
};
exports.ReviewUpdate = ReviewUpdate;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", typeof (_a = typeof mongoose_1.ObjectId !== "undefined" && mongoose_1.ObjectId) === "function" ? _a : Object)
], ReviewUpdate.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ReviewUpdate.prototype, "reviewRating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 1000),
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ReviewUpdate.prototype, "reviewContent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ReviewUpdate.prototype, "reviewImages", void 0);
exports.ReviewUpdate = ReviewUpdate = __decorate([
    (0, graphql_1.InputType)()
], ReviewUpdate);


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/enums/board-article.enum.ts":
/*!***************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/board-article.enum.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardArticleStatus = exports.BoardArticleCategory = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/comment.enum.ts":
/*!*********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/comment.enum.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentGroup = exports.CommentStatus = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/common_enum.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/common_enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Direction = exports.Message = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/coupon.enum.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/coupon.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CouponStatus = exports.CouponType = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
var CouponType;
(function (CouponType) {
    CouponType["PERCENT"] = "PERCENT";
    CouponType["FIXED"] = "FIXED";
})(CouponType || (exports.CouponType = CouponType = {}));
(0, graphql_1.registerEnumType)(CouponType, { name: 'CouponType' });
var CouponStatus;
(function (CouponStatus) {
    CouponStatus["ACTIVE"] = "ACTIVE";
    CouponStatus["PAUSED"] = "PAUSED";
})(CouponStatus || (exports.CouponStatus = CouponStatus = {}));
(0, graphql_1.registerEnumType)(CouponStatus, { name: 'CouponStatus' });


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/enums/like.enum.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/like.enum.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LikeGroup = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/member.enum.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/member.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MemberAuthType = exports.MemberStatus = exports.MemberType = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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
    MemberAuthType["GOOGLE"] = "GOOGLE";
})(MemberAuthType || (exports.MemberAuthType = MemberAuthType = {}));
(0, graphql_1.registerEnumType)(MemberAuthType, {
    name: "MemberAuthType",
});


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/enums/message.enum.ts":
/*!*********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/message.enum.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageStatus = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
var MessageStatus;
(function (MessageStatus) {
    MessageStatus["WAIT"] = "WAIT";
    MessageStatus["READ"] = "READ";
})(MessageStatus || (exports.MessageStatus = MessageStatus = {}));
(0, graphql_1.registerEnumType)(MessageStatus, { name: 'MessageStatus' });


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/enums/notice.enum.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/notice.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NoticeStatus = exports.NoticeCategory = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/notification.enum.ts":
/*!**************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/notification.enum.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationGroup = exports.NotificationStatus = exports.NotificationType = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
var NotificationType;
(function (NotificationType) {
    NotificationType["LIKE"] = "LIKE";
    NotificationType["COMMENT"] = "COMMENT";
    NotificationType["MESSAGE"] = "MESSAGE";
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

/***/ "./apps/zinfurn-api/src/libs/enums/order.enum.ts":
/*!*******************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/order.enum.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrderStatus = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["RETURN_REQUESTED"] = "RETURN_REQUESTED";
    OrderStatus["RETURNED"] = "RETURNED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
(0, graphql_1.registerEnumType)(OrderStatus, { name: 'OrderStatus' });


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/enums/property.enum.ts":
/*!**********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/property.enum.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyCondition = exports.PropertyColor = exports.PropertyMaterial = exports.PropertyCategory = exports.PropertyStatus = exports.PropertyType = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts":
/*!****************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RepairPropertyStatus = exports.RepairPropertyType = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/enums/review.enum.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/review.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewReaction = exports.ReviewStatus = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["ACTIVE"] = "ACTIVE";
    ReviewStatus["DELETE"] = "DELETE";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
(0, graphql_1.registerEnumType)(ReviewStatus, { name: 'ReviewStatus' });
var ReviewReaction;
(function (ReviewReaction) {
    ReviewReaction["LIKE"] = "LIKE";
    ReviewReaction["DISLIKE"] = "DISLIKE";
})(ReviewReaction || (exports.ReviewReaction = ReviewReaction = {}));
(0, graphql_1.registerEnumType)(ReviewReaction, { name: 'ReviewReaction' });


/***/ }),

/***/ "./apps/zinfurn-api/src/libs/enums/view.enum.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/enums/view.enum.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewGroup = void 0;
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
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

/***/ "./apps/zinfurn-api/src/libs/interceptor/Logging.interceptor.ts":
/*!**********************************************************************!*\
  !*** ./apps/zinfurn-api/src/libs/interceptor/Logging.interceptor.ts ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const graphql_1 = __webpack_require__(/*! @nestjs/graphql */ "@nestjs/graphql");
const operators_1 = __webpack_require__(/*! rxjs/operators */ "rxjs/operators");
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

/***/ "./apps/zinfurn-api/src/schemas/BoardArticle.model.ts":
/*!************************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/BoardArticle.model.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const board_article_enum_1 = __webpack_require__(/*! ../libs/enums/board-article.enum */ "./apps/zinfurn-api/src/libs/enums/board-article.enum.ts");
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
    articleTranslations: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
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

/***/ "./apps/zinfurn-api/src/schemas/Comment.model.ts":
/*!*******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Comment.model.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const comment_enum_1 = __webpack_require__(/*! ../libs/enums/comment.enum */ "./apps/zinfurn-api/src/libs/enums/comment.enum.ts");
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

/***/ "./apps/zinfurn-api/src/schemas/Coupon.model.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Coupon.model.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const coupon_enum_1 = __webpack_require__(/*! ../libs/enums/coupon.enum */ "./apps/zinfurn-api/src/libs/enums/coupon.enum.ts");
const CouponSchema = new mongoose_1.Schema({
    couponCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    couponType: { type: String, enum: coupon_enum_1.CouponType, required: true },
    couponValue: { type: Number, required: true },
    couponStatus: { type: String, enum: coupon_enum_1.CouponStatus, default: coupon_enum_1.CouponStatus.ACTIVE },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    minOrderAmount: { type: Number, default: 0 },
    validUntil: { type: Date },
}, { timestamps: true, collection: 'coupons' });
exports["default"] = CouponSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/Follow.model.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Follow.model.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
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

/***/ "./apps/zinfurn-api/src/schemas/Like.model.ts":
/*!****************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Like.model.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const view_enum_1 = __webpack_require__(/*! ../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
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

/***/ "./apps/zinfurn-api/src/schemas/Member.model.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Member.model.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const member_enum_1 = __webpack_require__(/*! ../libs/enums/member.enum */ "./apps/zinfurn-api/src/libs/enums/member.enum.ts");
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
        required: false,
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
        required: false,
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
    memberTelegramId: {
        type: String,
        index: { unique: true, sparse: true },
    },
    memberGoogleId: {
        type: String,
        index: { unique: true, sparse: true },
    },
    deletedAt: {
        type: Date,
    },
}, { timestamps: true, collection: 'members' });
exports["default"] = MemberSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/Message.model.ts":
/*!*******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Message.model.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const message_enum_1 = __webpack_require__(/*! ../libs/enums/message.enum */ "./apps/zinfurn-api/src/libs/enums/message.enum.ts");
const MessageSchema = new mongoose_1.Schema({
    conversationId: { type: String, required: true, index: true },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, required: false, ref: 'Property' },
    kind: { type: String, enum: ['PROPERTY', 'REPAIR'], default: 'PROPERTY' },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Member' },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Member' },
    message: { type: String, required: true },
    messageStatus: { type: String, enum: message_enum_1.MessageStatus, default: message_enum_1.MessageStatus.WAIT },
}, { timestamps: true, collection: 'messages' });
MessageSchema.index({ conversationId: 1, createdAt: 1 });
exports["default"] = MessageSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/Notice.model.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Notice.model.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const notice_enum_1 = __webpack_require__(/*! ../libs/enums/notice.enum */ "./apps/zinfurn-api/src/libs/enums/notice.enum.ts");
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
    noticeTranslations: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    memberId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Member',
    },
}, { timestamps: true, collection: 'notices' });
exports["default"] = NoticeSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/Notification.model.ts":
/*!************************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Notification.model.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const notification_enum_1 = __webpack_require__(/*! ../libs/enums/notification.enum */ "./apps/zinfurn-api/src/libs/enums/notification.enum.ts");
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
    conversationId: {
        type: String,
    },
}, { timestamps: true, collection: 'notifications' });
exports["default"] = NotificationSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/Order.model.ts":
/*!*****************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Order.model.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const order_enum_1 = __webpack_require__(/*! ../libs/enums/order.enum */ "./apps/zinfurn-api/src/libs/enums/order.enum.ts");
const OrderItemSchema = new mongoose_1.Schema({
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Property' },
    propertyTitle: { type: String, required: true },
    propertyImage: { type: String },
    propertyPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
}, { _id: false });
const DeliveryInfoSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    memberId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Member' },
    orderItems: { type: [OrderItemSchema], required: true },
    orderStatus: { type: String, enum: order_enum_1.OrderStatus, default: order_enum_1.OrderStatus.PENDING },
    orderTotal: { type: Number, required: true },
    orderCouponCode: { type: String },
    orderDiscount: { type: Number, default: 0 },
    deliveryInfo: { type: DeliveryInfoSchema, required: true },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    returnRequestedAt: { type: Date },
    returnReason: { type: String },
    returnedAt: { type: Date },
}, { timestamps: true, collection: 'orders' });
exports["default"] = OrderSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/Property.model.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Property.model.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const property_enum_1 = __webpack_require__(/*! ../libs/enums/property.enum */ "./apps/zinfurn-api/src/libs/enums/property.enum.ts");
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
    propertyReviews: {
        type: Number,
        default: 0,
    },
    propertyRating: {
        type: Number,
        default: 0,
    },
    propertySoldCount: {
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
    propertyTranslations: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
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

/***/ "./apps/zinfurn-api/src/schemas/RepairProperty.ts":
/*!********************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/RepairProperty.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const repairProperty_enum_1 = __webpack_require__(/*! ../libs/enums/repairProperty.enum */ "./apps/zinfurn-api/src/libs/enums/repairProperty.enum.ts");
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
    repairPropertyTranslations: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
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

/***/ "./apps/zinfurn-api/src/schemas/Review.model.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/Review.model.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const review_enum_1 = __webpack_require__(/*! ../libs/enums/review.enum */ "./apps/zinfurn-api/src/libs/enums/review.enum.ts");
const ReviewSchema = new mongoose_1.Schema({
    memberId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Member' },
    propertyId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Property' },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Order' },
    reviewRating: { type: Number, required: true, min: 1, max: 5 },
    reviewContent: { type: String, required: true },
    reviewImages: { type: [String], default: [] },
    reviewLikes: { type: [mongoose_1.Schema.Types.ObjectId], default: [], ref: 'Member' },
    reviewDislikes: { type: [mongoose_1.Schema.Types.ObjectId], default: [], ref: 'Member' },
    reviewStatus: { type: String, enum: review_enum_1.ReviewStatus, default: review_enum_1.ReviewStatus.ACTIVE },
}, { timestamps: true, collection: 'reviews' });
ReviewSchema.index({ memberId: 1, propertyId: 1, orderId: 1 }, { unique: true });
exports["default"] = ReviewSchema;


/***/ }),

/***/ "./apps/zinfurn-api/src/schemas/View.model.ts":
/*!****************************************************!*\
  !*** ./apps/zinfurn-api/src/schemas/View.model.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const view_enum_1 = __webpack_require__(/*! ../libs/enums/view.enum */ "./apps/zinfurn-api/src/libs/enums/view.enum.ts");
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

/***/ "./apps/zinfurn-api/src/socket/socket.gateway.ts":
/*!*******************************************************!*\
  !*** ./apps/zinfurn-api/src/socket/socket.gateway.ts ***!
  \*******************************************************/
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketGateway = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const websockets_1 = __webpack_require__(/*! @nestjs/websockets */ "@nestjs/websockets");
const ws_1 = __webpack_require__(/*! ws */ "ws");
const WebSocket = __webpack_require__(/*! ws */ "ws");
const auth_service_1 = __webpack_require__(/*! ../components/auth/auth.service */ "./apps/zinfurn-api/src/components/auth/auth.service.ts");
const url = __webpack_require__(/*! url */ "url");
const notification_service_1 = __webpack_require__(/*! ../components/notification/notification.service */ "./apps/zinfurn-api/src/components/notification/notification.service.ts");
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
        this.summaryClient++;
        this.clientsAuthMap.set(client, authMember);
        const clientNick = authMember?.memberNick ?? 'Guest';
        this.logger.log(`Connection [${clientNick}] & total: [${this.summaryClient}]`);
        const infoMsg = {
            event: 'info',
            totalClients: this.summaryClient,
            memberData: authMember,
            action: 'joined',
        };
        this.emitMessage(infoMsg);
        client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
        client.on('message', async (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                if (parsed.event === 'message') {
                    let messageText = parsed.data ?? parsed.text ?? '';
                    let replyTo = undefined;
                    if (parsed.replyTo) {
                        replyTo = {
                            text: String(parsed.replyTo.text ?? ''),
                            memberNick: String(parsed.replyTo.memberNick ?? 'User'),
                        };
                    }
                    const newMessage = {
                        event: 'message',
                        text: messageText,
                        memberData: authMember ?? null,
                        replyTo: replyTo,
                        createdAt: new Date().toISOString(),
                    };
                    this.messagesList.push(newMessage);
                    if (this.messagesList.length > 50)
                        this.messagesList = this.messagesList.slice(-50);
                    this.emitMessage(newMessage);
                }
                else if (parsed.event === 'getMessages') {
                    client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
                }
                else if (parsed.event === 'get_notifications') {
                    await this.handleGetNotifications(client);
                }
                else if (parsed.event === 'markNotificationsAsRead') {
                    await this.handleMarkNotificationsAsRead(client, parsed.data);
                }
            }
            catch (e) { }
        });
        if (authMember) {
            setTimeout(() => {
                this.handleGetNotifications(client).catch((err) => {
                    this.logger.error('Error sending notifications on connection:', err);
                });
            }, 100);
        }
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
                        conversationId: notification.conversationId,
                    })),
                }));
            }
        }
        catch (error) {
            this.logger.error('Error in handleGetNotifications:', error);
        }
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
        this.logger.verbose(`Disconnected [${clientNick}] & total [${this.summaryClient}]`);
        const infoMsg = {
            event: 'info',
            totalClients: this.summaryClient,
            memberData: authMember ?? null,
            action: 'left',
        };
        this.broadcastMessage(client, infoMsg);
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
        this.server.clients.forEach((client) => {
            const authMember = this.clientsAuthMap.get(client);
            if (client.readyState === WebSocket.OPEN && authMember && authMember._id.toString() === userId) {
                client.send(JSON.stringify({ event: 'notification', payload: notification }));
            }
        });
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof ws_1.Server !== "undefined" && ws_1.Server) === "function" ? _c : Object)
], SocketGateway.prototype, "server", void 0);
exports.SocketGateway = SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ transport: ['websocket'], secure: false }),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => notification_service_1.NotificationService))),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof notification_service_1.NotificationService !== "undefined" && notification_service_1.NotificationService) === "function" ? _b : Object])
], SocketGateway);


/***/ }),

/***/ "./apps/zinfurn-api/src/socket/socket.module.ts":
/*!******************************************************!*\
  !*** ./apps/zinfurn-api/src/socket/socket.module.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SocketModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const socket_gateway_1 = __webpack_require__(/*! ./socket.gateway */ "./apps/zinfurn-api/src/socket/socket.gateway.ts");
const auth_module_1 = __webpack_require__(/*! ../components/auth/auth.module */ "./apps/zinfurn-api/src/components/auth/auth.module.ts");
const notification_module_1 = __webpack_require__(/*! ../components/notification/notification.module */ "./apps/zinfurn-api/src/components/notification/notification.module.ts");
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

/***/ "@nestjs/apollo":
/*!*********************************!*\
  !*** external "@nestjs/apollo" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/apollo");

/***/ }),

/***/ "@nestjs/axios":
/*!********************************!*\
  !*** external "@nestjs/axios" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("@nestjs/axios");

/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/graphql":
/*!**********************************!*\
  !*** external "@nestjs/graphql" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/graphql");

/***/ }),

/***/ "@nestjs/jwt":
/*!******************************!*\
  !*** external "@nestjs/jwt" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-ws":
/*!**************************************!*\
  !*** external "@nestjs/platform-ws" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-ws");

/***/ }),

/***/ "@nestjs/throttler":
/*!************************************!*\
  !*** external "@nestjs/throttler" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),

/***/ "@nestjs/websockets":
/*!*************************************!*\
  !*** external "@nestjs/websockets" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "bson":
/*!***********************!*\
  !*** external "bson" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("bson");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("express-session");

/***/ }),

/***/ "graphql":
/*!**************************!*\
  !*** external "graphql" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("graphql");

/***/ }),

/***/ "graphql-depth-limit":
/*!**************************************!*\
  !*** external "graphql-depth-limit" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("graphql-depth-limit");

/***/ }),

/***/ "graphql-upload":
/*!*********************************!*\
  !*** external "graphql-upload" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("graphql-upload");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("moment");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-google-oauth20":
/*!******************************************!*\
  !*** external "passport-google-oauth20" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("passport-google-oauth20");

/***/ }),

/***/ "rxjs/operators":
/*!*********************************!*\
  !*** external "rxjs/operators" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),

/***/ "sharp":
/*!************************!*\
  !*** external "sharp" ***!
  \************************/
/***/ ((module) => {

module.exports = require("sharp");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ "ws":
/*!*********************!*\
  !*** external "ws" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("ws");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ })

/******/ 	});
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
/*!**************************************!*\
  !*** ./apps/zinfurn-api/src/main.ts ***!
  \**************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./apps/zinfurn-api/src/app.module.ts");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Logging_interceptor_1 = __webpack_require__(/*! ./libs/interceptor/Logging.interceptor */ "./apps/zinfurn-api/src/libs/interceptor/Logging.interceptor.ts");
const graphql_upload_1 = __webpack_require__(/*! graphql-upload */ "graphql-upload");
const helmet_1 = __webpack_require__(/*! helmet */ "helmet");
const express = __webpack_require__(/*! express */ "express");
const session = __webpack_require__(/*! express-session */ "express-session");
const platform_ws_1 = __webpack_require__(/*! @nestjs/platform-ws */ "@nestjs/platform-ws");
const crypto_1 = __webpack_require__(/*! crypto */ "crypto");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginEmbedderPolicy: false,
    }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new Logging_interceptor_1.LoggingInterceptor());
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3006').split(',').map(o => o.trim());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin))
                return callback(null, true);
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    });
    app.use((0, graphql_upload_1.graphqlUploadExpress)({ maxFileSize: 15000000, maxFiles: 10 }));
    app.use('/uploads', express.static('./uploads'));
    app.use(session({
        secret: process.env.SESSION_SECRET || (0, crypto_1.randomBytes)(32).toString('hex'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000,
        },
    }));
    app.useWebSocketAdapter(new platform_ws_1.WsAdapter(app));
    await app.listen(process.env.PORT_API ?? 3000);
}
bootstrap();

})();

/******/ })()
;