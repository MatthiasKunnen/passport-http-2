export interface BasicStrategyOptions<PassRequest extends boolean = boolean> {
    realm?: string | undefined;
    passReqToCallback?: PassRequest | undefined;
}

export interface DigestStrategyOptions {
    realm?: string | undefined;
    domain?: string | string[] | undefined;
    opaque?: string | undefined;
    algorithm?: string | undefined;
    qop?: string | string[] | undefined;
}

export interface DigestValidateOptions {
    nonce: string;
    cnonce: string;
    nc: number;
    opaque: string;
}

export type BasicVerifyFunction = (
    username: string,
    password: string,
    done: (error: any, user?: any) => void,
) => any;

export type BasicVerifyFunctionWithRequest<Request = any> = (
    req: Request,
    username: string,
    password: string,
    done: (error: any, user?: any) => void,
) => any;

export type DigestSecretFunction = (
    username: string,
    done: (error: any, user?: any, password?: any) => void,
) => any;

export type DigestValidateFunction = (
    params: DigestValidateOptions,
    done: (error: any, valid: boolean) => void,
) => any;

interface StrategyCreatedStatic<User = any> {
    /**
     * Authenticate `user`, with optional `info`.
     *
     * Strategies should call this function to successfully authenticate a
     * user.  `user` should be an object supplied by the application after it
     * has been given an opportunity to verify credentials.  `info` is an
     * optional argument containing additional user information.  This is
     * useful for third-party authentication strategies to pass profile
     * details.
     */
    success(user: User, info?: object): void;
    /**
     * Fail authentication, with optional `challenge` and `status`, defaulting
     * to 401.
     *
     * Strategies should call this function to fail an authentication attempt.
     */
    fail(challenge?: string | number, status?: number): void;
    /**
     * Redirect to `url` with optional `status`, defaulting to 302.
     *
     * Strategies should call this function to redirect the user (via their
     * user agent) to a third-party website for authentication.
     */
    redirect(url: string, status?: number): void;
    /**
     * Pass without making a success or fail decision.
     *
     * Under most circumstances, Strategies should not need to call this
     * function.  It exists primarily to allow previous authentication state
     * to be restored, for example from an HTTP session.
     */
    pass(): void;
    /**
     * Internal error while performing authentication.
     *
     * Strategies should call this function when an internal error occurs
     * during the process of performing authentication; for example, if the
     * user directory is not available.
     */
    error(err: any): void;
}

type StrategyCreated<T, O = T & StrategyCreatedStatic> = {
    [P in keyof O]: O[P];
};

interface Strategy<Request = any> {
    name?: string | undefined;
    authenticate(this: StrategyCreated<this>, req: Request, options?: any): any;
}

export class BasicStrategy<Request = any> implements Strategy<Request> {
    constructor(verify: BasicVerifyFunction);
    constructor(options: BasicStrategyOptions<false>, verify: BasicVerifyFunction);
    constructor(options: BasicStrategyOptions<true>, verify: BasicVerifyFunctionWithRequest<Request>);

    name: string;
    authenticate(req: Request, options?: object): void;
}

export class DigestStrategy<Request = any> implements Strategy<Request> {
    constructor(secret: DigestSecretFunction, validate?: DigestValidateFunction);
    constructor(options: DigestStrategyOptions, secret: DigestSecretFunction, validate?: DigestValidateFunction);

    name: string;
    authenticate(req: Request, options?: object): void;
}
